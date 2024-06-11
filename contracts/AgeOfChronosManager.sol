// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.21;


/************************************************
**        Manager Contract for AgeOfChronos    **
**        Made by @ercole89 for SFY Labs       **
**            sfy.startup@gmail.com            **
************************************************/
 

interface IParent {
    function setSoulbound(uint256 tokenId, bool state) external;
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract AgeOfChronosManager {
    address public owner;
    address[] public parentAddresses;
    uint256 public fee; // Variable to store the fee amount in wei

    mapping(address => bool) private inMission;
    mapping(uint256 => bool) private hasPaidFee; // Mapping to track who has paid the fee
    mapping(address => uint256) private lastMissionStart; // Mapping to track the last mission start time

    uint256 private constant MISSION_COOLDOWN = 24 hours; // Cooldown period for starting a mission

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    event MissionStarted(address[] collectionAddresses, uint256[] tokenIds);
    event MissionEnded(address[] collectionAddresses, uint256[] tokenIds);
    event FeePaid(address payer, uint256[] tokenIds);

    /**
     * @notice Sets the deployer as the owner upon contract creation.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Sets the fee amount. Only callable by the owner.
     * @param _fee The new fee amount.
     */
    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    /**
     * @notice Returns the current fee amount.
     * @return The current fee amount.
     */
    function getFee() external view returns (uint256) {
        return fee;
    }

    /**
     * @notice Allows a user to pay the fee. The fee must match the preset amount.
     * @param collectionAddresses Array of collection addresses associated with the token IDs.
     * @param tokenIds Array of token IDs for which the fee is being paid.
     */
    function payFee(address[] calldata collectionAddresses, uint256[] calldata tokenIds) external payable {
        require(msg.value == fee, "Incorrect fee amount");
        require(collectionAddresses.length == tokenIds.length, "Mismatched input lengths");
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(IParent(collectionAddresses[i]).ownerOf(tokenIds[i]) == msg.sender, "Caller does not own the token");
            hasPaidFee[tokenIds[i]] = true;
        }

        emit FeePaid(msg.sender, tokenIds);
    }

    /**
     * @notice Checks if a token has paid the fee.
     * @param tokenId The ID of the token to check.
     * @return True if the token has paid the fee, false otherwise.
     */
    function hasTokenPaidFee(uint256 tokenId) external view returns (bool) {
        return hasPaidFee[tokenId];
    }

    /**
     * @notice Sets the fee payment status of a token. Only callable by the owner.
     * @param tokenId The ID of the token.
     * @param status The new fee payment status (true for paid, false for not paid).
     */
    function setFeePaymentStatus(uint256 tokenId, bool status) external onlyOwner {
        hasPaidFee[tokenId] = status;
    }

    /**
     * @notice Adds a new parent address. Only callable by the owner.
     * @param _newParent The new parent address to add.
     */
    function addParentAddress(address _newParent) external onlyOwner {
        parentAddresses.push(_newParent);
    }

    /**
     * @notice Removes a parent address. Only callable by the owner.
     * @param _parentAddress The parent address to remove.
     */
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

    /**
     * @notice Sets the soulbound state of a token. Only callable by the owner.
     * @param tokenId The ID of the token.
     * @param state The new state of the token (true for soulbound, false for transferable).
     * @param parentAddress The address of the parent contract.
     */
    function setSoulbound(uint256 tokenId, bool state, address parentAddress) external onlyOwner {
        IParent(parentAddress).setSoulbound(tokenId, state);
    }

    /**
     * @notice Sets the soulbound state for a range of tokens. Only callable by the owner.
     * @param startTokenId The ID of the first token in the range.
     * @param endTokenId The ID of the last token in the range.
     * @param state The new state of the tokens (true for soulbound, false for transferable).
     * @param parentAddress The address of the parent contract.
     */
    function bulkSoulbound(uint256 startTokenId, uint256 endTokenId, bool state, address parentAddress) external onlyOwner {
        require(startTokenId <= endTokenId, "Invalid token ID range");
        for (uint256 tokenId = startTokenId; tokenId <= endTokenId; tokenId++) {
            IParent(parentAddress).setSoulbound(tokenId, state);
        }
    }

    /**
     * @notice Transfers ownership of the contract to a new owner. Only callable by the current owner.
     * @param newOwner The address of the new owner.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }

    /**
     * @notice Starts a mission by setting the soulbound state for a list of tokens. Only callable by the owner.
     * @param collectionAddresses Array of collection addresses associated with the token IDs.
     * @param tokenIds Array of token IDs to start the mission for.
     */
    function startMission(address[] calldata collectionAddresses, uint256[] calldata tokenIds) external onlyOwner {
        require(collectionAddresses.length == tokenIds.length, "Mismatched input lengths");
        require(block.timestamp >= lastMissionStart[msg.sender] + MISSION_COOLDOWN, "Mission cooldown in effect");
        for (uint256 i = 0; i < collectionAddresses.length; i++) {
            require(hasPaidFee[tokenIds[i]], "Token has not paid the fee");
        }
        for (uint256 i = 0; i < collectionAddresses.length; i++) {
            inMission[collectionAddresses[i]] = true;
            IParent(collectionAddresses[i]).setSoulbound(tokenIds[i], true);
        }
        lastMissionStart[msg.sender] = block.timestamp;
        emit MissionStarted(collectionAddresses, tokenIds);
    }

    /**
     * @notice Ends a mission by resetting the soulbound state for a list of tokens. Only callable by the owner.
     * @param collectionAddresses Array of collection addresses associated with the token IDs.
     * @param tokenIds Array of token IDs to end the mission for.
     */
    function endMission(address[] calldata collectionAddresses, uint256[] calldata tokenIds) external onlyOwner {
        require(collectionAddresses.length == tokenIds.length, "Mismatched input lengths");
        for (uint256 i = 0; i < collectionAddresses.length; i++) {
            IParent(collectionAddresses[i]).setSoulbound(tokenIds[i], false);
            inMission[collectionAddresses[i]] = false;
            hasPaidFee[tokenIds[i]] = false; // Reset fee payment status
        }
        emit MissionEnded(collectionAddresses, tokenIds);
    }

    /**
     * @notice Checks if a given address is currently in a mission.
     * @param addr The address to check.
     * @return True if the address is in a mission, false otherwise.
     */
    function isAddressInMission(address addr) external view returns (bool) {
        return inMission[addr];
    }

    /**
     * @notice Returns the list of parent addresses.
     * @return An array of parent addresses.
     */
    function getParentAddresses() external view returns (address[] memory) {
        return parentAddresses;
    }
}
