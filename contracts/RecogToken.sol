// SPDX-License-Identifier: MIT
pragma solidity 0.8.2;

/// @title A contract for allowing users to mint their own NFTs
/// @author Luke Younge Nov 2021
/// @notice This contract is meant for the Consensys academoy final project

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// contract RecogToken is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard
contract RecogToken is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    /// @notice Maximum number of tokens that can be minted
    uint256 public constant MAX_SUPPLY = 10000;

    /// @dev this role is used to grant access to the mint function
    /// @notice creates a role for minting tokens
    mapping(address => bool) public minterRole;

    /// @dev Events for tracking state changes
    event MinterAdded(address indexed minter, address indexed addedBy);
    event MinterRemoved(address indexed minter, address indexed removedBy);
    event TokenMinted(address indexed to, uint256 indexed tokenId, string uri);
    event Withdrawal(address indexed owner, uint256 amount);

    /// @notice a simple getter function to query an account's role
    /// @param _account the account to query
    function getMinterRole(address _account) public view returns (bool) {
        return minterRole[_account];
    }

    /// @notice function to add a new minter, with paying 0.001 ether
    /// @param _minter the account to add as a minter
    function addMinter(address _minter) public payable {
        require(msg.value >= 1000000000000000, "pay at least 0.001 eth to sign up as a minter");
        require(_minter != address(0), "Cannot add zero address as minter");
        require(minterRole[_minter] == false, "Address is already a minter");
        minterRole[_minter] = true;
        emit MinterAdded(_minter, msg.sender);
    }

    /// @notice a function to remove a minter, only callable by owner or the minter themselves
    /// @param _minter the account to remove as a minter
    function removeMinter(address _minter) public {
        require(
            msg.sender == owner() || msg.sender == _minter,
            "Only owner or minter themselves can remove minter role"
        );
        require(_minter != address(0), "Cannot remove zero address");
        require(minterRole[_minter] == true, "Address is not a minter");
        minterRole[_minter] = false;
        emit MinterRemoved(_minter, msg.sender);
    }

    /// @notice this is inherited from OpenZeppelin ERC721

    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    /// @dev receive and fallback so the contract can receive data and messages and not be destroyed
    receive() external payable {
    }

    fallback() external payable {
    }

    /// @dev constructor for the RecogToken contract
    constructor() ERC721("RecogToken", "RCT") {}


    /// @dev this function creates the tokenId and mints the token to the msg.sender
    /// @notice Only addresses with minter role can mint. Caller must be the minter.
    /// @param to the address to mint the token to
    /// @param uri the URI of the token
    function safeMint(address to, string memory uri) public {
        require(minterRole[msg.sender], "Caller must have minter role");
        require(to == msg.sender, "Can only mint to your own address");
        require(_tokenIdCounter.current() < MAX_SUPPLY, "Max supply reached");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit TokenMinted(to, tokenId, uri);
    }

    /// @dev Function to withdraw ether from contract address
    /// @notice only the owner can withdraw ether, protected against reentrancy
    function withdraw() public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        emit Withdrawal(msg.sender, balance);
        (bool success, ) = owner().call{value: balance}("");
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
