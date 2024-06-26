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
        uint256[] memory tokenIds;

        for (uint256 i = 0; i < collectionParentAddresses.length; i++) {
            uint256 parentBalance = IParent(collectionParentAddresses[i])
                .balanceOf(directOwnerAddress);

            if (parentBalance > 0) {
                for (uint256 j = 0; j < parentBalance; j++) {
                    uint256 parentTokenId = IParent(collectionParentAddresses[i])
                        .tokenOfOwnerByIndex(directOwnerAddress, j);
                    uint256 childBalance = IChild(childAddress).balanceOf(
                        collectionParentAddresses[i]
                    );

                    nestedChildBalance += childBalance;

                    for (uint256 k = 0; k < childBalance; k++) {
                        uint256 childTokenId = IChild(childAddress)
                            .tokenOfOwnerByIndex(collectionParentAddresses[i], k);
                        
                        // Aggiungere il tokenId all'array
                        tokenIds = _append(tokenIds, childTokenId);
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
            tokenIds = _append(tokenIds, childTokenId);
        }

        totalBalance = nestedChildBalance + unNestedChildBalance;

        return (totalBalance, tokenIds);
    }

    function _append(uint256[] memory array, uint256 item) internal pure returns (uint256[] memory) {
        uint256 length = array.length;
        uint256[] memory newArray = new uint256[](length + 1);
        for (uint256 i = 0; i < length; i++) {
            newArray[i] = array[i];
        }
        newArray[length] = item;
        return newArray;
    }
}
