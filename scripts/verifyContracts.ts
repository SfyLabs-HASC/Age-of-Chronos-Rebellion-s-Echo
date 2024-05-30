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
    "Aria": "0x28a147ebE82a64D294D0b2a92c51A487015773B1",
    "Luna": "0x5F0e041A5c039c2A83a00d85e487E6Cf066f4CEF",
    "Ryker": "0xAe6Ab9Bb9704ec017cb28F990f6a76a54D3104ce",
    "Thaddeus": "0x2472Ea2ddC078661b2f8b24A3468c65617d43530"
  };

  const contractCatalogAddresses: { [key: string]: string } = {
    "Aria": "0xfBBdF276bE2f8Eb35095a246de5003B56049b764",
    "Luna": "0x8f116f4f7c57963D9c6bCb08EFE8686A51c056d4",
    "Ryker": "0x1e6a9268c4f04e22470055884d85035cB31d6F6f",
    "Thaddeus": "0x78FD9Fc35E2D3D7d83227AE6340A18bC6957F59f"
  };

  const contractItemAddresses: { [key: string]: string } = {
    "AriaBody": "0xBd1fBdd38511566ab78b416BD92300895365858e",
    "AriaHead": "0x6992a197339b156A5a053D1cb05FC5ee430E9b0B",
    "AriaLeftHand": "0x136dfE210d76BF27D766E912204B2C02B0D4763C",
    "AriaRightHand": "0x1E8D331e9Ef55DA578E777A09388f7BcFa53c8D9",
    "LunaBody": "0x7898Fb1FCc5E3d7e12117f0A00407ae9818D0773",
    "LunaHead": "0x135498D46CD14081fF1bc3c67D0b5ff0ea12CCC7",
    "LunaLeftHand": "0x6f9160f98cA62105d33013E141A751FeD4E9A0AB",
    "LunaRightHand": "0x138e361b67D3FF9E191748f7a529De613dF6d9D8",
    "RykerBody": "0x3a4e805B6c2228A910F8b738AD9Ff1B7Bb1a8a6C",
    "RykerHead": "0x370BF465f388a829A34f2796077AB039CC9b4BB3",
    "RykerLeftHand": "0xD8aF19C961a3f9C5768Fe445D1E8Dbcf4Ea03d27",
    "RykerRightHand": "0xF5Ae527B0449859b24F7E4Dc307de27d258CE1CC",
    "ThaddeusBody": "0xdCead27F36c95cAfC337B3430Aa6C7420C3455A1",
    "ThaddeusHead": "0xbc488546E62Cd867eb2663a81d39A4258a35C5b0",
    "ThaddeusLeftHand": "0x2708B281Ee2fC2eBaca1Ec119da2532F5175d3e6",
    "ThaddeusRightHand": "0xb3A26D87103FE414c6d74AF77fb59c3574Eac916"
  };




  const timeSquadAria: TimeSquadAria = await ethers.getContractAt('TimeSquadAria', contractParentAddresses.Aria, deployer);
  const timeSquadLuna: TimeSquadLuna = await ethers.getContractAt('TimeSquadLuna', contractParentAddresses.Luna, deployer);
  const timeSquadRyker: TimeSquadRyker = await ethers.getContractAt('TimeSquadRyker', contractParentAddresses.Ryker, deployer);
  const timeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt('TimeSquadThaddeus', contractParentAddresses.Thaddeus, deployer);

  const thaddeusLeftHand: ThaddeusLeftHand = await ethers.getContractAt('ThaddeusLeftHand', contractItemAddresses.ThaddeusLeftHand, deployer);
  const catalogThaddeus: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Thaddeus, deployer);




  try {
    const tx00 = await timeSquadThaddeus.totalSupply();
    console.log(`parent totalSupply: ${tx00}`);
    const tx01 = await thaddeusLeftHand.totalSupply();
    console.log(`child totalSupply: ${tx01}`);
  }
}
