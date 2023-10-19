// SPDX-License-Identifier: Apache-2.0

/***********************************************/
/**        Using software by RMRK.app         **/
/**             contact@rmrk.app              **/
/***********************************************/
pragma solidity ^0.8.21;
import "@rmrk-team/evm-contracts/contracts/implementations/premint/RMRKEquippablePreMint.sol";


/**
 * @title Age of Chronos Incubators
 * @author SFY Labs
 * @notice Implementation smart contract for the presale
 */
contract AgeofChronos is RMRKEquippablePreMint {

    constructor(
          string memory collectionMetadata,
          uint256 maxSupply,
          address royaltyRecipient,
          uint16 royaltyPercentageBps
      )
          RMRKEquippablePreMint(
              "Age of Chronos",
              "AOC",
              collectionMetadata,
              maxSupply,
              royaltyRecipient,
              royaltyPercentageBps
          )
      {}      
}
  