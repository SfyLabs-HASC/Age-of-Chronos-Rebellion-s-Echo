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
  } from '../../typechain-types';
import { getRegistry } from '../get-gegistry';
import { delay, isHardhatNetwork } from '../utils';
import {
    configureManager
  } from '../utilsFunctions';
import * as C from '../constants';

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
} from '../utilsFunctions';
import { exit } from 'process';

async function main() {
    const [deployer, addr1, addr2] = await ethers.getSigners();
    console.log('Deployer:', deployer.address);
    console.log('Addr1:', addr1 ? addr1.address : 'undefined');
    console.log('Addr2:', addr2 ? addr2.address : 'undefined');

    const contractParentAddresses = {
        "Aria": "0x28E6bB44976A8CbdF32a826bf2b0F3C83827fBB4",
        "Luna": "0x713bDF77C02342c975ad16fcA41d923dea3D03B7",
        "Ryker": "0xa9f2E818A524b51900bc517A6EC97b27C7167F79",
        "Thaddeus": "0x44700E473182dC3ff512b98424fCd397634BE4EF"
    };

    const contractCatalogAddresses = {
        "Aria": "0x5D1A13A03b03c8A6183503f901C06676240DA6a3",
        "Luna": "0x7C50A1160E0d0B50c6BF302E4b7F90886654947D",
        "Ryker": "0xc16ee43a79beAcD8811729752EBE77ED9E0D43b3",
        "Thaddeus": "0x6b4318B1a0afEBA0263300488c42B2AE13a138A9"
    };

    const contractItemAddresses = {
        "AriaBody": "0xcDAC21a0396FCb696284d7e27e5c420A9002559a",
        "AriaHead": "0xBa8A397438F00b04840c7043f050cD7d57E01AA9",
        "AriaLeftHand": "0xA595b26ea43B69138e7498e2051453890031c16a",
        "AriaRightHand": "0xB4bD56aF329d9619E5912E22EE68299EA5e2d160",
        "LunaBody": "0x5b3927B951Ac8c13143EBb060fAA919A8192B08e",
        "LunaHead": "0x91de5daf1577f4b71624e62C4c4497678b403AE0",
        "LunaLeftHand": "0x09263E4a5e7FDA64eF3CE940221D11c56D8c2579",
        "LunaRightHand": "0x77E1bbA48Fa7Da070a3c070A5d082e5854a4aBF3",
        "RykerBody": "0x0AC928c0435FE8e884cb0385D26A828CAFa7d8dC",
        "RykerHead": "0x963eEC4B9330DdD594Bb064db30Ea2D03EfaB5Ac",
        "RykerLeftHand": "0x3f7Df31f787c07C8101c7be8C6916785aC5A3f61",
        "RykerRightHand": "0x804bC6FeA5b94e12c9ea82d4d79cc7E21C27727c",
        "ThaddeusBody": "0x14F448e072A0Bb30fB96a4cF402DE8179beAEC0D",
        "ThaddeusHead": "0xEd98Bd5D6Cff12472142bd553e300E044dde8Fbb",
        "ThaddeusLeftHand": "0x7C069383b7f0B54A8de1EEb395eb719545fD8F21",
        "ThaddeusRightHand": "0x78D5Ff1017d276E9397ab888F635B50937760fB7"
    };

    const timeSquadAria: TimeSquadAria = await ethers.getContractAt('TimeSquadAria', contractParentAddresses.Aria, deployer);
    const timeSquadLuna: TimeSquadLuna = await ethers.getContractAt('TimeSquadLuna', contractParentAddresses.Luna, deployer);
    const timeSquadRyker: TimeSquadRyker = await ethers.getContractAt('TimeSquadRyker', contractParentAddresses.Ryker, deployer);
    const timeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt('TimeSquadThaddeus', contractParentAddresses.Thaddeus, deployer);

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

    const catalogAria: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Aria, deployer);
    const catalogLuna: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Luna, deployer);
    const catalogRyker: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Ryker, deployer);
    const catalogThaddeus: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Thaddeus, deployer);
    console.log('All contracts instantiated successfully.');

    //configure Manager
    // Deploy contract through thirdweb using addr1 instead of deployer
    /*
    const AgeOfChronosManagerFactory = await ethers.getContractFactory("AgeOfChronosManager", addr1);
    const ageOfChronosManager = await AgeOfChronosManagerFactory.deploy();
    await ageOfChronosManager.waitForDeployment();
    console.log("AgeOfChronosManager deployed to:", await ageOfChronosManager.getAddress());
    await delay(5000)
    await configureManager(timeSquadAria, [ariaBody, ariaHead, ariaLeftHand, ariaRightHand], catalogAria, ageOfChronosManager);
    await delay(5000)
    await configureManager(timeSquadLuna, [lunaBody, lunaHead, lunaLeftHand, lunaRightHand], catalogLuna, ageOfChronosManager);
    await delay(5000)
    await configureManager(timeSquadRyker, [rykerBody, rykerHead, rykerLeftHand, rykerRightHand], catalogRyker, ageOfChronosManager);
    await delay(5000)
    await configureManager(timeSquadThaddeus, [thaddeusBody, thaddeusHead, thaddeusLeftHand, thaddeusRightHand], catalogThaddeus, ageOfChronosManager);
    await delay(5000)
*/
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });