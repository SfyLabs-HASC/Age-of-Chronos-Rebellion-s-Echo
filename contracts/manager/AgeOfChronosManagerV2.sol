// SPDX-License-Identifier: Apache-2.0

/************************************************
 **        Manager Contract for AgeOfChronos    **
 **        Made by @ercole89 for SFY Labs       **
 **            sfy.startup@gmail.com            **
 ************************************************/

pragma solidity ^0.8.21;

import {
    UUPSUpgradeable
} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

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

    function setUintAttributes(
        address[] memory collections,
        uint256[] memory tokenIds,
        UintAttribute[] memory attributes
    ) external;

    function getUintAttribute(
        address collection,
        uint256 tokenId,
        string memory key
    ) external view returns (uint256);

    function getUintAttributes(
        address[] memory collections,
        uint256[] memory tokenIds,
        string[] memory attributeKeys
    ) external view returns (uint256[] memory attributes);
}

contract AgeOfChronosManagerV2 is UUPSUpgradeable {
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

    string public levelAttributeKey;

    mapping(address => mapping(uint256 => bool)) private _inMission; // Mapping to track if a token is in a mission
    mapping(address => mapping(uint256 => bool)) private _hasPaidFee; // Mapping to track who has paid the fee

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
        address player,
        uint256 gameLevel,
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId
    );

    event MissionEnded(
        address player,
        uint256 gameLevel,
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId,
        uint16 childIndex,
        uint64[] childAssetIds
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
    function initialize() public initializer {
        __OwnableUpgradeable_init();
        owner = msg.sender;
        name = "ManagerAgeOfChronos";
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
     * @notice Sets the attribute key for level. Only callable by the owner.
     * @param key The attribute key.
     */
    function setLevelAttribute(string memory key) external onlyOwner {
        levelAttributeKey = key;
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
        _checkTokenOwnership(rykerCollection, rykerTokenId);
        _checkTokenOwnership(lunaCollection, lunaTokenId);
        _checkTokenOwnership(ariaCollection, ariaTokenId);
        _checkTokenOwnership(thaddeusCollection, thaddeusTokenId);

        uint256[] memory feesValues = IAttributeManager(contractAddress7508)
            .getUintAttributes(
                [
                    rykerCollection,
                    lunaCollection,
                    ariaCollection,
                    thaddeusCollection
                ],
                [rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId],
                [feeAttributeKey]
            );

        require(
            feesValues[0] == feeAttributeValue &&
                feesValues[1] == feeAttributeValue &&
                feesValues[2] == feeAttributeValue &&
                feesValues[3] == feeAttributeValue,
            "One or more tokens have not paid the fee"
        );

        _hasPaidFee[rykerCollection][rykerTokenId] = true;
        _hasPaidFee[lunaCollection][lunaTokenId] = true;
        _hasPaidFee[ariaCollection][ariaTokenId] = true;
        _hasPaidFee[thaddeusCollection][thaddeusTokenId] = true;

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
        return _hasPaidFee[collection][tokenId];
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
        _hasPaidFee[rykerCollection][rykerTokenId] = status;
        _hasPaidFee[lunaCollection][lunaTokenId] = status;
        _hasPaidFee[ariaCollection][ariaTokenId] = status;
        _hasPaidFee[thaddeusCollection][thaddeusTokenId] = status;
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
     * @param childCollections An array containing the new addresses for the child collections.
     * The array must contain addresses in the following order:
     * [ariaBody, ariaHead, ariaLeftHand, ariaRightHand, lunaBody, lunaHead, lunaLeftHand, lunaRightHand,
     * rykerBody, rykerHead, rykerLeftHand, rykerRightHand, thaddeusBody, thaddeusHead, thaddeusLeftHand, thaddeusRightHand]
     */
    function setChildCollections(
        address[] calldata childCollections
    ) external onlyOwner {
        require(childCollections.length == 16, "Invalid number of addresses");

        ariaBodyCollection = childCollections[0];
        ariaHeadCollection = childCollections[1];
        ariaLeftHandCollection = childCollections[2];
        ariaRightHandCollection = childCollections[3];
        lunaBodyCollection = childCollections[4];
        lunaHeadCollection = childCollections[5];
        lunaLeftHandCollection = childCollections[6];
        lunaRightHandCollection = childCollections[7];
        rykerBodyCollection = childCollections[8];
        rykerHeadCollection = childCollections[9];
        rykerLeftHandCollection = childCollections[10];
        rykerRightHandCollection = childCollections[11];
        thaddeusBodyCollection = childCollections[12];
        thaddeusHeadCollection = childCollections[13];
        thaddeusLeftHandCollection = childCollections[14];
        thaddeusRightHandCollection = childCollections[15];
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
        uint256 gameLevel,
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId,
        string memory key
    ) external onlyOwnerOrContributor {
        require(
            !_inMission[rykerCollection][rykerTokenId] ||
                !_inMission[lunaCollection][lunaTokenId] ||
                !_inMission[ariaCollection][ariaTokenId] ||
                !_inMission[thaddeusCollection][thaddeusTokenId],
            "One or more tokens are already in a mission"
        );
        require(
            _hasPaidFee[rykerCollection][rykerTokenId] &&
                _hasPaidFee[lunaCollection][lunaTokenId] &&
                _hasPaidFee[ariaCollection][ariaTokenId] &&
                _hasPaidFee[thaddeusCollection][thaddeusTokenId],
            "One or more tokens have not paid the fee"
        );

        uint256[] memory characterLevels = IAttributeManager(
            contractAddress7508
        ).getUintAttributes(
                [
                    rykerCollection,
                    lunaCollection,
                    ariaCollection,
                    thaddeusCollection
                ],
                [rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId],
                [levelAttributeKey]
            );
        if (
            gameLevel > characterLevels[0] + 1 ||
            gameLevel > characterLevels[1] + 1 ||
            gameLevel > characterLevels[2] + 1 ||
            gameLevel > characterLevels[3] + 1
        ) {
            revert("Game level is too high");
        }

        IParent(rykerCollection).setSoulbound(rykerTokenId, true);
        IParent(lunaCollection).setSoulbound(lunaTokenId, true);
        IParent(ariaCollection).setSoulbound(ariaTokenId, true);
        IParent(thaddeusCollection).setSoulbound(thaddeusTokenId, true);

        _inMission[rykerCollection][rykerTokenId] = true;
        _inMission[lunaCollection][lunaTokenId] = true;
        _inMission[ariaCollection][ariaTokenId] = true;
        _inMission[thaddeusCollection][thaddeusTokenId] = true;

        emit MissionStarted(
            msg.sender,
            gameLevel,
            rykerTokenId,
            lunaTokenId,
            ariaTokenId,
            thaddeusTokenId
        );
    }

    function quitMission(
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId
    ) external {
        if (rykerTokenId != 0) {
            _checkTokenOwnership(rykerCollection, rykerTokenId);
            _exitMission(rykerCollection, rykerTokenId);
        }
        if (lunaTokenId != 0) {
            _checkTokenOwnership(lunaCollection, lunaTokenId);
            _exitMission(lunaCollection, lunaTokenId);
        }
        if (ariaTokenId != 0) {
            _checkTokenOwnership(ariaCollection, ariaTokenId);
            _exitMission(ariaCollection, ariaTokenId);
        }
        if (thaddeusTokenId != 0) {
            _checkTokenOwnership(thaddeusCollection, thaddeusTokenId);
            _exitMission(thaddeusCollection, thaddeusTokenId);
        }
    }

    /**
     * @notice Ends a mission by resetting the soulbound state for a list of tokens and granting external permission. Only callable by the owner or contributor.
     * @param rykerTokenId The token ID for Ryker.
     * @param lunaTokenId The token ID for Luna.
     * @param ariaTokenId The token ID for Aria.
     * @param thaddeusTokenId The token ID for Thaddeus.
     * @param key The attribute key.
     * @param childIndex Specifies which child's permission to set (1-16).
     */
    function endMission(
        uint256 missionLevel,
        uint256 rykerTokenId,
        uint256 lunaTokenId,
        uint256 ariaTokenId,
        uint256 thaddeusTokenId,
        uint16 childIndex,
        uint64[] memory childAssetIds
    ) external onlyOwnerOrContributor {
        _exitMission(rykerCollection, rykerTokenId);
        _exitMission(lunaCollection, lunaTokenId);
        _exitMission(ariaCollection, ariaTokenId);
        _exitMission(thaddeusCollection, thaddeusTokenId);

        address childCollection = _getChildFromIndex(childIndex);
        IChild(childCollection).setExternalPermission(address(this), true);
        IChild(childCollection).mintWithAssets(
            IParent(rykerCollection).ownerOf(rykerTokenId),
            childAssetIds
        );

        uint256[] memory characterLevels = IAttributeManager(
            contractAddress7508
        ).getUintAttributes(
                [
                    rykerCollection,
                    lunaCollection,
                    ariaCollection,
                    thaddeusCollection
                ],
                [rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId],
                [levelAttributeKey]
            );
        if (characterLevels[0] < missionLevel) {
            characterLevels[0]++;
        }
        if (characterLevels[1] < missionLevel) {
            characterLevels[1]++;
        }
        if (characterLevels[2] < missionLevel) {
            characterLevels[2]++;
        }
        if (characterLevels[3] < missionLevel) {
            characterLevels[3]++;
        }

        IAttributeManager(contractAddress7508).setUintAttributes(
            [
                rykerCollection,
                lunaCollection,
                ariaCollection,
                thaddeusCollection
            ],
            [rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId],
            [levelAttributeKey],
            characterLevels
        );

        emit MissionEnded(
            gameLevel,
            msg.sender,
            rykerTokenId,
            lunaTokenId,
            ariaTokenId,
            thaddeusTokenId,
            childIndex,
            childAssetIds
        );
    }

    function _exitMission(address collection, uint256 tokenId) internal {
        require(
            _inMission[collection][tokenId],
            "Token is not currently in a mission"
        );
        IParent(collection).setSoulbound(tokenId, false);
        _inMission[collection][tokenId] = false;
        _hasPaidFee[collection][tokenId] = false;
    }

    function _checkTokenOwnership(
        address collection,
        uint256 tokenId
    ) internal view {
        require(
            IParent(collection).ownerOf(tokenId) == msg.sender,
            "Caller does not own the token"
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
        return _inMission[collection][tokenId];
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
    function getChildCollectionAddresses()
        external
        view
        returns (address[] memory)
    {
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

    function _getChildFromIndex(uint16 index) internal view returns (address) {
        require(index > 0 && index <= 16, "Invalid index value");

        if (index == 0) {
            return ariaBodyCollection;
        } else if (index == 1) {
            return ariaHeadCollection;
        } else if (index == 2) {
            return ariaLeftHandCollection;
        } else if (index == 3) {
            return ariaRightHandCollection;
        } else if (index == 4) {
            return lunaBodyCollection;
        } else if (index == 5) {
            return lunaHeadCollection;
        } else if (index == 6) {
            return lunaLeftHandCollection;
        } else if (index == 7) {
            return lunaRightHandCollection;
        } else if (index == 8) {
            return rykerBodyCollection;
        } else if (index == 9) {
            return rykerHeadCollection;
        } else if (index == 10) {
            return rykerLeftHandCollection;
        } else if (index == 11) {
            return rykerRightHandCollection;
        } else if (index == 12) {
            return thaddeusBodyCollection;
        } else if (index == 13) {
            return thaddeusHeadCollection;
        } else if (index == 14) {
            return thaddeusLeftHandCollection;
        } else if (index == 15) {
            return thaddeusRightHandCollection;
        }
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}
