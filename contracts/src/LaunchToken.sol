// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title LaunchToken
/// @notice Standard ERC-20 token deployed by ONETIME launchpad
/// @dev Mints entire supply to factory on deployment for pool initialization
contract LaunchToken is ERC20 {
    uint8 private immutable _decimals;
    
    /// @notice Deploy a new token
    /// @param name_ Token name
    /// @param symbol_ Token symbol
    /// @param totalSupply_ Total supply to mint (in wei units)
    /// @param decimals_ Number of decimals
    /// @param recipient Address to receive the total supply
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        uint8 decimals_,
        address recipient
    ) ERC20(name_, symbol_) {
        require(totalSupply_ > 0, "Supply must be positive");
        require(recipient != address(0), "Invalid recipient");
        
        _decimals = decimals_;
        _mint(recipient, totalSupply_);
    }
    
    /// @notice Returns the number of decimals
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}
