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

contract OLDCalculateRecursivelyBalance {
    constructor() {}

    function calculateBalance(
        address directOwnerAddress,
        address[] memory collectionParentAddresses,
        address childAddress
    ) external view returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](0);

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
