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
        
        // Official Uniswap v4 addresses (from developers.uniswap.org)
        address poolManager = 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543; // Sepolia
        address positionManager = 0x429ba70129df741B2Ca2a85BC3A2a3328e5c09b4; // Sepolia

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
