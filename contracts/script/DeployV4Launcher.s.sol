// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {RealV4Launcher} from "../src/RealV4Launcher.sol";

/// @notice Deploy RealV4Launcher with Uniswap v4
contract DeployV4Launcher is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        uint256 launchFee = vm.envUint("LAUNCH_FEE");
        
        // Sepolia v4 addresses
        address poolManager = 0x8C4BcBE6b9eF47855f97E675296FA3F6fafa5F1A;
        address positionManager = vm.envOr("POSITION_MANAGER", address(0));
        
        require(positionManager != address(0), "Set POSITION_MANAGER in .env");

        vm.startBroadcast(deployerPrivateKey);

        RealV4Launcher launcher = new RealV4Launcher(
            poolManager,
            positionManager,
            launchFee,
            treasury
        );

        console.log("=== RealV4Launcher Deployed ===");
        console.log("Address:", address(launcher));
        console.log("Pool Manager:", poolManager);
        console.log("Position Manager:", positionManager);
        console.log("Launch Fee:", launchFee, "wei");
        console.log("Treasury:", treasury);
        console.log("");
        console.log("Update your .env.local:");
        console.log("NEXT_PUBLIC_FACTORY_ADDRESS=%s", address(launcher));
        console.log("NEXT_PUBLIC_USE_V4=true");

        vm.stopBroadcast();
    }
}
