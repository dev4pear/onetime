// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {RealV4Launcher} from "../src/RealV4Launcher.sol";
import {LaunchToken} from "../src/LaunchToken.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {IPositionManager} from "v4-periphery/interfaces/IPositionManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {StateLibrary} from "v4-core/libraries/StateLibrary.sol";

contract RealV4LauncherTest is Test {
    using PoolIdLibrary for PoolKey;
    using StateLibrary for IPoolManager;

    RealV4Launcher public launcher;
    IPoolManager public poolManager;
    IPositionManager public positionManager;
    
    address public treasury = address(0x1234);
    address public creator = address(0x5678);
    
    uint256 constant LAUNCH_FEE = 0.001 ether;
    
    // Official Uniswap v4 addresses (from developers.uniswap.org)
    address constant SEPOLIA_POOL_MANAGER = 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543;
    address constant SEPOLIA_POSITION_MANAGER = 0x429ba70129df741B2Ca2a85BC3A2a3328e5c09b4;

    function setUp() public {
        string memory sepoliaRpc = vm.envOr("SEPOLIA_RPC_URL", string(""));
        require(bytes(sepoliaRpc).length > 0, "SEPOLIA_RPC_URL not set - test cannot run");
        
        vm.createSelectFork(sepoliaRpc);
        
        poolManager = IPoolManager(SEPOLIA_POOL_MANAGER);
        positionManager = IPositionManager(SEPOLIA_POSITION_MANAGER);
        
        launcher = new RealV4Launcher(
            address(poolManager),
            address(positionManager),
            LAUNCH_FEE,
            treasury
        );
        
        // Give creator some ETH
        vm.deal(creator, 10 ether);
    }

    function test_launchToken() public {
        vm.startPrank(creator);
        
        uint256 treasuryBalanceBefore = treasury.balance;
        
        // Launch parameters
        string memory name = "Test Token";
        string memory symbol = "TEST";
        uint256 totalSupply = 1000000; // 1M tokens
        uint8 decimals = 18;
        uint256 tokenAmountForLP = 500000; // 500K for LP
        uint160 sqrtPriceX96 = 79228162514264337593543950336; // 1:1 price
        int24 tickLower = -60; // One tick below
        int24 tickUpper = 60;  // One tick above
        
        uint256 ethForLiquidity = 1 ether;
        uint256 totalValue = LAUNCH_FEE + ethForLiquidity;
        
        // Execute launch
        RealV4Launcher.LaunchResult memory result = launcher.launchToken{value: totalValue}(
            name,
            symbol,
            totalSupply,
            decimals,
            tokenAmountForLP,
            sqrtPriceX96,
            tickLower,
            tickUpper
        );
        
        vm.stopPrank();
        
        // Verify token was deployed
        assertFalse(result.token == address(0), "Token not deployed");
        
        LaunchToken token = LaunchToken(result.token);
        assertEq(token.name(), name, "Token name mismatch");
        assertEq(token.symbol(), symbol, "Token symbol mismatch");
        assertEq(token.decimals(), decimals, "Token decimals mismatch");
        
        // Verify treasury received launch fee
        assertEq(treasury.balance - treasuryBalanceBefore, LAUNCH_FEE, "Treasury didn't receive fee");
        
        // Verify pool was created (poolId is not zero)
        assertTrue(PoolId.unwrap(result.poolId) != bytes32(0), "Pool not created");
        
        // Verify pool is initialized (sqrtPriceX96 != 0)
        (uint160 poolSqrtPriceX96,,,) = poolManager.getSlot0(result.poolId);
        assertTrue(poolSqrtPriceX96 > 0, "Pool not initialized");
        
        // Verify position NFT was minted to creator
        assertEq(IERC721(address(positionManager)).ownerOf(result.positionTokenId), creator, "NFT not owned by creator");
        
        // Verify creator received remaining tokens
        assertEq(
            token.balanceOf(creator),
            (totalSupply - tokenAmountForLP) * 10**decimals,
            "Wrong token balance"
        );
        
        console.log("Token deployed:", result.token);
        console.log("Pool sqrtPrice:", poolSqrtPriceX96);
        console.log("Position NFT:", result.positionTokenId);
    }
    
    function test_currencyOrdering() public {
        // Test that native ETH (address(0)) is always currency0
        address tokenAddr = address(0x1111);
        
        Currency native = Currency.wrap(address(0));
        Currency token = Currency.wrap(tokenAddr);
        
        // address(0) should be < any other address
        assertTrue(Currency.unwrap(native) < Currency.unwrap(token), "Native should be currency0");
        
        console.log("Native ETH (address(0)) correctly ordered as currency0");
    }
}
