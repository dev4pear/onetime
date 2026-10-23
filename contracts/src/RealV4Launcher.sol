// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPositionManager} from "v4-periphery/interfaces/IPositionManager.sol";
import {Actions} from "v4-periphery/libraries/Actions.sol";
import "./LaunchToken.sol";

/// @title RealV4Launcher
/// @notice Deploys ERC-20 + initializes Uniswap v4 pool + seeds real liquidity
contract RealV4Launcher {
    using PoolIdLibrary for PoolKey;

    IPoolManager public immutable poolManager;
    IPositionManager public immutable positionManager;
    
    Currency public constant NATIVE = Currency.wrap(address(0));
    uint24 public constant DEFAULT_FEE = 3000;
    int24 public constant TICK_SPACING = 60;
    
    uint256 public launchFee;
    address public treasury;
    address public owner;
    
    uint128 constant MAX_SLIPPAGE = type(uint128).max;

    struct LaunchResult {
        address token;
        PoolId poolId;
        uint256 positionTokenId;
    }

    event TokenLaunched(
        address indexed creator,
        address indexed token,
        PoolId indexed poolId,
        uint256 positionTokenId
    );

    error InsufficientETH();
    error InvalidSupply();
    error Unauthorized();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor(address _poolManager, address _positionManager, uint256 _launchFee, address _treasury) {
        require(_poolManager != address(0) && _positionManager != address(0) && _treasury != address(0), "Invalid address");
        poolManager = IPoolManager(_poolManager);
        positionManager = IPositionManager(_positionManager);
        launchFee = _launchFee;
        treasury = _treasury;
        owner = msg.sender;
    }

    /// @notice Launch token with v4 pool and liquidity
    /// @param name Token name
    /// @param symbol Token symbol
    /// @param totalSupply Total supply (before decimals)
    /// @param decimals Token decimals
    /// @param tokenAmountForLP Tokens for liquidity pool
    /// @param sqrtPriceX96 Initial sqrt price
    /// @param tickLower Lower tick for position
    /// @param tickUpper Upper tick for position
    /// @return result Launch result
    function launchToken(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint8 decimals,
        uint256 tokenAmountForLP,
        uint160 sqrtPriceX96,
        int24 tickLower,
        int24 tickUpper
    ) external payable returns (LaunchResult memory result) {
        if (totalSupply == 0 || tokenAmountForLP == 0) revert InvalidSupply();
        if (msg.value < launchFee) revert InsufficientETH();

        uint256 ethForLiquidity = msg.value - launchFee;
        if (ethForLiquidity == 0) revert InsufficientETH();

        // 1. Deploy token - mint all to this contract
        uint256 totalSupplyWei = totalSupply * (10 ** decimals);
        LaunchToken token = new LaunchToken(name, symbol, totalSupplyWei, decimals, address(this));
        result.token = address(token);

        // 2. Fix currency ordering: NATIVE (address(0)) vs token
        // address(token) is never < address(0), so NATIVE is always currency0
        PoolKey memory key = PoolKey({
            currency0: NATIVE,
            currency1: Currency.wrap(address(token)),
            fee: DEFAULT_FEE,
            tickSpacing: TICK_SPACING,
            hooks: IHooks(address(0))
        });
        
        result.poolId = key.toId();

        // 3. Initialize pool
        poolManager.initialize(key, sqrtPriceX96);

        // 4. Prepare liquidity params
        uint256 tokenLiquidityWei = tokenAmountForLP * (10 ** decimals);
        
        // Approve PositionManager
        IERC20(address(token)).approve(address(positionManager), tokenLiquidityWei);

        // 5. Build action plan using Planner pattern
        bytes memory actions;
        bytes[] memory params = new bytes[](3);
        
        // Action 0: MINT_POSITION
        params[0] = abi.encode(
            key,              // PoolKey
            tickLower,        // int24
            tickUpper,        // int24
            tokenLiquidityWei, // uint256 liquidity (approximate)
            MAX_SLIPPAGE,     // uint128 amount0Max
            MAX_SLIPPAGE,     // uint128 amount1Max
            msg.sender,       // address recipient (creator gets the NFT)
            ""                // bytes hookData
        );
        
        // Action 1: CLOSE_CURRENCY for currency0 (NATIVE/ETH)
        params[1] = abi.encode(key.currency0);
        
        // Action 2: CLOSE_CURRENCY for currency1 (TOKEN)
        params[2] = abi.encode(key.currency1);
        
        actions = abi.encodePacked(
            bytes1(uint8(Actions.MINT_POSITION)),
            bytes1(uint8(Actions.CLOSE_CURRENCY)),
            bytes1(uint8(Actions.CLOSE_CURRENCY))
        );
        
        bytes memory encodedPlan = abi.encode(actions, params);
        
        // 6. Execute with ETH value for native currency
        result.positionTokenId = positionManager.nextTokenId();
        positionManager.modifyLiquidities{value: ethForLiquidity}(encodedPlan, block.timestamp + 60);

        // 7. Transfer remaining tokens to creator
        uint256 remaining = IERC20(address(token)).balanceOf(address(this));
        if (remaining > 0) {
            IERC20(address(token)).transfer(msg.sender, remaining);
        }

        // 8. Send launch fee to treasury
        if (launchFee > 0) {
            (bool success, ) = treasury.call{value: launchFee}("");
            require(success, "Fee transfer failed");
        }

        emit TokenLaunched(msg.sender, result.token, result.poolId, result.positionTokenId);
        
        return result;
    }

    function setLaunchFee(uint256 newFee) external onlyOwner {
        launchFee = newFee;
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        treasury = newTreasury;
    }

    receive() external payable {}
}
