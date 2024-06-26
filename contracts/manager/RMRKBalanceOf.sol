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
        uint256 nestedChildBalance = 0;
        uint256 unNestedChildBalance = 0;
        uint256 totalBalance = 0;
        uint256[] memory tokenIds = new uint256[](0); // Array per conservare i tokenId

        for (uint256 i = 0; i < collectionParentAddresses.length; i++) {
            uint256 parentBalance = IParent(collectionParentAddresses[i])
                .balanceOf(directOwnerAddress);

            if (parentBalance > 0) {
                for (uint256 j = 0; j < parentBalance; j++) {
                    nestedChildBalance += IChild(childAddress).balanceOf(
                        collectionParentAddresses[i]
                    );

                    for (uint256 k = 0; k < nestedChildBalance; k++) {
                        uint256 childTokenId = IChild(childAddress)
                        .tokenOfOwnerByIndex(collectionParentAddresses[i], k);
                        
                        // Aggiungere il tokenId all'array
                        uint256 length = tokenIds.length;
                        uint256[] memory newTokenIds = new uint256[](length + 1);
                        for (uint256 l = 0; l < length; l++) {
                            newTokenIds[l] = tokenIds[l];
                        }
                        newTokenIds[length] = childTokenId;
                        tokenIds = newTokenIds;
                    }
                }
            }
        }

        unNestedChildBalance = IChild(childAddress).balanceOf(
            directOwnerAddress
        );

        for (uint256 j = 0; j < unNestedChildBalance; j++) {
            uint256 childTokenId = IChild(childAddress).tokenOfOwnerByIndex(
                directOwnerAddress,
                j
            );

            // Aggiungere il tokenId all'array
            uint256 length = tokenIds.length;
            uint256[] memory newTokenIds = new uint256[](length + 1);
            for (uint256 k = 0; k < length; k++) {
                newTokenIds[k] = tokenIds[k];
            }
            newTokenIds[length] = childTokenId;
            tokenIds = newTokenIds;
        }

        totalBalance = nestedChildBalance + unNestedChildBalance;

        return (totalBalance, tokenIds);
    }
}