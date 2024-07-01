// SPDX-License-Identifier: Apache-2.0

/************************************************
 **        Manager Contract for AgeOfChronos    **
 **        Made by @ercole89 for SFY Labs       **
 **            sfy.startup@gmail.com            **
 ************************************************/

pragma solidity ^0.8.21;

interface IParent {
    function setSoulbound(uint256 tokenId, bool state) external;

    function ownerOf(uint256 tokenId) external view returns (address);
}

contract AgeOfChronosManager {
    address public owner;
    address public contributor;

    address public rykerCollection;
    address public lunaCollection;
    address public ariaCollection;
    address public thaddeusCollection;

    uint256 public fee; // Variable to store the fee amount in wei

    mapping(address => bool) private inMission;
    mapping(uint256 => bool) private hasPaidFee; // Mapping to track who has paid the fee
    mapping(address => uint256) private lastMissionStart; // Mapping to track the last mission start time

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyOwnerOrContributor() {
        require(
            msg.sender == owner || msg.sender == contributor,
            "Caller is not the owner or contributor"
        );
        _;
    }

    event MissionStarted(
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId
    );

    event MissionEnded(
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId
    );

    event FeePaid(
        address payer,
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId
    );

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
     * @notice Allows the owner to withdraw all collected fees from the contract.
     */
    function drainFees() external onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "No fees to drain");
        payable(owner).transfer(contractBalance);
    }

    /**
     * @notice Returns the current fee amount.
     * @return The current fee amount.
     */
    function getFee() external view returns (uint256) {
        return fee;
    }

    /**
     * @notice Allows a user to pay the fee for multiple tokens. The fee must match the preset amount.
     * @param rykerTokenId The token ID for Ryker.
     * @param lunaTokenId The token ID for Luna.
     * @param ariaTokenId The token ID for Aria.
     * @param thaddeusTokenId The token ID for Thaddeus.
     */
    function payFee(
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId
    ) external payable {
        require(msg.value == fee, "Incorrect fee amount");
        require(
            IParent(rykerCollection).ownerOf(rykerTokenId) == msg.sender,
            "Caller does not own the Ryker token"
        );
        require(
            IParent(lunaCollection).ownerOf(lunaTokenId) == msg.sender,
            "Caller does not own the Luna token"
        );
        require(
            IParent(ariaCollection).ownerOf(ariaTokenId) == msg.sender,
            "Caller does not own the Aria token"
        );
        require(
            IParent(thaddeusCollection).ownerOf(thaddeusTokenId) == msg.sender,
            "Caller does not own the Thaddeus token"
        );

        hasPaidFee[rykerTokenId] = true;
        hasPaidFee[lunaTokenId] = true;
        hasPaidFee[ariaTokenId] = true;
        hasPaidFee[thaddeusTokenId] = true;

        emit FeePaid(
            msg.sender,
            rykerTokenId,
            lunaTokenId,
            ariaTokenId,
            thaddeusTokenId
        );
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
     * @param rykerTokenId The token ID for Ryker.
     * @param lunaTokenId The token ID for Luna.
     * @param ariaTokenId The token ID for Aria.
     * @param thaddeusTokenId The token ID for Thaddeus.
     * @param status The new fee payment status (true for paid, false for not paid).
     */
    function setFeePaymentStatus(
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId,
        bool status
    ) external onlyOwnerOrContributor {
        hasPaidFee[rykerTokenId] = status;
        hasPaidFee[lunaTokenId] = status;
        hasPaidFee[ariaTokenId] = status;
        hasPaidFee[thaddeusTokenId] = status;
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
    function setThaddeusCollection(
        address _thaddeusCollection
    ) external onlyOwner {
        thaddeusCollection = _thaddeusCollection;
    }

    /**
     * @notice Sets the contributor address. Only callable by the owner.
     * @param _contributor The address of the new contributor.
     */
    function setContributor(address _contributor) external onlyOwner {
        contributor = _contributor;
    }

    /**
     * @notice Starts a mission by setting the soulbound state for a list of tokens. Only callable by the owner or contributor.
     * @param ryker The token ID for Ryker.
     * @param luna The token ID for Luna.
     * @param aria The token ID for Aria.
     * @param thaddeus The token ID for Thaddeus.
     */
    function startMission(
        uint256 ryker,
        uint256 luna,
        uint256 aria,
        uint256 thaddeus
    ) external onlyOwnerOrContributor {
        require(!inMission[msg.sender], "Already in a mission");
        require(
            hasPaidFee[ryker] &&
                hasPaidFee[luna] &&
                hasPaidFee[aria] &&
                hasPaidFee[thaddeus],
            "One or more tokens have not paid the fee"
        );

/*
        IParent(rykerCollection).setSoulbound(ryker, true);
        IParent(lunaCollection).setSoulbound(luna, true);
        IParent(ariaCollection).setSoulbound(aria, true);
        IParent(thaddeusCollection).setSoulbound(thaddeus, true);
*/
        inMission[msg.sender] = true;

        emit MissionStarted(ryker, luna, aria, thaddeus);
    }

    /**
     * @notice Ends a mission by resetting the soulbound state for a list of tokens. Only callable by the owner or contributor.
     * @param ryker The token ID for Ryker.
     * @param luna The token ID for Luna.
     * @param aria The token ID for Aria.
     * @param thaddeus The token ID for Thaddeus.
     */
    function endMission(
        uint256 ryker,
        uint256 luna,
        uint256 aria,
        uint256 thaddeus
    ) external onlyOwnerOrContributor {
        require(inMission[msg.sender], "Not currently in a mission");

        IParent(rykerCollection).setSoulbound(ryker, false);
        IParent(lunaCollection).setSoulbound(luna, false);
        IParent(ariaCollection).setSoulbound(aria, false);
        IParent(thaddeusCollection).setSoulbound(thaddeus, false);

        inMission[msg.sender] = false;
        hasPaidFee[ryker] = false;
        hasPaidFee[luna] = false;
        hasPaidFee[aria] = false;
        hasPaidFee[thaddeus] = false;

        emit MissionEnded(ryker, luna, aria, thaddeus);
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
     * @notice Returns the list of collection addresses.
     * @return An array of collection addresses.
     */
    function getCollectionAddresses() external view returns (address[] memory) {
        address[] memory collections = new address[](4);
        collections[0] = rykerCollection;
        collections[1] = lunaCollection;
        collections[2] = ariaCollection;
        collections[3] = thaddeusCollection;
        return collections;
    }
}
