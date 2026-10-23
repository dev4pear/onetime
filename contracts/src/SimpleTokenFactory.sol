// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./LaunchToken.sol";

/// @title SimpleTokenFactory
/// @notice Factory contract for launching ERC-20 tokens
/// @dev Simplified version that deploys tokens. Uniswap v4 pool creation to be added.
contract SimpleTokenFactory {
    /// @notice Fee required to launch a token (sent to treasury)
    uint256 public launchFee;
    
    /// @notice Treasury address for collecting fees
    address public treasury;
    
    /// @notice Owner address
    address public owner;

    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint256 totalSupply;
        uint8 decimals;
        address creator;
        uint256 timestamp;
    }

    /// @notice Mapping of token address to token info
    mapping(address => TokenInfo) public tokens;
    
    /// @notice Array of all launched tokens
    address[] public launchedTokens;

    event TokenLaunched(
        address indexed creator,
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 totalSupply,
        uint8 decimals,
        uint256 timestamp
    );

    event LaunchFeeUpdated(uint256 oldFee, uint256 newFee);
    event TreasuryUpdated(address oldTreasury, address newTreasury);

    error InsufficientFee();
    error InvalidSupply();
    error Unauthorized();

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    /// @notice Constructor
    /// @param _launchFee Initial launch fee
    /// @param _treasury Treasury address
    constructor(uint256 _launchFee, address _treasury) {
        launchFee = _launchFee;
        treasury = _treasury;
        owner = msg.sender;
    }

    /// @notice Launch a new token
    /// @param name Token name
    /// @param symbol Token symbol
    /// @param totalSupply Total supply (in tokens, will be multiplied by 10^decimals)
    /// @param decimals Number of decimals
    /// @return tokenAddress Address of the deployed token
    function launchToken(
        string calldata name,
        string calldata symbol,
        uint256 totalSupply,
        uint8 decimals
    ) external payable returns (address tokenAddress) {
        if (msg.value < launchFee) revert InsufficientFee();
        if (totalSupply == 0) revert InvalidSupply();

        // Calculate total supply in wei
        uint256 totalSupplyWei = totalSupply * (10 ** decimals);

        // Deploy token (mints to creator)
        LaunchToken token = new LaunchToken(
            name,
            symbol,
            totalSupplyWei,
            decimals,
            msg.sender
        );

        tokenAddress = address(token);

        // Store token info
        tokens[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            name: name,
            symbol: symbol,
            totalSupply: totalSupplyWei,
            decimals: decimals,
            creator: msg.sender,
            timestamp: block.timestamp
        });

        launchedTokens.push(tokenAddress);

        emit TokenLaunched(
            msg.sender,
            tokenAddress,
            name,
            symbol,
            totalSupplyWei,
            decimals,
            block.timestamp
        );

        // Send fee to treasury
        if (msg.value > 0) {
            (bool success, ) = treasury.call{value: msg.value}("");
            require(success, "Fee transfer failed");
        }

        return tokenAddress;
    }

    /// @notice Get total number of launched tokens
    function getTotalTokens() external view returns (uint256) {
        return launchedTokens.length;
    }

    /// @notice Get token info
    /// @param tokenAddress Token address
    /// @return Token info struct
    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory) {
        return tokens[tokenAddress];
    }

    /// @notice Update launch fee
    /// @param newFee New launch fee
    function setLaunchFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = launchFee;
        launchFee = newFee;
        emit LaunchFeeUpdated(oldFee, newFee);
    }

    /// @notice Update treasury address
    /// @param newTreasury New treasury address
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    receive() external payable {}
}
