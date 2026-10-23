// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {SimpleTokenFactory} from "../src/SimpleTokenFactory.sol";

contract DeployFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        uint256 launchFee = vm.envUint("LAUNCH_FEE");

        vm.startBroadcast(deployerPrivateKey);

        SimpleTokenFactory factory = new SimpleTokenFactory(launchFee, treasury);

        console.log("SimpleTokenFactory deployed at:", address(factory));
        console.log("Launch fee:", launchFee);
        console.log("Treasury:", treasury);

        vm.stopBroadcast();
    }
}
