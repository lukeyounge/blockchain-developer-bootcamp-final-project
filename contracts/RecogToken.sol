// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/// @title A contract for allowing users to mint their own NFTs
/// @author Luke Younge Nov 2021
/// @notice This contract is meant for the Consensys academoy final project

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// contract RecogToken is ERC721, ERC721URIStorage 
contract RecogToken is ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    /// Sets the msg.sender as the owner
    address owner = msg.sender;

    /// @dev this role is used to grant access to the mint function
    /// @notice creates a role for minting tokens
    mapping(address => bool) public minterRole;

    /// @notice a simple getter function to query an account's role
    /// @param _account the account to query
    /// @return true if the account is a minter, false otherwise
    function getMinterRole(address _account) public view returns (bool) {
        return minterRole[_account];
    }

    /// @notice function to add a new minter, with paying 0.001 ether
    /// @param _minter the account to add as a minter
    /// @return true if the account was added as a minter, false otherwise
    function addMinter(address _minter) public payable {
        require(msg.value >= 1000000000000000, "pay at least 0.001 eth to sign up as a minter");
        require(_minter != address(0));
        require(minterRole[_minter] == false);
        minterRole[_minter] = true;
    }

    /// @notice a function to remove a minter, not currently used
    /// @param _minter the account to remove as a minter
    function removeMinter(address _minter) public {
        require(_minter != address(0));
        require(minterRole[_minter] == true);
        minterRole[_minter] = false;
    }

    /// @notice this is inherited from OpenZeppelin ERC721

    function _baseURI() internal pure override returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    /// @dev constructor for the RecogToken contract
    constructor() ERC721("RecogToken", "RCT") {}
        // minterRole[owner] = true;
    
    /// @dev this function creates the tokenId and mints the token to the msg.sender
    /// @param _uri the URI of the token
    /// @param to the address to mint the token to
    function safeMint(address to, string memory uri) public {
        require( minterRole[to], "Only minter can mint tokens" );
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /// @dev Function to withdraw ether from contract address
    /// @notice only the owner can withdraw ether
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    /// @dev The following function is an override required by Solidity, and recommeded by OpenZeppelin
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    /// @dev The following function is an override required by Solidity, and recommeded by OpenZeppelin
    /// @return tokenId
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}