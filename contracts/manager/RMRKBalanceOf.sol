// SPDX-License-Identifier: Apache-2.0

/************************************************
 **        Manager Contract for AgeOfChronos    **
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
        uint256 totalChildBalance = 0;
        uint256 totalChildBalance1 = 0;
        uint256 totalChildBalance2 = 0;
        uint256[] memory tokenIds = new uint256[](0);

        // Calcola il bilancio dei child NFT non annidati
        (totalChildBalance1, tokenIds) = _calculateUnnestedBalance(
            directOwnerAddress,
            childAddress,
            tokenIds
        );

        // Calcola il bilancio dei child NFT annidati
        for (uint256 i = 0; i < collectionParentAddresses.length; i++) {
            (totalChildBalance2, tokenIds) = _calculateNestedBalance(
                directOwnerAddress,
                collectionParentAddresses[i],
                childAddress,
                tokenIds
            );
        }
        totalChildBalance = totalChildBalance1 + totalChildBalance2;
        return (totalChildBalance, tokenIds);
    }

    function _calculateUnnestedBalance(
        address directOwnerAddress,
        address childAddress,
        uint256[] memory tokenIds
    ) internal view returns (uint256, uint256[] memory) {
        uint256 nestedChildCount = 0;
        uint256 totalBalance = 0;
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
                
            }else{
                nestedChildCount++;
            }
        }
        totalBalance = childBalance - nestedChildCount;
        return (totalBalance, tokenIds);
    }

    function _calculateNestedBalance(
        address directOwnerAddress,
        address collectionParentAddress,
        address childAddress,
        uint256[] memory tokenIds
    ) internal view returns (uint256, uint256[] memory) {
        uint256 nestedChildCount = 0;
        uint256 totalBalance = 0;
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
                        
                    }else{
                        nestedChildCount++;
                    }
                }
            }
            childBalance-=nestedChildCount;
            totalBalance+=childBalance;
            
        }
        totalBalance -= nestedChildCount;
        return (totalBalance, tokenIds);
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
