// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {SimpleTokenFactory} from "../src/SimpleTokenFactory.sol";

/// @notice Deploy SimpleTokenFactory (production ready, no v4)
contract DeploySimpleFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        uint256 launchFee = vm.envUint("LAUNCH_FEE");

        vm.startBroadcast(deployerPrivateKey);

        SimpleTokenFactory factory = new SimpleTokenFactory(launchFee, treasury);

        console.log("=== SimpleTokenFactory Deployed ===");
        console.log("Address:", address(factory));
        console.log("Launch Fee:", launchFee, "wei");
        console.log("Treasury:", treasury);
        console.log("");
        console.log("Update your .env.local:");
        console.log("NEXT_PUBLIC_FACTORY_ADDRESS=%s", address(factory));

        vm.stopBroadcast();
    }
}
