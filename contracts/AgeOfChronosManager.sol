// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.21;

interface IParent {
    function setSoulbound(uint256 tokenId, bool state) external;
}

contract AgeOfChronosManager {
    address public owner;
    address[] public parentAddresses;

    mapping(address => bool) private inMission;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    event MissionStarted(address[] collectionAddresses, uint256[] tokenIds);
    event MissionEnded(address[] collectionAddresses, uint256[] tokenIds);

    constructor() {
        owner = msg.sender; // Setting the deployer as the owner
    }

    function addParentAddress(address _newParent) external onlyOwner {
        parentAddresses.push(_newParent);
    }

    function removeParentAddress(address _parentAddress) external onlyOwner {
        uint256 length = parentAddresses.length;
        for (uint256 i = 0; i < length; i++) {
            if (parentAddresses[i] == _parentAddress) {
                parentAddresses[i] = parentAddresses[length - 1];
                parentAddresses.pop();
                break;
            }
        }
    }

    function setSoulbound(uint256 tokenId, bool state, address parentAddress) external onlyOwner {
        IParent(parentAddress).setSoulbound(tokenId, state);
    }

    function bulkSoulbound(uint256 startTokenId, uint256 endTokenId, bool state, address parentAddress) external onlyOwner {
        require(startTokenId <= endTokenId, "Invalid token ID range");
        for (uint256 tokenId = startTokenId; tokenId <= endTokenId; tokenId++) {
            IParent(parentAddress).setSoulbound(tokenId, state);
        }
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }

    function startMission(address[] calldata collectionAddresses, uint256[] calldata tokenIds) external onlyOwner {
        require(collectionAddresses.length == tokenIds.length, "Mismatched input lengths");
        for (uint256 i = 0; i < collectionAddresses.length; i++) {
            inMission[collectionAddresses[i]] = true;
            IParent(collectionAddresses[i]).setSoulbound(tokenIds[i], true);
        }
        emit MissionStarted(collectionAddresses, tokenIds);
    }

    function endMission(address[] calldata collectionAddresses, uint256[] calldata tokenIds) external onlyOwner {
        require(collectionAddresses.length == tokenIds.length, "Mismatched input lengths");
        for (uint256 i = 0; i < collectionAddresses.length; i++) {
            IParent(collectionAddresses[i]).setSoulbound(tokenIds[i], false);
            inMission[collectionAddresses[i]] = false;
        }
        emit MissionEnded(collectionAddresses, tokenIds);
    }

    function isAddressInMission(address addr) external view returns (bool) {
        return inMission[addr];
    }

    function getParentAddresses() external view returns (address[] memory) {
        return parentAddresses;
    }
}
