import { ethers, run, network } from 'hardhat';
import {
  TimeSquadAria,
  TimeSquadLuna,
  TimeSquadRyker,
  TimeSquadThaddeus,
  AriaBody,
  RMRKCatalogImpl
} from '../typechain-types';
import { delay, isHardhatNetwork } from './utils';
import {
  deployChild,
  deployManager,
  configureCatalog,
  addAssetsAria,
  addAssetsLuna,
  addAssetsRyker,
  addAssetsThaddeus,
  setEquippableAddresses,
  setExternalPermission,
  mintChildNFT,
  configureManager
} from './04_utilsFunctions-others';
import * as C from './constants';

async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Addr1:', addr1 ? addr1.address : 'undefined');
  console.log('Addr2:', addr2 ? addr2.address : 'undefined');


  const contractParentAddresses: { [key: string]: string } = {
    "Aria": "0xB594ff9BF060FE2fbb45f2eC528676856D8Da511",
    "Luna": "0xA8c3Cd7F534E6cA415F2978097885B9C6c5C749C",
    "Ryker": "0x53a2ee42506939bcEf2a9bf69097Ac7616D4AA66",
    "Thaddeus": "0x55A7dd722eAAb2e8Becd08b54b9f2cB79755a059"
};

const contractCatalogAddresses: { [key: string]: string } = {
    "Aria": "0x8E4773ff3Cb94E78cA44ed0E5aA0844033B462db",
    "Luna": "0xa4DdF7045925e96acfBe5d789A5994D07eb56a1D",
    "Ryker": "0x49827CF9ac8c00bf13dE240aF5211401D448e133",
    "Thaddeus": "0x3025CB69FaD0Eb26aB6F90DC01b02B31048f1Bf1"
};



