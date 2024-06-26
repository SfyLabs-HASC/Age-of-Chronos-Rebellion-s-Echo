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
}

interface IChild {
    function ownerOf(uint256 tokenId) external view returns (address);
    function balanceOf(address owner) external view returns (uint256);
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
    ) external view returns (uint256) {
        uint256 nestedChildBalance = 0;
        uint256 unNestedChildBalance = 0;
        uint256 totalBalance = 0;

        for (uint256 i = 0; i < collectionParentAddresses.length; i++) {
            uint256 parentBalance = IParent(collectionParentAddresses[i]).balanceOf(directOwnerAddress);
            
            if (parentBalance > 0) {
                for (uint256 j = 0; j < parentBalance; j++) {
                    nestedChildBalance += IChild(childAddress).balanceOf(collectionParentAddresses[i]);
                }
            }
        }
        
        unNestedChildBalance = IChild(childAddress).balanceOf(directOwnerAddress);
        totalBalance = nestedChildBalance + unNestedChildBalance;

        return totalBalance;
    }
}
