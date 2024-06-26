import { ethers, run, network } from 'hardhat';
import {
  TimeSquadAria,
  TimeSquadLuna,
  TimeSquadRyker,
  TimeSquadThaddeus,
  AriaBody,
  AriaHead,
  AriaLeftHand,
  AriaRightHand,

  LunaBody,
  LunaHead,
  LunaLeftHand,
  LunaRightHand,

  RykerBody,
  RykerHead,
  RykerLeftHand,
  RykerRightHand,

  ThaddeusBody,
  ThaddeusHead,
  ThaddeusLeftHand,
  ThaddeusRightHand,

  AgeOfChronosManager,
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
  mintChildNFTWithNewAssets,
  configureManager
} from './04_utilsFunctions-others';
import * as C from './constants';

async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Addr1:', addr1 ? addr1.address : 'undefined');
  console.log('Addr2:', addr2 ? addr2.address : 'undefined');


  const contractParentAddresses: { [key: string]: string } = {
    "Aria": "0x870d7b70d763fbd4cfbd980cee92bed8ea681859",
    "Luna": "0x09c774cbd3b784c5f93f053ba56c11c1c036a3af",
    "Ryker": "0x456Ad22F5F40B183cc5a8E1AD6377d6A317CDB87",
    "Thaddeus": "0x959cdafeee9ecbd5ea7ea6c2d3fcb1595f10e8bd"
  };
  
  const contractCatalogAddresses: { [key: string]: string } = {
    "Aria": "0xa911E59719EA3356273F0Ae2164E61eE8686873C",
    "Luna": "0x88007b95A8C63289f2282C2396C03779428c525E",
    "Ryker": "0xb69440dcE199C234a19B3E3216ca522ffa1D8b11",
    "Thaddeus": "0xf01b387d6530FF4CA06200e9573b52808C5e7a64"
  };
  
  const contractItemAddresses = {
    "AriaBody": "0xa911E59719EA3356273F0Ae2164E61eE8686873C",
    "AriaHead": "0xBB12975eAd4b9F44A7D562879c8D5A25c8cEEa20",
    "AriaLeftHand": "0x8e9a4a8b3d2f3f618ad2Bdf809431a06DC500Ac5",
    "AriaRightHand": "0x2667b4B8B05797B002CFb42085555E4485ED608b",
  
    "LunaBody": "0x88007b95A8C63289f2282C2396C03779428c525E",
    "LunaHead": "0x5C89fBcb12e6b301844B3a849eF4453fF3924e11",
    "LunaLeftHand": "0x218D19C7106D994cB15BEd4BA8b8EC3632971102",
    "LunaRightHand": "0x78c2963D3e78ee06f9D3f42C91F6800de404C2a2",
  
    "RykerBody": "0xb69440dcE199C234a19B3E3216ca522ffa1D8b11",
    "RykerHead": "0xC13ae85585d81aa6D77b3440C7A273513F70F73F",
    "RykerLeftHand": "0x251bc788bF2f8CF8DF7AdAC16D82A76521b7E448",
    "RykerRightHand": "0xB78180dba14376402EDF0F9B55386A3e9f147026",
  
    "ThaddeusBody": "0xf01b387d6530FF4CA06200e9573b52808C5e7a64",
    "ThaddeusHead": "0x7d847A8e98405e6AF5749542F0dcA1BAd14B6B3B",
    "ThaddeusLeftHand": "0x1aa3e6D9aF4F082Ef1fde6628340a2456766Ec2a",
    "ThaddeusRightHand": "0x2455E46D0b0AD9EbB4612E0b39b8D4421379C59e"
  };
  
  const managerAddress: string = "0x4D5b17a05C82484c4901A4D354e40192163B1c47";

  const TimeSquadAria: TimeSquadAria = await ethers.getContractAt('TimeSquadAria', contractParentAddresses.Aria, deployer);
  const TimeSquadLuna: TimeSquadLuna = await ethers.getContractAt('TimeSquadLuna', contractParentAddresses.Luna, deployer);
  const TimeSquadRyker: TimeSquadRyker = await ethers.getContractAt('TimeSquadRyker', contractParentAddresses.Ryker, deployer);
  const TimeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt('TimeSquadThaddeus', contractParentAddresses.Thaddeus, deployer);

 
  const catalogAria: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Aria, deployer);
  const catalogLuna: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Luna, deployer);
  const catalogRyker: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Ryker, deployer);
  const catalogThaddeus: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Thaddeus, deployer);


  const ariaBody: AriaBody = await ethers.getContractAt('AriaBody', contractItemAddresses.AriaBody, deployer);
  const ariaHead: AriaHead = await ethers.getContractAt('AriaHead', contractItemAddresses.AriaHead, deployer);
  const ariaLeftHand: AriaLeftHand = await ethers.getContractAt('AriaLeftHand', contractItemAddresses.AriaLeftHand, deployer);
  const ariaRightHand: AriaRightHand = await ethers.getContractAt('AriaRightHand', contractItemAddresses.AriaRightHand, deployer);

  const lunaBody: LunaBody = await ethers.getContractAt('LunaBody', contractItemAddresses.LunaBody, deployer);
  const lunaHead: LunaHead = await ethers.getContractAt('LunaHead', contractItemAddresses.LunaHead, deployer);
  const lunaLeftHand: LunaLeftHand = await ethers.getContractAt('LunaLeftHand', contractItemAddresses.LunaLeftHand, deployer);
  const lunaRightHand: LunaRightHand = await ethers.getContractAt('LunaRightHand', contractItemAddresses.LunaRightHand, deployer);

  const rykerBody: RykerBody = await ethers.getContractAt('RykerBody', contractItemAddresses.RykerBody, deployer);
  const rykerHead: RykerHead = await ethers.getContractAt('RykerHead', contractItemAddresses.RykerHead, deployer);
  const rykerLeftHand: RykerLeftHand = await ethers.getContractAt('RykerLeftHand', contractItemAddresses.RykerLeftHand, deployer);
  const rykerRightHand: RykerRightHand = await ethers.getContractAt('RykerRightHand', contractItemAddresses.RykerRightHand, deployer);

  const thaddeusBody: ThaddeusBody = await ethers.getContractAt('ThaddeusBody', contractItemAddresses.ThaddeusBody, deployer);
  const thaddeusHead: ThaddeusHead = await ethers.getContractAt('ThaddeusHead', contractItemAddresses.ThaddeusHead, deployer);
  const thaddeusLeftHand: ThaddeusLeftHand = await ethers.getContractAt('ThaddeusLeftHand', contractItemAddresses.ThaddeusLeftHand, deployer);
  const thaddeusRightHand: ThaddeusRightHand = await ethers.getContractAt('ThaddeusRightHand', contractItemAddresses.ThaddeusRightHand, deployer);

  const manager: AgeOfChronosManager = await ethers.getContractAt('AgeOfChronosManager', managerAddress, deployer);
  
  



  console.log('start');
  //LEFT HAND aria
    //set primary asset
    const txChild01_left_hand_aria = await ariaLeftHand.addAssetEntry(
      C.ARIA_ASSET_METADATA_LEFT_HAND_URI_1,
  );
  await txChild01_left_hand_aria.wait();
  await delay(1000)
  //set secondary asset
  const txChild02_left_hand_aria = await ariaLeftHand.addEquippableAssetEntry(
      C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
      ethers.ZeroAddress,
      C.ARIA_ASSET_METADATA_LEFT_HAND_URI_2,
      [],
  );
  await txChild02_left_hand_aria.wait();
  await delay(1000)
  const txChild03_left_hand_aria = await ariaLeftHand.setValidParentForEquippableGroup(
      C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
      await TimeSquadAria.getAddress(),
      C.SQUAD_LEFT_HAND_SLOT_PART_ID,
  );
  await txChild03_left_hand_aria.wait();
  await delay(1000)
  console.log('aria finished aasette');

  //LEFT HAND luna
    //set primary asset
    const txChild01_left_hand_luna = await lunaLeftHand.addAssetEntry(
      C.LUNA_ASSET_METADATA_LEFT_HAND_URI_1,
  );
  await txChild01_left_hand_luna.wait();
  await delay(1000)
  //set secondary asset
  const txChild02_left_hand_luna = await lunaLeftHand.addEquippableAssetEntry(
      C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
      ethers.ZeroAddress,
      C.LUNA_ASSET_METADATA_LEFT_HAND_URI_2,
      [],
  );
  await txChild02_left_hand_luna.wait();
  await delay(1000)
  const txChild03_left_hand_luna = await lunaLeftHand.setValidParentForEquippableGroup(
      C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
      await TimeSquadLuna.getAddress(),
      C.SQUAD_LEFT_HAND_SLOT_PART_ID,
  );
  await txChild03_left_hand_luna.wait();
  await delay(1000)
  console.log('luna finished aasette');

  //RIGHT HAND  ryker
    //set primary asset
    const txChild01_right_hand_ryker = await rykerRightHand.addAssetEntry(
      C.RYKER_ASSET_METADATA_RIGHT_HAND_URI_1,
  );
  await txChild01_right_hand_ryker.wait();
  await delay(1000)
  //set secondary asset
  const txChild02_right_hand_ryker = await rykerRightHand.addEquippableAssetEntry(
      C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
      ethers.ZeroAddress,
      C.RYKER_ASSET_METADATA_RIGHT_HAND_URI_2,
      [],
  );
  await txChild02_right_hand_ryker.wait();
  await delay(1000)
  const txChild03_right_hand_ryker = await rykerRightHand.setValidParentForEquippableGroup(
      C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
      await TimeSquadRyker.getAddress(),
      C.SQUAD_RIGHT_HAND_SLOT_PART_ID,
  );
  await txChild03_right_hand_ryker.wait();
  await delay(1000)
  console.log('rikey finished aasette');

  //RIGHT HAND thaddeus
    //set primary asset
    const txChild01_right_hand_thaddeus = await thaddeusRightHand.addAssetEntry(
      C.THADDEUS_ASSET_METADATA_RIGHT_HAND_URI_1,
  );
  await txChild01_right_hand_thaddeus.wait();
  await delay(1000)
  //set secondary asset
  const txChild02_right_hand_thaddeus = await thaddeusRightHand.addEquippableAssetEntry(
      C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
      ethers.ZeroAddress,
      C.THADDEUS_ASSET_METADATA_RIGHT_HAND_URI_2,
      [],
  );
  await txChild02_right_hand_thaddeus.wait();
  await delay(1000)
  const txChild03_right_hand_thaddeus = await thaddeusRightHand.setValidParentForEquippableGroup(
      C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
      await TimeSquadThaddeus.getAddress(),
      C.SQUAD_RIGHT_HAND_SLOT_PART_ID,
  );
  await txChild03_right_hand_thaddeus.wait();
  await delay(1000)
  console.log('thaddeus finished aasette');

  //await setExternalPermission(ariaBody, deployer.address, true);
  //await setExternalPermission(ariaHead, deployer.address, true);
  await setExternalPermission(ariaLeftHand, deployer.address, true);
  //await setExternalPermission(ariaRightHand, deployer.address, true);
  await delay(1000);
 // await setExternalPermission(lunaBody, deployer.address, true);
  //await setExternalPermission(lunaHead, deployer.address, true);
  await setExternalPermission(lunaLeftHand, deployer.address, true);
  //await setExternalPermission(lunaRightHand, deployer.address, true);
  await delay(1000);
 // await setExternalPermission(rykerBody, deployer.address, true);
 // await setExternalPermission(rykerHead, deployer.address, true);
 // await setExternalPermission(rykerLeftHand, deployer.address, true);
  await setExternalPermission(rykerRightHand, deployer.address, true);
  await delay(1000);
 // await setExternalPermission(thaddeusBody, deployer.address, true);
  //await setExternalPermission(thaddeusHead, deployer.address, true);
  //await setExternalPermission(thaddeusLeftHand, deployer.address, true);
  await setExternalPermission(thaddeusRightHand, deployer.address, true);
  await delay(1000);
  console.log('external permission finished');
  //await mintChildNFT(ariaBody, deployer.address);
  //await mintChildNFT(ariaHead, deployer.address);
  await mintChildNFTWithNewAssets(ariaLeftHand, deployer.address,[3,4]);
  //await mintChildNFT(ariaRightHand, deployer.address);
  await delay(1000);
  //await mintChildNFT(lunaBody, deployer.address);
  //await mintChildNFT(lunaHead, deployer.address);
  await mintChildNFTWithNewAssets(lunaLeftHand, deployer.address,[3,4]);
  //await mintChildNFT(lunaRightHand, deployer.address);
  await delay(1000);
  //await mintChildNFT(rykerBody, deployer.address);
  //await mintChildNFT(rykerHead, deployer.address);
  //await mintChildNFT(rykerLeftHand, deployer.address);
  await mintChildNFTWithNewAssets(rykerRightHand, deployer.address,[3,4]);
  await delay(1000);
  //await mintChildNFT(thaddeusBody, deployer.address);
  //await mintChildNFT(thaddeusHead, deployer.address);
  //await mintChildNFT(thaddeusLeftHand, deployer.address);
  await mintChildNFTWithNewAssets(thaddeusRightHand, deployer.address,[3,4]);
  await delay(1000);

  console.log('Minted child with id 1');
  console.log(" fine")

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