const TimeSquadAria: TimeSquadAria = await ethers.getContractAt('TimeSquadAria', contractParentAddresses.Aria, deployer);
const TimeSquadLuna: TimeSquadLuna = await ethers.getContractAt('TimeSquadLuna', contractParentAddresses.Luna, deployer);
const TimeSquadRyker: TimeSquadRyker = await ethers.getContractAt('TimeSquadRyker', contractParentAddresses.Ryker, deployer);
const TimeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt('TimeSquadThaddeus', contractParentAddresses.Thaddeus, deployer);



  const ariaBody = await deployChild('AriaBody', C.SQUAD_ITEM_METADATA_ARIA_BODY);
  await delay(1000)
  const ariaHead = await deployChild('AriaHead', C.SQUAD_ITEM_METADATA_ARIA_HEAD);
  await delay(1000)
  const ariaLeftHand = await deployChild('AriaLeftHand', C.SQUAD_ITEM_METADATA_ARIA_LEFT_HAND);
  await delay(1000)
  const ariaRightHand = await deployChild('AriaRightHand', C.SQUAD_ITEM_METADATA_ARIA_RIGHT_HAND);
  await delay(10000)
  const lunaBody = await deployChild('LunaBody', C.SQUAD_ITEM_METADATA_LUNA_BODY);
  await delay(1000)
  const lunaHead = await deployChild('LunaHead', C.SQUAD_ITEM_METADATA_LUNA_HEAD);
  await delay(1000)
  const lunaLeftHand = await deployChild('LunaLeftHand', C.SQUAD_ITEM_METADATA_LUNA_LEFT_HAND);
  await delay(1000)
  const lunaRightHand = await deployChild('LunaRightHand', C.SQUAD_ITEM_METADATA_LUNA_RIGHT_HAND);
  await delay(10000)
  const rykerBody = await deployChild('RykerBody', C.SQUAD_ITEM_METADATA_RYKER_BODY);
  await delay(1000)
  const rykerHead = await deployChild('RykerHead', C.SQUAD_ITEM_METADATA_RYKER_HEAD);
  await delay(1000)
  const rykerLeftHand = await deployChild('RykerLeftHand', C.SQUAD_ITEM_METADATA_RYKER_LEFT_HAND);
  await delay(1000)
  const rykerRightHand = await deployChild('RykerRightHand', C.SQUAD_ITEM_METADATA_RYKER_RIGHT_HAND);
  await delay(10000)
  const thaddeusBody = await deployChild('ThaddeusBody', C.SQUAD_ITEM_METADATA_THADDEUS_BODY);
  await delay(1000)
  const thaddeusHead = await deployChild('ThaddeusHead', C.SQUAD_ITEM_METADATA_THADDEUS_HEAD);
  await delay(1000)
  const thaddeusLeftHand = await deployChild('ThaddeusLeftHand', C.SQUAD_ITEM_METADATA_THADDEUS_LEFT_HAND);
  await delay(1000)
  const thaddeusRightHand = await deployChild('ThaddeusRightHand', C.SQUAD_ITEM_METADATA_THADDEUS_RIGHT_HAND);
  await delay(10000)

  const catalogAria: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Aria, deployer);
  const catalogLuna: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Luna, deployer);
  const catalogRyker: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Ryker, deployer);
  const catalogThaddeus: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Thaddeus, deployer);



  const manager = await deployManager();
  await delay(5000)
  await configureManager(TimeSquadAria, [ariaBody, ariaHead, ariaLeftHand, ariaRightHand], manager);
  await delay(5000)
  await configureManager(TimeSquadLuna, [lunaBody, lunaHead, lunaLeftHand, lunaRightHand], manager);
  await delay(5000)
  await configureManager(TimeSquadRyker, [rykerBody, rykerHead, rykerLeftHand, rykerRightHand], manager);
  await delay(5000)
  await configureManager(TimeSquadThaddeus, [thaddeusBody, thaddeusHead, thaddeusLeftHand, thaddeusRightHand], manager);
  await delay(5000)
  console.log("Manager configured")

  await configureCatalog(catalogAria,
    await ariaBody.getAddress(),
    await ariaHead.getAddress(),
    await ariaLeftHand.getAddress(),
    await ariaRightHand.getAddress(),
    C.FIXED_PART_ARIA_METADATA);
  await delay(5000)
  console.log("catalogAria configured")

  await configureCatalog(
    catalogLuna,
    await lunaBody.getAddress(),
    await lunaHead.getAddress(),
    await lunaLeftHand.getAddress(),
    await lunaRightHand.getAddress(),
    C.FIXED_PART_LUNA_METADATA
  );
  await delay(5000)
  console.log("catalogLuna configured")

  await configureCatalog(
    catalogRyker,
    await rykerBody.getAddress(),
    await rykerHead.getAddress(),
    await rykerLeftHand.getAddress(),
    await rykerRightHand.getAddress(),
    C.FIXED_PART_RYKER_METADATA
  );
  await delay(5000)
  console.log("catalogRyker configured")

  await configureCatalog(
    catalogThaddeus,
    await thaddeusBody.getAddress(),
    await thaddeusHead.getAddress(),
    await thaddeusLeftHand.getAddress(),
    await thaddeusRightHand.getAddress(),
    C.FIXED_PART_THADDEUS_METADATA
  );
  await delay(5000)
  console.log("catalogThaddeus configured")


  await addAssetsAria(TimeSquadAria, ariaBody, ariaHead, ariaLeftHand, ariaRightHand);
  console.log("Add Asset Aria complete")
  await delay(5000)
  await addAssetsLuna(TimeSquadLuna, lunaBody, lunaHead, lunaLeftHand, lunaRightHand);
  console.log("Add Asset Luna complete")
  await delay(5000)
  await addAssetsRyker(TimeSquadRyker, rykerBody, rykerHead, rykerLeftHand, rykerRightHand);
  console.log("Add Asset Ryker complete")
  await delay(5000)
  await addAssetsThaddeus(TimeSquadThaddeus, thaddeusBody, thaddeusHead, thaddeusLeftHand, thaddeusRightHand);
  console.log("Add Asset Thaddeus complete")
  await delay(20000)

  const tx01 = await TimeSquadAria.setAutoAcceptCollection(await ariaBody.getAddress(), true);
  await tx01.wait();
  await delay(2000)

  const tx02 = await TimeSquadAria.setAutoAcceptCollection(await ariaHead.getAddress(), true);
  await tx02.wait();
  await delay(2000);

  const tx03 = await TimeSquadAria.setAutoAcceptCollection(await ariaLeftHand.getAddress(), true);
  await tx03.wait();
  await delay(2000);

  const tx04 = await TimeSquadAria.setAutoAcceptCollection(await ariaRightHand.getAddress(), true);
  await tx04.wait();
  await delay(2000);

  const tx05 = await TimeSquadLuna.setAutoAcceptCollection(await lunaBody.getAddress(), true);
  await tx05.wait();
  await delay(2000);

  const tx06 = await TimeSquadLuna.setAutoAcceptCollection(await lunaHead.getAddress(), true);
  await tx06.wait();
  await delay(2000);

  const tx07 = await TimeSquadLuna.setAutoAcceptCollection(await lunaLeftHand.getAddress(), true);
  await tx07.wait();
  await delay(2000);

  const tx08 = await TimeSquadLuna.setAutoAcceptCollection(await lunaRightHand.getAddress(), true);
  await tx08.wait();
  await delay(2000);


  //da qui
  const tx09 = await TimeSquadRyker.setAutoAcceptCollection(await rykerBody.getAddress(), true);
  await tx09.wait();
  await delay(2000);

  const tx10 = await TimeSquadRyker.setAutoAcceptCollection(await rykerHead.getAddress(), true);
  await tx10.wait();
  await delay(2000);

  const tx11 = await TimeSquadRyker.setAutoAcceptCollection(await rykerLeftHand.getAddress(), true);
  await tx11.wait();
  await delay(2000);

  const tx12 = await TimeSquadRyker.setAutoAcceptCollection(await rykerRightHand.getAddress(), true);
  await tx12.wait();
  await delay(2000);

  const tx13 = await TimeSquadThaddeus.setAutoAcceptCollection(await thaddeusBody.getAddress(), true);
  await tx13.wait();
  await delay(2000);

  const tx14 = await TimeSquadThaddeus.setAutoAcceptCollection(await thaddeusHead.getAddress(), true);
  await tx14.wait();
  await delay(2000);

  const tx15 = await TimeSquadThaddeus.setAutoAcceptCollection(await thaddeusLeftHand.getAddress(), true);
  await tx15.wait();
  await delay(2000);

  const tx16 = await TimeSquadThaddeus.setAutoAcceptCollection(await thaddeusRightHand.getAddress(), true);
  await tx16.wait();
  await delay(2000);

  console.log("SetAutoAcceptCollection complete");

  await delay(10000)
  await setEquippableAddresses(catalogAria, await ariaBody.getAddress(), await ariaHead.getAddress(), await ariaLeftHand.getAddress(), await ariaRightHand.getAddress());
  await delay(10000);

  await setEquippableAddresses(catalogLuna, await lunaBody.getAddress(), await lunaHead.getAddress(), await lunaLeftHand.getAddress(), await lunaRightHand.getAddress());
  await delay(10000);

  await setEquippableAddresses(catalogRyker, await rykerBody.getAddress(), await rykerHead.getAddress(), await rykerLeftHand.getAddress(), await rykerRightHand.getAddress());
  await delay(10000);

  await setEquippableAddresses(catalogThaddeus, await thaddeusBody.getAddress(), await thaddeusHead.getAddress(), await thaddeusLeftHand.getAddress(), await thaddeusRightHand.getAddress());
  await delay(10000);


  console.log('Deployment complete!');
  await delay(10000);



  await setExternalPermission(ariaBody, deployer.address, true);
  await setExternalPermission(ariaHead, deployer.address, true);
  await setExternalPermission(ariaLeftHand, deployer.address, true);
  await setExternalPermission(ariaRightHand, deployer.address, true);
  await delay(10000);
  await setExternalPermission(lunaBody, deployer.address, true);
  await setExternalPermission(lunaHead, deployer.address, true);
  await setExternalPermission(lunaLeftHand, deployer.address, true);
  await setExternalPermission(lunaRightHand, deployer.address, true);
  await delay(10000);
  await setExternalPermission(rykerBody, deployer.address, true);
  await setExternalPermission(rykerHead, deployer.address, true);
  await setExternalPermission(rykerLeftHand, deployer.address, true);
  await setExternalPermission(rykerRightHand, deployer.address, true);
  await delay(10000);
  await setExternalPermission(thaddeusBody, deployer.address, true);
  await setExternalPermission(thaddeusHead, deployer.address, true);
  await setExternalPermission(thaddeusLeftHand, deployer.address, true);
  await setExternalPermission(thaddeusRightHand, deployer.address, true);
  await delay(10000);

  //await mintChildNFT(ariaBody, deployer.address);
  //await mintChildNFT(ariaHead, deployer.address);
  await mintChildNFT(ariaLeftHand, deployer.address);
  //await mintChildNFT(ariaRightHand, deployer.address);
  await delay(1000);
  //await mintChildNFT(lunaBody, deployer.address);
  //await mintChildNFT(lunaHead, deployer.address);
  await mintChildNFT(lunaLeftHand, deployer.address);
  //await mintChildNFT(lunaRightHand, deployer.address);
  await delay(1000);
  //await mintChildNFT(rykerBody, deployer.address);
  //await mintChildNFT(rykerHead, deployer.address);
  //await mintChildNFT(rykerLeftHand, deployer.address);
  await mintChildNFT(rykerRightHand, deployer.address);
  await delay(1000);
  //await mintChildNFT(thaddeusBody, deployer.address);
  //await mintChildNFT(thaddeusHead, deployer.address);
  //await mintChildNFT(thaddeusLeftHand, deployer.address);
  await mintChildNFT(thaddeusRightHand, deployer.address);
  await delay(1000);

  console.log('Minted child with id 1');
  console.log(" fine")

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
