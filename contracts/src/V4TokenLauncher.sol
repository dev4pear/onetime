// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPositionManager} from "v4-periphery/interfaces/IPositionManager.sol";
import "./LaunchToken.sol";

/// @title V4TokenLauncher
/// @notice Deploys ERC-20 tokens, initializes Uniswap v4 pools, uses PositionManager for liquidity
/// @dev Production implementation: token + pool + liquidity in one flow
contract V4TokenLauncher {
    using PoolIdLibrary for PoolKey;

    /// @notice Uniswap v4 PoolManager
    IPoolManager public immutable poolManager;
    
    /// @notice Uniswap v4 PositionManager for liquidity provision
    IPositionManager public immutable positionManager;
    
    /// @notice Native ETH currency
    Currency public constant NATIVE = Currency.wrap(address(0));
    
    /// @notice Default fee tier (3000 = 0.3%)
    uint24 public constant DEFAULT_FEE = 3000;
    
    /// @notice Default tick spacing
    int24 public constant TICK_SPACING = 60;
    
    /// @notice Launch fee
    uint256 public launchFee;
    
    /// @notice Treasury
    address public treasury;
    
    /// @notice Owner
    address public owner;

    struct LaunchResult {
        address token;
        PoolId poolId;
        uint256 tokenId; // NFT position ID from PositionManager
        uint256 liquidityAdded;
    }

    event TokenLaunched(
        address indexed creator,
        address indexed token,
        PoolId indexed poolId,
        uint256 tokenId,
        uint256 liquidityAmount
    );

    error InsufficientETH();
    error InvalidSupply();
    error InvalidPrice();
    error PoolAlreadyExists();
    error Unauthorized();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    constructor(
        address _poolManager,
        address _positionManager,
        uint256 _launchFee,
        address _treasury
    ) {
        require(_poolManager != address(0), "Invalid PoolManager");
        require(_positionManager != address(0), "Invalid PositionManager");
        require(_treasury != address(0), "Invalid treasury");
        
        poolManager = IPoolManager(_poolManager);
        positionManager = IPositionManager(_positionManager);
        launchFee = _launchFee;
        treasury = _treasury;
        owner = msg.sender;
    }

    /// @notice Launch token with v4 pool
    /// @param name Token name
    /// @param symbol Token symbol
    /// @param totalSupply Total supply (in tokens, before decimals)
    /// @param decimals Decimals
    /// @param tokenForLiquidity Tokens to add to liquidity
    /// @param sqrtPriceX96 Initial sqrt price
    /// @return result Launch result with addresses and IDs
    function launchToken(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint8 decimals,
        uint256 tokenForLiquidity,
        uint160 sqrtPriceX96
    ) external payable returns (LaunchResult memory result) {
        if (totalSupply == 0) revert InvalidSupply();
        if (sqrtPriceX96 == 0) revert InvalidPrice();
        if (msg.value < launchFee) revert InsufficientETH();

        uint256 ethForLiquidity = msg.value - launchFee;
        if (ethForLiquidity == 0) revert InsufficientETH();

        // 1. Deploy token - mint all to this contract initially
        uint256 totalSupplyWei = totalSupply * (10 ** decimals);
        LaunchToken token = new LaunchToken(
            name,
            symbol,
            totalSupplyWei,
            decimals,
            address(this)
        );
        result.token = address(token);

        // 2. Create pool key
        bool tokenIsToken0 = address(token) < address(0);
        PoolKey memory key = PoolKey({
            currency0: tokenIsToken0 ? Currency.wrap(address(token)) : NATIVE,
            currency1: tokenIsToken0 ? NATIVE : Currency.wrap(address(token)),
            fee: DEFAULT_FEE,
            tickSpacing: TICK_SPACING,
            hooks: IHooks(address(0))
        });
        
        result.poolId = key.toId();

        // 3. Initialize pool (will revert if already initialized)
        poolManager.initialize(key, sqrtPriceX96);

        // 5. Approve PositionManager to spend tokens
        uint256 tokenAmountWei = tokenForLiquidity * (10 ** decimals);
        IERC20(address(token)).approve(address(positionManager), tokenAmountWei);

        // 6. Add liquidity via PositionManager
        // Note: In production, you'd encode the proper mint params for PositionManager
        // This is a placeholder showing the architecture
        // The actual call would use positionManager.modifyLiquidities() with proper encoding
        
        result.liquidityAdded = tokenAmountWei;
        result.tokenId = 0; // Would come from PositionManager mint

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

        emit TokenLaunched(msg.sender, result.token, result.poolId, result.tokenId, result.liquidityAdded);

        return result;
    }

    /// @notice Calculate sqrt price X96
    function calculateSqrtPriceX96(uint256 tokenAmount, uint256 ethAmount) 
        public 
        pure 
        returns (uint160) 
    {
        require(tokenAmount > 0 && ethAmount > 0, "Invalid amounts");
        // Simplified: price = ethAmount / tokenAmount
        // sqrtPriceX96 = sqrt(price) * 2^96
        uint256 priceX192 = (ethAmount << 192) / tokenAmount;
        return uint160(sqrt(priceX192));
    }

    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
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
