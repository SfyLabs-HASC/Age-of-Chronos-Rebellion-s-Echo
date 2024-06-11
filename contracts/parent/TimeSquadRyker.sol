// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import {
    RMRKAbstractEquippable
} from "@rmrk-team/evm-contracts/contracts/implementations/abstract/RMRKAbstractEquippable.sol";
import {
    RMRKTokenURIEnumerated
} from "@rmrk-team/evm-contracts/contracts/implementations/utils/RMRKTokenURIEnumerated.sol";
import {
    RMRKImplementationBase
} from "@rmrk-team/evm-contracts/contracts/implementations/utils/RMRKImplementationBase.sol";
import {
    RMRKSoulboundPerToken
} from "@rmrk-team/evm-contracts/contracts/RMRK/extension/soulbound/RMRKSoulboundPerToken.sol";
import {
    RMRKSoulbound
} from "@rmrk-team/evm-contracts/contracts/RMRK/extension/soulbound/RMRKSoulbound.sol";
import {
    RMRKTokenHolder
} from "@rmrk-team/evm-contracts/contracts/RMRK/extension/tokenHolder/RMRKTokenHolder.sol";
import {
    IERC721Enumerable
} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

error ERC721OutOfBoundsIndex(address owner, uint256 index);
error OnlyNFTOwnerCanTransferTokensFromIt();

