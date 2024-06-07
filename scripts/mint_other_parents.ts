import { ethers, run, network } from 'hardhat';
import {
  TimeSquadAria,
  AriaBody,
  AriaHead,
  AriaLeftHand,
  AriaRightHand,

  TimeSquadLuna,
  LunaBody,
  LunaHead,
  LunaLeftHand,
  LunaRightHand,

  TimeSquadRyker,
  RykerBody,
  RykerHead,
  RykerLeftHand,
  RykerRightHand,

  TimeSquadThaddeus,
  ThaddeusBody,
  ThaddeusHead,
  ThaddeusLeftHand,
  ThaddeusRightHand,

  AgeOfChronosManager,
  RMRKCatalogImpl
} from '../typechain-types';
import { getRegistry } from './get-gegistry';
import { delay, isHardhatNetwork } from './utils';
import * as C from './constants';

import {
  deployManager,
  deployCatalog,
  configureCatalog,
  addAssetsAria,
  setEquippableAddresses,
  setExternalPermission,
  nestTransferChildToParent,
  verifyEquippableStatus,
  equipChildOnParent,
  mintParentNFT,
  mintChildNFT,
  removeSoulbound,
  debugEquippableStatus,
  readAssets,
  addAssetToChildToken,
  readAssetsToToken,
  setValidParentForEquippableGroupMain,
  checkEquipConditions,
  getPartDetails
} from './utilsFunctions';
import { exit } from 'process';


async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Addr1:', addr1 ? addr1.address : 'undefined');
  const contractParentAddresses: { [key: string]: string } = {
    "Aria": "0x0F2B21fB5a7962514B096f0dcE3F63eFA39C8eCA",
    "Luna": "0xf0d796f441E507a2ba2d61e15962FEE158509480",
    "Ryker": "0x2Bc097c8DAB92c919df5Ed2B7cCA537F82986c3D",
    "Thaddeus": "0x30322852C1FefA02c193857020C3eB2a8C33B353"
};

const contractCatalogAddresses: { [key: string]: string } = {
    "Aria": "0x0DEe06949C82f46BbD690e61e5bA275C32bfc096",
    "Luna": "0xD9eC22408583C8DB42293925d2a6a8626E7613aC",
    "Ryker": "0x7c6aB4C302C8352D683287832fd0Fb99153fE45A",
    "Thaddeus": "0xf8d5102161C591414c6B9acC0e54E4155601F6b5"
};

const contractItemAddresses: { [key: string]: string } = {
    "AriaBody": "0x14A4d3c92aec0Ab53f154057A4B2148137c79A26",
    "AriaHead": "0xdBea828CF560738D7B922218861E03ED73bCeABB",
    "AriaLeftHand": "0xC20c3672F40D545786D31D2ae966ed712477B02f",
    "AriaRightHand": "0xdCd840aFf89526EE31A183e27e93d8954E98D8A8",
    "LunaBody": "0xE12B4Dc9b985fbaE8748A3f452eCE0dd6DB7301C",
    "LunaHead": "0x0ca86c4bC47aB78cf411630fC301F2Bc7eB46caa",
    "LunaLeftHand": "0x3f58224BB8cA05bE9b070CfE6383D46c0b6F171F",
    "LunaRightHand": "0xcA810487f9aBDAF98bbD0a0e8ba394e77E9A2938",
    "RykerBody": "0xB554326eB0934C04770076A61d72debB2B2e6f19",
    "RykerHead": "0x360830DBef63c855E830A7B3cf29aC4A524956c3",
    "RykerLeftHand": "0x3a4707bc852d7723260f440e4fF0B4b122d12fc2",
    "RykerRightHand": "0xaEC1CC130a96d099D9f7bbd07Fe9964409D7C0F2",
    "ThaddeusBody": "0x46e4a74faC7D62ACa01b554C3851E29920c0ECe8",
    "ThaddeusHead": "0x0d3346f7D4BAf9689ED45021A3E15d0c453B0644",
    "ThaddeusLeftHand": "0x74870BB1DC6DEE7C42bffB961AB06D4053B008B7",
    "ThaddeusRightHand": "0x44bE0f82B1A1b175DC265f599dea847832A25f6c"
};

const managerAddress: string = "0x77107E792C3a3bB0A05E27c141182B67Dc411baB";



  const TimeSquadAria: TimeSquadAria = await ethers.getContractAt('TimeSquadAria', contractParentAddresses.Aria, deployer);
  const TimeSquadLuna: TimeSquadLuna = await ethers.getContractAt('TimeSquadLuna', contractParentAddresses.Luna, deployer);
  const TimeSquadRyker: TimeSquadRyker = await ethers.getContractAt('TimeSquadRyker', contractParentAddresses.Ryker, deployer);
  const TimeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt('TimeSquadThaddeus', contractParentAddresses.Thaddeus, deployer);

  const thaddeusLeftHand: ThaddeusLeftHand = await ethers.getContractAt('ThaddeusLeftHand', contractItemAddresses.ThaddeusLeftHand, deployer);
  const catalogThaddeus: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Thaddeus, deployer);




  try {
    const tx00 = await TimeSquadThaddeus.totalSupply();
    console.log(`parent totalSupply: ${tx00}`);
    const tx01 = await thaddeusLeftHand.totalSupply();
    console.log(`child totalSupply: ${tx01}`);

    console.log(`Manage contributor finished`);
    await delay(10000)
    await mintParentNFT(TimeSquadAria, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadLuna, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadRyker, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadThaddeus, deployer.address);
    console.log(`Minted parents NFT by ${deployer.address} with id 2`);
    await delay(10000);
  
    await mintParentNFT(TimeSquadAria, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadLuna, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadRyker, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadThaddeus, deployer.address);
    console.log(`Minted parents NFT by ${deployer.address} with id 3`);
    await delay(10000);
  
    await mintParentNFT(TimeSquadAria, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadLuna, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadRyker, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadThaddeus, deployer.address);
    console.log(`Minted parents NFT by ${deployer.address} with id 4`);
    await delay(10000);
  
    await mintParentNFT(TimeSquadAria, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadLuna, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadRyker, deployer.address);
    await delay(1000);
    await mintParentNFT(TimeSquadThaddeus, deployer.address);
    console.log(`Minted parents NFT by ${deployer.address} with id 5`);
    await delay(10000);

  } catch (error) {
    console.error('Error during contract interaction:', error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
