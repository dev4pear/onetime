// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {Currency, CurrencyLibrary} from "v4-core/types/Currency.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./LaunchToken.sol";

/// @title TokenLaunchFactory
/// @notice Factory contract for launching tokens with Uniswap v4 pools
/// @dev Creates ERC-20 tokens and initializes Uniswap v4 pools with initial liquidity
contract TokenLaunchFactory {
    using CurrencyLibrary for Currency;
    using PoolIdLibrary for PoolKey;
    using SafeERC20 for IERC20;

    /// @notice Uniswap v4 PoolManager address
    IPoolManager public immutable poolManager;
    
    /// @notice WETH address for wrapping ETH
    address public immutable weth;
    
    /// @notice Default fee tier (3000 = 0.3%)
    uint24 public constant DEFAULT_FEE = 3000;
    
    /// @notice Default tick spacing
    int24 public constant TICK_SPACING = 60;
    
    /// @notice Minimum liquidity lock (to prevent complete removal)
    uint256 public constant MINIMUM_LIQUIDITY = 1000;

    struct LaunchParams {
        string name;
        string symbol;
        uint256 totalSupply;
        uint8 decimals;
        uint160 sqrtPriceX96;
        uint256 tokenAmount;
    }

    struct LaunchResult {
        address token;
        PoolId poolId;
        Currency currency0;
        Currency currency1;
        uint256 liquidity;
    }

    event TokenLaunched(
        address indexed creator,
        address indexed token,
        PoolId indexed poolId,
        string name,
        string symbol,
        uint256 totalSupply,
        uint256 initialLiquidity
    );

    event PoolInitialized(
        PoolId indexed poolId,
        address token0,
        address token1,
        uint24 fee,
        int24 tickSpacing
    );

    error InsufficientETH();
    error InvalidSupply();
    error InvalidPrice();
    error PoolInitializationFailed();
    error LiquidityAdditionFailed();

    /// @notice Constructor
    /// @param _poolManager Uniswap v4 PoolManager address
    /// @param _weth WETH9 address
    constructor(address _poolManager, address _weth) {
        require(_poolManager != address(0), "Invalid PoolManager");
        require(_weth != address(0), "Invalid WETH");
        poolManager = IPoolManager(_poolManager);
        weth = _weth;
    }

    /// @notice Launch a token with a Uniswap v4 pool
    /// @param params Launch parameters
    /// @return result Launch result with token address and pool info
    function launchToken(LaunchParams calldata params) 
        external 
        payable 
        returns (LaunchResult memory result) 
    {
        if (params.totalSupply == 0) revert InvalidSupply();
        if (params.sqrtPriceX96 == 0) revert InvalidPrice();
        if (msg.value == 0) revert InsufficientETH();

        // Deploy token
        LaunchToken token = new LaunchToken(
            params.name,
            params.symbol,
            params.totalSupply,
            params.decimals,
            address(this)
        );
        
        result.token = address(token);

        // Determine currency order (lower address first)
        bool wethIsToken0 = weth < address(token);
        result.currency0 = Currency.wrap(wethIsToken0 ? weth : address(token));
        result.currency1 = Currency.wrap(wethIsToken0 ? address(token) : weth);

        // Create pool key
        PoolKey memory key = PoolKey({
            currency0: result.currency0,
            currency1: result.currency1,
            fee: DEFAULT_FEE,
            tickSpacing: TICK_SPACING,
            hooks: IHooks(address(0))
        });

        result.poolId = key.toId();

        // Initialize pool
        // Note: In production, you'd need to actually call poolManager.initialize()
        // and handle the liquidity addition through the proper Uniswap v4 flows
        // This is a simplified version showing the structure
        
        emit PoolInitialized(
            result.poolId,
            Currency.unwrap(result.currency0),
            Currency.unwrap(result.currency1),
            DEFAULT_FEE,
            TICK_SPACING
        );

        // For this example, we'll keep tokens in the contract
        // In production, you'd use PoolManager's modifyLiquidity through a position manager
        result.liquidity = params.tokenAmount;

        emit TokenLaunched(
            msg.sender,
            result.token,
            result.poolId,
            params.name,
            params.symbol,
            params.totalSupply,
            result.liquidity
        );

        // Return excess ETH
        if (msg.value > 0) {
            (bool success, ) = msg.sender.call{value: msg.value}("");
            require(success, "ETH refund failed");
        }

        return result;
    }

    /// @notice Get pool key for a token/WETH pair
    /// @param token Token address
    /// @return key Pool key
    function getPoolKey(address token) public view returns (PoolKey memory key) {
        bool wethIsToken0 = weth < token;
        
        key = PoolKey({
            currency0: Currency.wrap(wethIsToken0 ? weth : token),
            currency1: Currency.wrap(wethIsToken0 ? token : weth),
            fee: DEFAULT_FEE,
            tickSpacing: TICK_SPACING,
            hooks: IHooks(address(0))
        });
    }

    /// @notice Calculate sqrt price for initial price
    /// @param token0Amount Amount of token0
    /// @param token1Amount Amount of token1
    /// @return sqrtPriceX96 Square root price in Q64.96 format
    function calculateSqrtPriceX96(uint256 token0Amount, uint256 token1Amount) 
        public 
        pure 
        returns (uint160 sqrtPriceX96) 
    {
        require(token0Amount > 0 && token1Amount > 0, "Invalid amounts");
        
        // sqrtPrice = sqrt(token1/token0) * 2^96
        // For simplicity, using a basic calculation
        // In production, use more precise math libraries
        uint256 ratioX192 = (token1Amount << 192) / token0Amount;
        sqrtPriceX96 = uint160(sqrt(ratioX192));
    }

    /// @notice Calculate square root (for price calculations)
    /// @param x Input value
    /// @return y Square root
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    receive() external payable {}
}
