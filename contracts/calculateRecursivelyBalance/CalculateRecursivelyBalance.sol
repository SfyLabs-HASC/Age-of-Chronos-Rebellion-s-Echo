// SPDX-License-Identifier: Apache-2.0

/************************************************
 **        Calculate Recursively Balance        **
 **        Made by @ercole89 for SFY Labs       **
 **            sfy.startup@gmail.com            **
 ************************************************/

pragma solidity ^0.8.21;

interface IParent {
    function ownerOf(uint256 tokenId) external view returns (address);

    function directOwnerOf(
        uint256 tokenId
    ) external view returns (address owner, uint256 parentId, bool isNFT);

    function balanceOf(address owner) external view returns (uint256);

    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) external view returns (uint256);
}

interface IChild {
    function ownerOf(uint256 tokenId) external view returns (address);

    function directOwnerOf(
        uint256 tokenId
    ) external view returns (address owner, uint256 parentId, bool isNFT);

    function balanceOf(address owner) external view returns (uint256);

    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) external view returns (uint256);
}

contract CalculateRecursivelyBalance {
    address public rykerCollection;
    address public lunaCollection;
    address public ariaCollection;
    address public thaddeusCollection;

    address private _owner;

    string public name;

    modifier onlyOwner() {
        require(msg.sender == _owner, "Caller is not the owner");
        _;
    }

    constructor() {
        _owner = msg.sender;
        name = "CalculateRecursivelyBalance";
    }

    /**
     * @notice Sets the Ryker collection address. Only callable by the owner.
     * @param _rykerCollection The new Ryker collection address.
     */
    function setRykerCollection(address _rykerCollection) external onlyOwner {
        rykerCollection = _rykerCollection;
    }

    /**
     * @notice Sets the Luna collection address. Only callable by the owner.
     * @param _lunaCollection The new Luna collection address.
     */
    function setLunaCollection(address _lunaCollection) external onlyOwner {
        lunaCollection = _lunaCollection;
    }

    /**
     * @notice Sets the Aria collection address. Only callable by the owner.
     * @param _ariaCollection The new Aria collection address.
     */
    function setAriaCollection(address _ariaCollection) external onlyOwner {
        ariaCollection = _ariaCollection;
    }

    /**
     * @notice Sets the Thaddeus collection address. Only callable by the owner.
     * @param _thaddeusCollection The new Thaddeus collection address.
     */
    function setThaddeusCollection(address _thaddeusCollection) external onlyOwner {
        thaddeusCollection = _thaddeusCollection;
    }

    /**
     * @notice Returns the list of collection addresses.
     * @return An array of collection addresses.
     */
    function getCollectionAddresses() internal view returns (address[] memory) {
        address[] memory collections = new address[](4);
        collections[0] = rykerCollection;
        collections[1] = lunaCollection;
        collections[2] = ariaCollection;
        collections[3] = thaddeusCollection;
        return collections;
    }

        /**
     * @notice Returns the list of collection addresses.
     * @return An array of collection addresses.
     */
    function getExternalCollectionAddresses() external view returns (address[] memory) {
        address[] memory collections = new address[](4);
        collections[0] = rykerCollection;
        collections[1] = lunaCollection;
        collections[2] = ariaCollection;
        collections[3] = thaddeusCollection;
        return collections;
    }

    function calculateBalance(
        address directOwnerAddress,
        address childAddress
    ) external view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](0);
        address[] memory collectionParentAddresses = getCollectionAddresses();

        // Calcola il bilancio dei child NFT non annidati
        tokenIds = _calculateUnnestedBalance(
            directOwnerAddress,
            childAddress,
            tokenIds
        );

        // Calcola il bilancio dei child NFT annidati
        for (uint256 i = 0; i < collectionParentAddresses.length; i++) {
            tokenIds = _calculateNestedBalance(
                directOwnerAddress,
                collectionParentAddresses[i],
                childAddress,
                tokenIds
            );
        }
        return tokenIds;
    }

    function _calculateUnnestedBalance(
        address directOwnerAddress,
        address childAddress,
        uint256[] memory tokenIds
    ) internal view returns (uint256[] memory) {
        uint256 childBalance = IChild(childAddress).balanceOf(
            directOwnerAddress
        );

        for (uint256 j = 0; j < childBalance; j++) {
            uint256 childTokenId = IChild(childAddress).tokenOfOwnerByIndex(
                directOwnerAddress,
                j
            );

            if (!_contains(tokenIds, childTokenId)) {
                tokenIds = _append(tokenIds, childTokenId);
            }
        }

        return tokenIds;
    }

    function _calculateNestedBalance(
        address directOwnerAddress,
        address collectionParentAddress,
        address childAddress,
        uint256[] memory tokenIds
    ) internal view returns (uint256[] memory) {
        uint256 parentBalance = IParent(collectionParentAddress).balanceOf(
            directOwnerAddress
        );

        for (uint256 j = 0; j < parentBalance; j++) {
            uint256 childBalance = IChild(childAddress).balanceOf(
                collectionParentAddress
            );

            for (uint256 k = 0; k < childBalance; k++) {
                uint256 childTokenId = IChild(childAddress).tokenOfOwnerByIndex(
                    collectionParentAddress,
                    k
                );
                address childOnwer = IChild(childAddress).ownerOf(childTokenId);
                if (childOnwer == directOwnerAddress) {
                    if (!_contains(tokenIds, childTokenId)) {
                        tokenIds = _append(tokenIds, childTokenId);
                    }
                }
            }
        }
        return tokenIds;
    }

    function _contains(
        uint256[] memory array,
        uint256 item
    ) internal pure returns (bool) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == item) {
                return true;
            }
        }
        return false;
    }

    function _append(
        uint256[] memory array,
        uint256 item
    ) internal pure returns (uint256[] memory) {
        uint256 length = array.length;
        uint256[] memory newArray = new uint256[](length + 1);
        for (uint256 i = 0; i < length; i++) {
            newArray[i] = array[i];
        }
        newArray[length] = item;
        return newArray;
    }
}
