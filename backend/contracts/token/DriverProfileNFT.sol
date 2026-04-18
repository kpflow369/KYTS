// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract DriverProfileNFT is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 private _nextId;
    mapping(address => uint256) public profileTokenOf; // 0 if none

    error NonTransferable();
    error ProfileAlreadyExists();

    constructor(address admin) ERC721("DriverProfile", "DRVPROF") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function mintProfile(
        address driver,
        string memory uri
    ) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        if (profileTokenOf[driver] != 0) revert ProfileAlreadyExists();

        tokenId = ++_nextId;
        _safeMint(driver, tokenId);
        _setTokenURI(tokenId, uri);
        profileTokenOf[driver] = tokenId;
    }

    // Optional: admin can burn a profile (e.g., banned driver)
    function adminBurn(uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        address owner = ownerOf(tokenId);
        delete profileTokenOf[owner];
        _burn(tokenId);
    }

    // ---- Soulbound logic: block transfers in v4 using _beforeTokenTransfer ----

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override {
        // allow mint (from == 0) and burn (to == 0), block regular transfers
        if (from != address(0) && to != address(0)) {
            revert NonTransferable();
        }
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    // Also block approvals to avoid confusing UX
    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert NonTransferable();
    }

    function setApprovalForAll(address, bool)
        public
        pure
        override(ERC721, IERC721)
    {
        revert NonTransferable();
    }

    // ---- Required overrides for URIStorage & AccessControl ----

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}