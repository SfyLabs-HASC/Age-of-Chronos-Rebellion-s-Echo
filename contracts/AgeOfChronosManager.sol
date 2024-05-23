// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.21;

interface IParent {
    function setSoulbound(uint256 tokenId, bool state) external;
}

contract AgeOfChronosManager {
    address public owner;
    address[] public parentAddresses;

    struct Mission {
        address collectionAddress;
        uint256 tokenId;
    }

    mapping(bytes32 => Mission[]) private missions;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    event MissionStarted(bytes32 indexed missionId, address[] collectionAddresses, uint256[] tokenIds);
    event MissionEnded(bytes32 indexed missionId);

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


//todo controlla se puo chiamarlo un utente senza permessi da contributor!!!
    function startMission(bytes32 missionId, address[] calldata collectionAddresses, uint256[] calldata tokenIds) external onlyOwner {
        require(collectionAddresses.length == tokenIds.length, "Mismatched input lengths");
        for (uint256 i = 0; i < collectionAddresses.length; i++) {
            missions[missionId].push(Mission(collectionAddresses[i], tokenIds[i]));
            IParent(collectionAddresses[i]).setSoulbound(tokenIds[i], true);
        }
        emit MissionStarted(missionId, collectionAddresses, tokenIds);
    }

    function endMission(bytes32 missionId) external onlyOwner {
        Mission[] storage mission = missions[missionId];
        for (uint256 i = 0; i < mission.length; i++) {
            IParent(mission[i].collectionAddress).setSoulbound(mission[i].tokenId, false);
        }
        delete missions[missionId]; // Clear the mission data
        emit MissionEnded(missionId);
    }
}