contract TimeSquadRyker is
    RMRKAbstractEquippable,
    RMRKTokenURIEnumerated,
    RMRKSoulboundPerToken,
    RMRKTokenHolder
{
    using Strings for uint256;

    // Events
    /**
     * @notice From ERC4906 This event emits when the metadata of a token is changed.
     *  So that the third-party platforms such as NFT market could
     *  get notified when the metadata of a token is changed.
     */
    event MetadataUpdate(uint256 _tokenId);

    // Variables
    mapping(address => bool) private _hasMinted;
    string private baseURI;
    uint64 private mainAsset = 1;
    string private baseExtension = ".json";
    bool private paused = false;

    mapping(address => bool) private _autoAcceptCollection;

    // IERC721Enumerable
    mapping(address owner => mapping(uint256 index => uint256))
        private _ownedTokens;
    mapping(uint256 tokenId => uint256) private _ownedTokensIndex;
    uint256[] private _allTokens;
    mapping(uint256 tokenId => uint256) private _allTokensIndex;

    // Constructor
    constructor(
        string memory collectionMetadata,
        uint256 maxSupply,
        address royaltyRecipient,
        uint16 royaltyPercentageBps,
        string memory baseTokenURI
    )
        RMRKImplementationBase(
            "Ryker Blade - Age Of Chronos",
            "RYKERBLADE",
            collectionMetadata,
            maxSupply,
            royaltyRecipient,
            royaltyPercentageBps
        )
        RMRKTokenURIEnumerated(baseTokenURI)
    {
        baseURI = baseTokenURI;
    }

    // Methods
    /**
     * @notice Used to mint the desired number of tokens to the specified address.
     * @dev The "data" value of the "_safeMint" method is set to an empty value.
     * @dev Can only be called while the open sale is open.
     * @param to Address to which to mint the token
     * @return The ID of the first token to be minted in the current minting cycle
     */
    function mint(address to) public returns (uint256) {
        if (!isContributor(msg.sender)) {
            require(!_hasMinted[to], "Address has already minted an NFT");
        }
        require(!paused, "Minting is paused");
        (uint256 nextToken, uint256 totalSupplyOffset) = _prepareMint(1);

        for (uint256 i = nextToken; i < totalSupplyOffset; ) {
            _safeMint(to, i, "");
            _setSoulbound(i, true);
            _addAssetToToken(i, 1, 0);
            unchecked {
                ++i;
            }
        }
        _hasMinted[to] = true; // Segna l'indirizzo come avente già mintato un NFT
        return nextToken;
    }

    /**
     * @notice Set or unset a token as soulbound.
     * @param tokenId The ID of the token to update.
     * @param state true to make the token soulbound, false to make it transferable.
     */
    function setSoulbound(
        uint256 tokenId,
        bool state
    ) public onlyOwnerOrContributor {
        _setSoulbound(tokenId, state);
    }

    /**
     * @notice Set a new base URI for all tokens.
     * @param _newBaseURI The new base URI to set.
     */
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    /**
     * @notice Set a new base extension for all tokens.
     * @param _newBaseExtension The new base extension to set.
     */
    function setBaseExtension(
        string memory _newBaseExtension
    ) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    /**
     * @notice Set the main asset ID for all tokens.
     * @param _mainAsset The new main asset ID to set.
     */
    function setMainAsset(uint64 _mainAsset) public onlyOwner {
        mainAsset = _mainAsset;
    }

    /**
     * @notice Pause or unpause minting.
     * @param _state The new paused state to set.
     */
    function setPause(bool _state) public onlyOwner {
        paused = _state;
    }

    /**
     * @notice Get the current base URI.
     * @return The current base URI.
     */
    function getBaseURI() public view returns (string memory) {
        return baseURI;
    }

    /**
     * @notice Get the current base extension.
     * @return The current base extension.
     */
    function getBaseExtension() public view returns (string memory) {
        return baseExtension;
    }

    /**
     * @notice Get the current main asset ID.
     * @return The current main asset ID.
     */
    function getMainAsset() public view returns (uint64) {
        return mainAsset;
    }

    /**
     * @notice Check if minting is paused.
     * @return True if minting is paused, false otherwise.
     */
    function isPaused() public view returns (bool) {
        return paused;
    }

    /**
     * @notice Check if an address has minted.
     * @param account The address to check.
     * @return True if the address has minted, false otherwise.
     */
    function hasMinted(address account) public view returns (bool) {
        return _hasMinted[account];
    }

    /**
     * @dev Returns the token URI for the specified token ID.
     * @param tokenId The ID of the token.
     * @return The token URI.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireMinted(tokenId);
        // This will revert if the token has not assets, only use if at least an asset is assigned on mint to every token
        return getAssetMetadata(tokenId, _activeAssets[tokenId][0]);
    }

    function getAssetMetadata(
        uint256 tokenId,
        uint64 assetId
    ) public view override returns (string memory) {
        if (assetId == mainAsset) {
            return
                string(
                    abi.encodePacked(
                        baseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                );
        } else {
            return super.getAssetMetadata(tokenId, assetId);
        }
    }

    /**
     * @notice Hook that is called after an asset is accepted to a token's active assets array.
     * @param tokenId ID of the token for which the asset has been accepted
     * @param index Index of the asset in the token's pending assets array
     * @param assetId ID of the asset expected to have been located at the specified index
     * @param replacedAssetId ID of the asset that has been replaced by the accepted asset
     */
    function _afterAcceptAsset(
        uint256 tokenId,
        uint256 index,
        uint64 assetId,
        uint64 replacedAssetId
    ) internal virtual override {
        if (replacedAssetId != 0) {
            emit MetadataUpdate(tokenId);
        }
    }

    /**
     * @inheritdoc IERC165
     */
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(RMRKTokenHolder, RMRKSoulbound, RMRKAbstractEquippable)
        returns (bool)
    {
        return
            type(IERC721Enumerable).interfaceId == interfaceId ||
            RMRKAbstractEquippable.supportsInterface(interfaceId) ||
            RMRKSoulbound.supportsInterface(interfaceId) ||
            RMRKTokenHolder.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(RMRKSoulbound, RMRKAbstractEquippable) {
        RMRKSoulbound._beforeTokenTransfer(from, to, tokenId);
        RMRKAbstractEquippable._beforeTokenTransfer(from, to, tokenId);

        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }
        if (to == address(0)) {
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (from != to) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    // IERC721Enumerable (Based on OpenZeppelin implementation)

    /**
     * @dev See {IERC721Enumerable-tokenOfOwnerByIndex}.
     */
    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) public view virtual returns (uint256) {
        if (index >= balanceOf(owner)) {
            revert ERC721OutOfBoundsIndex(owner, index);
        }
        return _ownedTokens[owner][index];
    }

    /**
     * @dev See {IERC721Enumerable-tokenByIndex}.
     */
    function tokenByIndex(uint256 index) public view virtual returns (uint256) {
        if (index >= totalSupply()) {
            revert ERC721OutOfBoundsIndex(address(0), index);
        }
        return _allTokens[index];
    }

    /**
     * @dev Private function to add a token to this extension's ownership-tracking data structures.
     * @param to address representing the new owner of the given token ID
     * @param tokenId uint256 ID of the token to be added to the tokens list of the given address
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
    }

    /**
     * @dev Private function to add a token to this extension's token tracking data structures.
     * @param tokenId uint256 ID of the token to be added to the tokens list
     */
    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    /**
     * @dev Private function to remove a token from this extension's ownership-tracking data structures. Note that
     * while the token is not assigned a new owner, the `_ownedTokensIndex` mapping is _not_ updated: this allows for
     * gas optimizations e.g. when performing a transfer operation (avoiding double writes).
     * This has O(1) time complexity, but alters the order of the _ownedTokens array.
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be removed from the tokens list of the given address
     */
    function _removeTokenFromOwnerEnumeration(
        address from,
        uint256 tokenId
    ) private {
        // To prevent a gap in from's tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = balanceOf(from) - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }

        // This also deletes the contents at the last position of the array
        delete _ownedTokensIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    /**
     * @dev Private function to remove a token from this extension's token tracking data structures.
     * This has O(1) time complexity, but alters the order of the _allTokens array.
     * @param tokenId uint256 ID of the token to be removed from the tokens list
     */
    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        // To prevent a gap in the tokens array, we store the last token in the index of the token to delete, and
        // then delete the last slot (swap and pop).

        uint256 lastTokenIndex = _allTokens.length - 1;
        uint256 tokenIndex = _allTokensIndex[tokenId];

        // When the token to delete is the last token, the swap operation is unnecessary. However, since this occurs so
        // rarely (when the last minted token is burnt) that we still do the swap here to avoid the gas cost of adding
        // an 'if' statement (like in _removeTokenFromOwnerEnumeration)
        uint256 lastTokenId = _allTokens[lastTokenIndex];

        _allTokens[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
        _allTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index

        // This also deletes the contents at the last position of the array
        delete _allTokensIndex[tokenId];
        _allTokens.pop();
    }

    /**
     * @notice Transfers held ERC20 tokens from a token.
     * @param erc20Contract The ERC20 contract address.
     * @param tokenHolderId The ID of the token holding the ERC20 tokens.
     * @param to The address to transfer the tokens to.
     * @param amount The amount of tokens to transfer.
     * @param data Additional data.
     */
    function transferHeldERC20FromToken(
        address erc20Contract,
        uint256 tokenHolderId,
        address to,
        uint256 amount,
        bytes memory data
    ) external {
        if (_msgSender() != ownerOf(tokenHolderId)) {
            revert OnlyNFTOwnerCanTransferTokensFromIt();
        }
        _transferHeldERC20FromToken(
            erc20Contract,
            tokenHolderId,
            to,
            amount,
            data
        );
    }

    /**
     * @notice Sets auto accept status for a collection.
     * @param collection The address of the collection.
     * @param autoAccept Boolean value indicating whether to auto accept the collection.
     */
    function setAutoAcceptCollection(
        address collection,
        bool autoAccept
    ) public virtual onlyOwnerOrContributor {
        _autoAcceptCollection[collection] = autoAccept;
    }

    function _afterAddChild(
        uint256 tokenId,
        address childAddress,
        uint256 childId,
        bytes memory
    ) internal virtual override {
        // Auto accept children if they are from known collections
        if (_autoAcceptCollection[childAddress]) {
            _acceptChild(
                tokenId,
                _pendingChildren[tokenId].length - 1,
                childAddress,
                childId
            );
        }
    }

    /**
     * @notice Locks the supply of the tokens.
     */
    function lockSupply() external onlyOwner {
        _maxSupply = _totalSupply;
    }
}
