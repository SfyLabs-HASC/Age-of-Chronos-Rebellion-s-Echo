import { ethers, run, upgrades } from 'hardhat';

import { delay, isHardhatNetwork, getDeployedContracts } from './utils';
import { configureManager, deployManagerV2 } from './04_utilsFunctions-others';
import { AgeOfChronosManager } from '../typechain-types';

async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Addr1:', addr1 ? addr1.address : 'undefined');
  console.log('Addr2:', addr2 ? addr2.address : 'undefined');

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

  const vicedirettoreAddress = '0x93e7b1f3fA8f57425B8a80337D94Ae3992879911';
  const contract7508Address = '0x4778B7e8088B258A447990e18AdB5fD14B1bD100';

  // Deploying Manager contract
  const manager = await deployManagerV2();

  //configure manager (Needs to be done by owner of the collections)
  // await configureManager(timeSquadAria, [ariaBody, ariaHead, ariaLeftHand, ariaRightHand], manager);
  // await configureManager(timeSquadLuna, [lunaBody, lunaHead, lunaLeftHand, lunaRightHand], manager);
  // await configureManager(
  //   timeSquadRyker,
  //   [rykerBody, rykerHead, rykerLeftHand, rykerRightHand],
  //   manager,
  // );
  // await configureManager(
  //   timeSquadThaddeus,
  //   [thaddeusBody, thaddeusHead, thaddeusLeftHand, thaddeusRightHand],
  //   manager,
  // );
  // console.log('Manager configured');

  //set parent collections
  let tx = await manager.setRykerCollection(await timeSquadRyker.getAddress());
  await tx.wait();
  tx = await manager.setLunaCollection(await timeSquadLuna.getAddress());
  await tx.wait();
  tx = await manager.setAriaCollection(await timeSquadAria.getAddress());
  await tx.wait();
  tx = await manager.setThaddeusCollection(await timeSquadThaddeus.getAddress());
  await tx.wait();
  console.log('parent collection configured');

  //set child collections
  const childCollections = [
    await ariaBody.getAddress(),
    await ariaHead.getAddress(),
    await ariaLeftHand.getAddress(),
    await ariaRightHand.getAddress(),
    await lunaBody.getAddress(),
    await lunaHead.getAddress(),
    await lunaLeftHand.getAddress(),
    await lunaRightHand.getAddress(),
    await rykerBody.getAddress(),
    await rykerHead.getAddress(),
    await rykerLeftHand.getAddress(),
    await rykerRightHand.getAddress(),
    await thaddeusBody.getAddress(),
    await thaddeusHead.getAddress(),
    await thaddeusLeftHand.getAddress(),
    await thaddeusRightHand.getAddress(),
  ];

  tx = await manager.setChildCollections(childCollections);
  await tx.wait();
  console.log('child collection configured');
  await delay(5000);
  //metti al vicedirettore come contributor al manager

  tx = await manager.addContributor(vicedirettoreAddress);
  await tx.wait();
  console.log('add contributor vicedirettore');
  await delay(5000);

  //setFee
  tx = await manager.setFee(100000000000000000n); //0.1 ether
  await tx.wait();
  console.log('fee configured');
  await delay(5000);

  //set7508
  tx = await manager.set7508Address(contract7508Address);
  await tx.wait();
  console.log('add set7508');
  await delay(5000);

  //setExternalAccount
  tx = await manager.setExternalAccount(vicedirettoreAddress);
  await tx.wait();
  console.log('setExternalAccount');
  await delay(5000);

  //set key e value
  tx = await manager.setFeeAttribute('NomindioLabs', 0);
  await tx.wait();
  console.log('add set7508');
  await delay(5000);

  console.log('fine');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
