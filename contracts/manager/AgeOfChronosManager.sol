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

    function totalSupply() external view returns (uint256);
}

interface IChild {
    function setSoulbound(uint256 tokenId, bool state) external;

    function ownerOf(uint256 tokenId) external view returns (address);

    function setExternalPermission(address account, bool permission) external;
}

interface IAttributeManager {
    function setUintAttribute(
        address collection,
        uint256 tokenId,
        string memory key,
        uint256 value
    ) external;

    function getUintAttribute(
        address collection,
        uint256 tokenId,
        string memory key
    ) external view returns (uint256);
}

contract AgeOfChronosManager {
    address public owner;
    address public externalAccount;
    mapping(address => bool) public contributors;

    address public rykerCollection;
    address public lunaCollection;
    address public ariaCollection;
    address public thaddeusCollection;

    address public ariaBodyCollection;
    address public ariaHeadCollection;
    address public ariaLeftHandCollection;
    address public ariaRightHandCollection;

    address public lunaBodyCollection;
    address public lunaHeadCollection;
    address public lunaLeftHandCollection;
    address public lunaRightHandCollection;

    address public rykerBodyCollection;
    address public rykerHeadCollection;
    address public rykerLeftHandCollection;
    address public rykerRightHandCollection;

    address public thaddeusBodyCollection;
    address public thaddeusHeadCollection;
    address public thaddeusLeftHandCollection;
    address public thaddeusRightHandCollection;

    uint256 public fee; // Variable to store the fee amount in wei
    address public contractAddress7508; // the ERC7508

    string public feeAttributeKey;
    uint256 public feeAttributeValue;

    mapping(address => mapping(uint256 => bool)) private inMission; // Mapping to track if a token is in a mission
    mapping(address => mapping(uint256 => bool)) private hasPaidFee; // Mapping to track who has paid the fee

    string public name;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyOwnerOrContributor() {
        require(
            msg.sender == owner || contributors[msg.sender],
            "Caller is not the owner or contributor"
        );
        _;
    }

    event MissionStarted(
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId,
        string key,
        address player
    );

    event MissionEnded(
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId,
        uint16 childToken,
        string key,
        address player
    );

    event FeePaid(
        address player,
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId
    );

    event ExternalAccountSet(address account);

    /**
     * @notice Sets the deployer as the owner upon contract creation.
     */
    constructor() {
        owner = msg.sender;
        name = "ManagerAgeOfChronos"; // Adjusted the name
    }

    /**
     * @notice Sets the fee amount. Only callable by the owner.
     * @param _fee The new fee amount.
     */
    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    /**
     * @notice Returns the fee amount.
     * @return The fee amount.
     */
    function getFee() external view returns (uint256) {
        return fee;
    }

    /**
     * @notice Sets the 7508 contract address. Only callable by the owner.
     * @param _contractAddress7508 The new 7508 contract address.
     */
    function set7508Address(address _contractAddress7508) external onlyOwner {
        contractAddress7508 = _contractAddress7508;
    }

    /**
     * @notice Returns the 7508 contract address.
     * @return The 7508 contract address.
     */
    function getContractAddress7508() external view returns (address) {
        return contractAddress7508;
    }

    /**
     * @notice Sets the external account to receive fees. Only callable by the owner.
     * @param _externalAccount The address of the external account.
     */
    function setExternalAccount(address _externalAccount) external onlyOwner {
        externalAccount = _externalAccount;
        emit ExternalAccountSet(_externalAccount);
    }

    /**
     * @notice Returns the external account address.
     * @return The external account address.
     */
    function getExternalAccount() external view returns (address) {
        return externalAccount;
    }

    /**
     * @notice Sets the attribute key and value for fee payment check. Only callable by the owner.
     * @param key The attribute key.
     * @param value The attribute value.
     */
    function setFeeAttribute(
        string memory key,
        uint256 value
    ) external onlyOwner {
        feeAttributeKey = key;
        feeAttributeValue = value;
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
            tokenExists(rykerCollection, rykerTokenId) &&
                tokenExists(lunaCollection, lunaTokenId) &&
                tokenExists(ariaCollection, ariaTokenId) &&
                tokenExists(thaddeusCollection, thaddeusTokenId),
            "One or more tokens do not exist"
        );
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

        // Check if the attribute is already set to the required value
        require(
            IAttributeManager(contractAddress7508).getUintAttribute(
                rykerCollection,
                rykerTokenId,
                feeAttributeKey
            ) == feeAttributeValue &&
                IAttributeManager(contractAddress7508).getUintAttribute(
                    lunaCollection,
                    lunaTokenId,
                    feeAttributeKey
                ) == feeAttributeValue &&
                IAttributeManager(contractAddress7508).getUintAttribute(
                    ariaCollection,
                    ariaTokenId,
                    feeAttributeKey
                ) == feeAttributeValue &&
                IAttributeManager(contractAddress7508).getUintAttribute(
                    thaddeusCollection,
                    thaddeusTokenId,
                    feeAttributeKey
                ) == feeAttributeValue,
            "Attribute is not set to required value"
        );

        hasPaidFee[rykerCollection][rykerTokenId] = true;
        hasPaidFee[lunaCollection][lunaTokenId] = true;
        hasPaidFee[ariaCollection][ariaTokenId] = true;
        hasPaidFee[thaddeusCollection][thaddeusTokenId] = true;

        payable(externalAccount).transfer(msg.value);

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
     * @param collection The collection of the token to check.
     * @param tokenId The ID of the token to check.
     * @return True if the token has paid the fee, false otherwise.
     */
    function hasTokenPaidFee(
        address collection,
        uint256 tokenId
    ) external view returns (bool) {
        return hasPaidFee[collection][tokenId];
    }

    /**
     * @notice Sets the fee payment status of a token. Only callable by the owner or contributor.
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
        hasPaidFee[rykerCollection][rykerTokenId] = status;
        hasPaidFee[lunaCollection][lunaTokenId] = status;
        hasPaidFee[ariaCollection][ariaTokenId] = status;
        hasPaidFee[thaddeusCollection][thaddeusTokenId] = status;
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
     * @notice Sets the addresses for all child collections. Only callable by the owner.
     * @param _childCollections An array containing the new addresses for the child collections.
     * The array must contain addresses in the following order:
     * [ariaBody, ariaHead, ariaLeftHand, ariaRightHand, lunaBody, lunaHead, lunaLeftHand, lunaRightHand,
     * rykerBody, rykerHead, rykerLeftHand, rykerRightHand, thaddeusBody, thaddeusHead, thaddeusLeftHand, thaddeusRightHand]
     */
    function setChildCollections(
        address[] calldata _childCollections
    ) external onlyOwner {
        require(_childCollections.length == 16, "Invalid number of addresses");

        ariaBodyCollection = _childCollections[0];
        ariaHeadCollection = _childCollections[1];
        ariaLeftHandCollection = _childCollections[2];
        ariaRightHandCollection = _childCollections[3];
        lunaBodyCollection = _childCollections[4];
        lunaHeadCollection = _childCollections[5];
        lunaLeftHandCollection = _childCollections[6];
        lunaRightHandCollection = _childCollections[7];
        rykerBodyCollection = _childCollections[8];
        rykerHeadCollection = _childCollections[9];
        rykerLeftHandCollection = _childCollections[10];
        rykerRightHandCollection = _childCollections[11];
        thaddeusBodyCollection = _childCollections[12];
        thaddeusHeadCollection = _childCollections[13];
        thaddeusLeftHandCollection = _childCollections[14];
        thaddeusRightHandCollection = _childCollections[15];
    }

    /**
     * @notice Adds a contributor. Only callable by the owner.
     * @param _contributor The address of the new contributor.
     */
    function addContributor(address _contributor) external onlyOwner {
        contributors[_contributor] = true;
    }

    /**
     * @notice Removes a contributor. Only callable by the owner.
     * @param _contributor The address of the contributor to remove.
     */
    function removeContributor(address _contributor) external onlyOwner {
        contributors[_contributor] = false;
    }

    /**
     * @notice Checks if an address is a contributor.
     * @param account The address to check.
     * @return True if the address is a contributor, false otherwise.
     */
    function isContributor(address account) public view returns (bool) {
        return contributors[account];
    }

    /**
     * @notice Starts a mission by setting the soulbound state for a list of tokens. Only callable by the owner or contributor.
     * @param rykerTokenId The token ID for Ryker.
     * @param lunaTokenId The token ID for Luna.
     * @param ariaTokenId The token ID for Aria.
     * @param thaddeusTokenId The token ID for Thaddeus.
     * @param key The attribute key.
     */
    function startMission(
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId,
        string memory key
    ) external onlyOwnerOrContributor {
        require(
            !inMission[rykerCollection][rykerTokenId] ||
                !inMission[lunaCollection][lunaTokenId] ||
                !inMission[ariaCollection][ariaTokenId] ||
                !inMission[thaddeusCollection][thaddeusTokenId],
            "One or more tokens are already in a mission"
        );
        require(
            hasPaidFee[rykerCollection][rykerTokenId] &&
                hasPaidFee[lunaCollection][lunaTokenId] &&
                hasPaidFee[ariaCollection][ariaTokenId] &&
                hasPaidFee[thaddeusCollection][thaddeusTokenId],
            "One or more tokens have not paid the fee"
        );

        inMission[rykerCollection][rykerTokenId] = true;
        inMission[lunaCollection][lunaTokenId] = true;
        inMission[ariaCollection][ariaTokenId] = true;
        inMission[thaddeusCollection][thaddeusTokenId] = true;

        emit MissionStarted(
            rykerTokenId,
            lunaTokenId,
            ariaTokenId,
            thaddeusTokenId,
            key,
            msg.sender
        );
    }

    /**
     * @notice Ends a mission by resetting the soulbound state for a list of tokens and granting external permission. Only callable by the owner or contributor.
     * @param rykerTokenId The token ID for Ryker.
     * @param lunaTokenId The token ID for Luna.
     * @param ariaTokenId The token ID for Aria.
     * @param thaddeusTokenId The token ID for Thaddeus.
     * @param key The attribute key.
     * @param whichChild Specifies which child's permission to set (1-16).
     */
    function endMission(
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId,
        uint16 whichChild,
        string memory key
    ) external onlyOwnerOrContributor {
        require(
            inMission[rykerCollection][rykerTokenId] &&
                inMission[lunaCollection][lunaTokenId] &&
                inMission[ariaCollection][ariaTokenId] &&
                inMission[thaddeusCollection][thaddeusTokenId],
            "One or more tokens are not currently in a mission"
        );

        IParent(rykerCollection).setSoulbound(rykerTokenId, false);
        IParent(lunaCollection).setSoulbound(lunaTokenId, false);
        IParent(ariaCollection).setSoulbound(ariaTokenId, false);
        IParent(thaddeusCollection).setSoulbound(thaddeusTokenId, false);

        // Array of child collections
        address[16] memory childCollections = [
            ariaBodyCollection,
            ariaHeadCollection,
            ariaLeftHandCollection,
            ariaRightHandCollection,
            lunaBodyCollection,
            lunaHeadCollection,
            lunaLeftHandCollection,
            lunaRightHandCollection,
            rykerBodyCollection,
            rykerHeadCollection,
            rykerLeftHandCollection,
            rykerRightHandCollection,
            thaddeusBodyCollection,
            thaddeusHeadCollection,
            thaddeusLeftHandCollection,
            thaddeusRightHandCollection
        ];

        require(whichChild > 0 && whichChild <= 16, "Invalid whichChild value");

        address childCollection = childCollections[whichChild - 1];
        IChild(childCollection).setExternalPermission(
            IParent(rykerCollection).ownerOf(rykerTokenId),
            true
        );

        inMission[rykerCollection][rykerTokenId] = false;
        inMission[lunaCollection][lunaTokenId] = false;
        inMission[ariaCollection][ariaTokenId] = false;
        inMission[thaddeusCollection][thaddeusTokenId] = false;

        hasPaidFee[rykerCollection][rykerTokenId] = false;
        hasPaidFee[lunaCollection][lunaTokenId] = false;
        hasPaidFee[ariaCollection][ariaTokenId] = false;
        hasPaidFee[thaddeusCollection][thaddeusTokenId] = false;

        uint256 rykerValue = IAttributeManager(contractAddress7508)
            .getUintAttribute(rykerCollection, rykerTokenId, key);
        uint256 lunaValue = IAttributeManager(contractAddress7508).getUintAttribute(
            lunaCollection,
            lunaTokenId,
            key
        );
        uint256 ariaValue = IAttributeManager(contractAddress7508).getUintAttribute(
            ariaCollection,
            ariaTokenId,
            key
        );
        uint256 thaddeusValue = IAttributeManager(contractAddress7508)
            .getUintAttribute(thaddeusCollection, thaddeusTokenId, key);

        rykerValue++;
        lunaValue++;
        ariaValue++;
        thaddeusValue++;

        IAttributeManager(contractAddress7508).setUintAttribute(
            rykerCollection,
            rykerTokenId,
            key,
            rykerValue
        );
        IAttributeManager(contractAddress7508).setUintAttribute(
            lunaCollection,
            lunaTokenId,
            key,
            lunaValue
        );
        IAttributeManager(contractAddress7508).setUintAttribute(
            ariaCollection,
            ariaTokenId,
            key,
            ariaValue
        );
        IAttributeManager(contractAddress7508).setUintAttribute(
            thaddeusCollection,
            thaddeusTokenId,
            key,
            thaddeusValue
        );

        emit MissionEnded(
            rykerTokenId,
            lunaTokenId,
            ariaTokenId,
            thaddeusTokenId,
            whichChild,
            key,
            msg.sender
        );
    }

    /**
     * @notice Checks if a given token is currently in a mission.
     * @param collection The collection address.
     * @param tokenId The token ID to check.
     * @return True if the token is in a mission, false otherwise.
     */
    function isTokenInMission(
        address collection,
        uint256 tokenId
    ) external view returns (bool) {
        return inMission[collection][tokenId];
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

    /**
     * @notice Returns the list of child collection addresses.
     * @return An array of child collection addresses.
     */
    function getChildCollectionAddresses() external view returns (address[] memory) {
        address[] memory childCollections = new address[](16);
        childCollections[0] = ariaBodyCollection;
        childCollections[1] = ariaHeadCollection;
        childCollections[2] = ariaLeftHandCollection;
        childCollections[3] = ariaRightHandCollection;   
        childCollections[4] = lunaBodyCollection;
        childCollections[5] = lunaHeadCollection;
        childCollections[6] = lunaLeftHandCollection;
        childCollections[7] = lunaRightHandCollection;
        childCollections[8] = rykerBodyCollection;
        childCollections[9] = rykerHeadCollection;
        childCollections[10] = rykerLeftHandCollection;
        childCollections[11] = rykerRightHandCollection;
        childCollections[12] = thaddeusBodyCollection;
        childCollections[13] = thaddeusHeadCollection;
        childCollections[14] = thaddeusLeftHandCollection;
        childCollections[15] = thaddeusRightHandCollection;
        return childCollections;
    }

    /**
     * @dev Internal function to check if a token exists in the collection.
     * @param collection The address of the collection contract.
     * @param tokenId The token ID to check.
     * @return True if the token exists, false otherwise.
     */
    function tokenExists(
        address collection,
        uint256 tokenId
    ) internal view returns (bool) {
        return tokenId <= IParent(collection).totalSupply();
    }

    /**
     * @dev Internal function to check if a token exists in the collection.
     * @param collection The address of the collection contract.
     * @param tokenId The token ID to check.
     * @return True if the token exists, false otherwise.
     */
    function isTokenExists(
        address collection,
        uint256 tokenId
    ) external view returns (bool) {
        return tokenExists(collection, tokenId);
    }

    /**
     * @notice Sets a uint attribute for a token in a specified collection.
     * @param collection The address of the collection contract.
     * @param tokenId The token ID.
     * @param key The attribute key.
     * @param value The attribute value.
     */
    function setUintAttribute(
        address collection,
        uint256 tokenId,
        string memory key,
        uint256 value
    ) external onlyOwnerOrContributor {
        IAttributeManager(contractAddress7508).setUintAttribute(
            collection,
            tokenId,
            key,
            value
        );
    }

    /**
     * @notice Gets a uint attribute for a token in a specified collection.
     * @param collection The address of the collection contract.
     * @param tokenId The token ID.
     * @param key The attribute key.
     * @return The attribute value.
     */
    function getUintAttribute(
        address collection,
        uint256 tokenId,
        string memory key
    ) external view returns (uint256) {
        return
            IAttributeManager(contractAddress7508).getUintAttribute(
                collection,
                tokenId,
                key
            );
    }
}
