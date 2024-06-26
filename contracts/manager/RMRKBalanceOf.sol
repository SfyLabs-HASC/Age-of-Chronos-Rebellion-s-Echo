// SPDX-License-Identifier: Apache-2.0

/************************************************
 **        Manager Contract for AgeOfChronos    **
 **        Made by @ercole89 for SFY Labs       **
 **            sfy.startup@gmail.com            **
 ************************************************/

pragma solidity ^0.8.21;

interface IParent {
    function ownerOf(uint256 tokenId) external view returns (address);

    function balanceOf(address owner) external view returns (uint256);

    function tokenByIndex(uint256 index) external view returns (uint256);

    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) external view returns (uint256);
}

interface IChild {
    function ownerOf(uint256 tokenId) external view returns (address);

    function balanceOf(address owner) external view returns (uint256);

    function tokenByIndex(uint256 index) external view returns (uint256);

    function tokenOfOwnerByIndex(
        address owner,
        uint256 index
    ) external view returns (uint256);
}

contract RMRKCalculateBalance {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function calculateBalance(
        address directOwnerAddress,
        address[] memory collectionParentAddresses,
        address childAddress
    ) external view returns (uint256, uint256[] memory) {
        (uint256 totalBalance, uint256[] memory tokenIds) = getTotalBalanceAndTokenIds(directOwnerAddress, collectionParentAddresses, childAddress);
        return (totalBalance, tokenIds);
    }

    function getTotalBalanceAndTokenIds(
        address directOwnerAddress,
        address[] memory collectionParentAddresses,
        address childAddress
    ) internal view returns (uint256, uint256[] memory) {
        uint256 nestedChildBalance = 0;
        uint256 unNestedChildBalance = 0;
        uint256 totalBalance = 0;
        uint256 tokenCount = 0;

        // First pass: calculate the total number of tokens to determine the size of the array
        for (uint256 i = 0; i < collectionParentAddresses.length; i++) {
            uint256 parentBalance = IParent(collectionParentAddresses[i])
                .balanceOf(directOwnerAddress);

            if (parentBalance > 0) {
                for (uint256 j = 0; j < parentBalance; j++) {
                    nestedChildBalance += IChild(childAddress).balanceOf(
                        collectionParentAddresses[i]
                    );
                    tokenCount += nestedChildBalance;
                }
            }
        }

        unNestedChildBalance = IChild(childAddress).balanceOf(directOwnerAddress);
        tokenCount += unNestedChildBalance;

        // Allocate the array with the correct size
        uint256[] memory tokenIds = new uint256[](tokenCount);
        uint256 index = 0;

        // Second pass: populate the array with token IDs
        for (uint256 i = 0; i < collectionParentAddresses.length; i++) {
            uint256 parentBalance = IParent(collectionParentAddresses[i])
                .balanceOf(directOwnerAddress);

            if (parentBalance > 0) {
                for (uint256 j = 0; j < parentBalance; j++) {
                    index = addChildTokensToTokenIds(
                        IParent(collectionParentAddresses[i]),
                        IChild(childAddress),
                        collectionParentAddresses[i],
                        tokenIds,
                        index
                    );
                }
            }
        }

        for (uint256 j = 0; j < unNestedChildBalance; j++) {
            uint256 childTokenId = IChild(childAddress).tokenOfOwnerByIndex(
                directOwnerAddress,
                j
            );
            tokenIds[index] = childTokenId;
            index++;
        }

        totalBalance = nestedChildBalance + unNestedChildBalance;

        return (totalBalance, tokenIds);
    }

    function addChildTokensToTokenIds(
        IParent parent,
        IChild child,
        address parentAddress,
        uint256[] memory tokenIds,
        uint256 index
    ) internal view returns (uint256) {
        uint256 childBalance = child.balanceOf(parentAddress);

        for (uint256 k = 0; k < childBalance; k++) {
            uint256 childTokenId = child.tokenOfOwnerByIndex(
                parentAddress,
                k
            );
            tokenIds[index] = childTokenId;
            index++;
        }

        return index;
    }
}
