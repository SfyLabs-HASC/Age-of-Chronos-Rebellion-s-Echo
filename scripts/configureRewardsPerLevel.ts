import { ethers } from 'hardhat';
import { getManager, getDeployedContracts } from './utils';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Running with the account:', deployer.address);
  const manager = await getManager();
  const {
    timeSquadAria,
    ariaBody,
    ariaHead,
    ariaLeftHand,
    ariaRightHand,
    timeSquadLuna,
    lunaBody,
    lunaHead,
    lunaLeftHand,
    lunaRightHand,
    timeSquadRyker,
    rykerBody,
    rykerHead,
    rykerLeftHand,
    rykerRightHand,
    timeSquadThaddeus,
    thaddeusBody,
    thaddeusHead,
    thaddeusLeftHand,
    thaddeusRightHand,
  } = await getDeployedContracts();

  const timeSquadAriaAddress = await timeSquadAria.getAddress();
  const ariaBodyAddress = await ariaBody.getAddress();
  const ariaHeadAddress = await ariaHead.getAddress();
  const ariaLeftHandAddress = await ariaLeftHand.getAddress();
  const ariaRightHandAddress = await ariaRightHand.getAddress();
  const timeSquadLunaAddress = await timeSquadLuna.getAddress();
  const lunaBodyAddress = await lunaBody.getAddress();
  const lunaHeadAddress = await lunaHead.getAddress();
  const lunaLeftHandAddress = await lunaLeftHand.getAddress();
  const lunaRightHandAddress = await lunaRightHand.getAddress();
  const timeSquadRykerAddress = await timeSquadRyker.getAddress();
  const rykerBodyAddress = await rykerBody.getAddress();
  const rykerHeadAddress = await rykerHead.getAddress();
  const rykerLeftHandAddress = await rykerLeftHand.getAddress();
  const rykerRightHandAddress = await rykerRightHand.getAddress();
  const timeSquadThaddeusAddress = await timeSquadThaddeus.getAddress();
  const thaddeusBodyAddress = await thaddeusBody.getAddress();
  const thaddeusHeadAddress = await thaddeusHead.getAddress();
  const thaddeusLeftHandAddress = await thaddeusLeftHand.getAddress();
  const thaddeusRightHandAddress = await thaddeusRightHand.getAddress();

  // Level 1:
  let tx = await manager.setRewardsForLevel(1, [
    {
      childCollection: rykerRightHandAddress,
      assetId1: 7,
      assetId2: 8,
    },
    {
      childCollection: lunaLeftHandAddress,
      assetId1: 3,
      assetId2: 4,
    },
    {
      childCollection: ariaRightHandAddress,
      assetId1: 3,
      assetId2: 4,
    },
    {
      childCollection: thaddeusRightHandAddress,
      assetId1: 3,
      assetId2: 4,
    },
  ]);
  await tx.wait();
  console.log('Level 1 rewards set!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
