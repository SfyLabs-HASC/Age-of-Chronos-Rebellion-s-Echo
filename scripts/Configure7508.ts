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
  RMRKCatalogImpl,
  RMRKTokenAttributesRepository
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
    "Aria": "0xf6F0130799de29cf1A402290766a1C9c95B6d017",
    "Luna": "0xe429fb9fD5dcFe9B148f0E6FF922C8A6d12B4f53",
    "Ryker": "0x972009B42a51CaCd43e059a2C56e92541EF2Bc2f",
    "Thaddeus": "0xE7AeB43Ed1dE5D357F190847830b2a9f31E0C032"
  };

  const contractCatalogAddresses: { [key: string]: string } = {
    "Aria": "0xA9390e1009aBC0B3fA9cDfcCaC379CF15DecA3F6",
    "Luna": "0xCb7aE692aa7C042715FCA463789F1aC91924a2CA",
    "Ryker": "0x6ad1c0226f5ecc90e109b57c75af3Db7b5ad74aC",
    "Thaddeus": "0xDDc1Da0373fd9494a6d599E7520543953BA94672"
  };

  const contractItemAddresses = {
    "AriaBody": "0x225f647344418AD2FaBf4282649bd045656870Dc",
    "AriaHead": "0xFd2694a26127A34DeF6Eddb04760102821ca2dd9",
    "AriaLeftHand": "0x9Ea72623340C7420f5cAb670e7a77Cca879ED9bD",
    "AriaRightHand": "0xfF1923f1Ae0601bD962FD2eE4Ad6B285dF668e0d",

    "LunaBody": "0xBA88F7834D9D3f350222b78b4046c0f12B00d980",
    "LunaHead": "0xC24f2A9263b9F86680C4F56F2B83E9fFA1ccdc9b",
    "LunaLeftHand": "0x1F88d1694372BE1cAe8037888A2A2c22E949bb7d",
    "LunaRightHand": "0x1d67c78882e2dba65659958d1Db09566E5aaf2aC",

    "RykerBody": "0xc6d66e35DF2f3150056DcC7D2c5d2BA4e719c054",
    "RykerHead": "0x903eEaC60a50f5f459E5Fa5bF87C5BB0552cF8F0",
    "RykerLeftHand": "0xbCfc42003bC3eFC7813A355DD514532525dc6b0f",
    "RykerRightHand": "0x9dB9312A55550B0F6a5fcaAb31F5fBb9Abfbb3Cb",

    "ThaddeusBody": "0xbbE40d2dC88e21B5FF7600239867ea033725b02a",
    "ThaddeusHead": "0xC352128862fDE7b6C02edc40D0d8b2F92D472392",
    "ThaddeusLeftHand": "0xa7A13411b55daFd9c0Cc69f5bfa21B3d71ca6bb7",
    "ThaddeusRightHand": "0x7ea2542c69B768747583D90a41cF35916571c15C"
  };

  const vicedirettoreAddress = "0x93e7b1f3fA8f57425B8a80337D94Ae3992879911"
  const contract7508Address = "0xE5CF7218253535E019bb4B38Fb9d0167BB6D049e"
  const managerAddress:string = "0xd50248022D8b254De8923109664918f707e4D074"
  const TOKEN_ATTRIBUTES_REPOSITORY_ADDRESS_MOONBEAM =
    '0x4778B7e8088B258A447990e18AdB5fD14B1bD100';


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
  const tokenAttributesContract: RMRKTokenAttributesRepository = await ethers.getContractAt('RMRKTokenAttributesRepository', TOKEN_ATTRIBUTES_REPOSITORY_ADDRESS_MOONBEAM, deployer);

  console.log('start');


  const attributesKey = "NomindioLabs";
  const firstTime = false

  if (firstTime) {

    for (const [key, address] of Object.entries(contractParentAddresses)) {
      //Used to register a collection to use the RMRK token attributes repository.
      const tx = await tokenAttributesContract.registerAccessControl(address, deployer.address, true);
      await tx.wait();
      console.log(`${deployer.address} is set an access control for ${key} collection`)
      delay(5000)
    }

    const accessTypeOwner = 0;  //0 is owner
    for (const [key, address] of Object.entries(contractParentAddresses)) {
      //Only the owner of the collection can call this function
      let tx = await tokenAttributesContract.manageAccessControl(
        address,
        attributesKey,
        accessTypeOwner,
        deployer.address,
      );
      await tx.wait();
      console.log(`manageAccessControl: ${deployer.address} is set as ${accessTypeOwner} for ${key} collection`)
      delay(5000)

    }


    const accessTypeCollaborator = 1;  //1 is collaborator
    for (const [key, address] of Object.entries(contractParentAddresses)) {
      //Only the owner of the collection can call this function
      let tx = await tokenAttributesContract.manageAccessControl(
        address,
        attributesKey,
        accessTypeCollaborator,
        vicedirettoreAddress,
      );
      await tx.wait();
      console.log(`manageAccessControl: ${vicedirettoreAddress} is set as ${accessTypeCollaborator} for ${key} collection`)
      delay(5000)

    }

    delay(5000)
    //riprendi da qua
    for (const [key, address] of Object.entries(contractParentAddresses)) {
      let whois = await tokenAttributesContract.isCollaborator(vicedirettoreAddress, address);
      console.log(`${key} collection (address: ${address}): ${whois ? 'vicedirettoreAddress is a collaborator' : 'Deployer is not a collaborator'}`);
      if (!whois) {
        //Only the owner of the collection can call this function
        let tx = await tokenAttributesContract.manageCollaborators(
          address,
          [vicedirettoreAddress],
          [true],
        );
        await tx.wait();
        console.log(`manageCollaborators: ${vicedirettoreAddress} is set as ${true} for ${key} collection`)
        delay(5000)
      }
    }

  }

console.log("sono qui")

  
    
  


  //manager address!
    const accessTypeCollaborator = 1;  //1 is collaborator
    for (const [key, address] of Object.entries(contractParentAddresses)) {
      //Only the owner of the collection can call this function
      let tx = await tokenAttributesContract.manageAccessControl(
        address,
        attributesKey,
        accessTypeCollaborator,
        managerAddress,
      );
      await tx.wait();
      console.log(`manageAccessControl: ${managerAddress} is set as ${accessTypeCollaborator} for ${key} collection`)
      delay(2000)

    }
  



  for (const [key, address] of Object.entries(contractParentAddresses)) {
    let whois = await tokenAttributesContract.isCollaborator(managerAddress, address);
    console.log(`${key} collection (address: ${address}): ${whois ? 'managerAddress is a collaborator' : 'Deployer is not a collaborator'}`);
    if (!whois) {
      //Only the owner of the collection can call this function
      let tx = await tokenAttributesContract.manageCollaborators(
        address,
        [managerAddress],
        [true],
      );
      await tx.wait();
      console.log(`manageCollaborators: ${managerAddress} is set as ${true} for ${key} collection`)
      delay(2000)
    }



  }


  const tokenId = 1;
  for (const [key, address] of Object.entries(contractParentAddresses)) {
    const whichLevel = await getUintAttribute(address, tokenId, attributesKey);
    console.log(`${key} collection TokenID: ${tokenId} (address: ${address}):whichLevel: ${whichLevel}`);
  }


  console.log("provo col videdirettore")



  
  const tokenAttributesContractAddr1: RMRKTokenAttributesRepository = await ethers.getContractAt('RMRKTokenAttributesRepository', TOKEN_ATTRIBUTES_REPOSITORY_ADDRESS_MOONBEAM, addr1);

  for (const [key, address] of Object.entries(contractParentAddresses)) {
    const resultato = await tokenAttributesContractAddr1.setUintAttribute(address,tokenId,attributesKey,0)
    delay(2000)
    console.log("ricevuta",resultato.hash)
  }

  // Function to check if an address is a collaborator
  async function isCollaborator(collection: string, collaborator: string): Promise<boolean> {
    return await tokenAttributesContract.isCollaborator(collaborator, collection);
  }

  // Function to manage access control
  async function manageAccessControl(collection: string, key: string, accessType: number, specificAddress: string) {
    await tokenAttributesContract.manageAccessControl(collection, key, accessType, specificAddress);
  }

  // Function to manage collaborators
  async function manageCollaborators(collection: string, collaboratorAddresses: string[], collaboratorAddressAccess: boolean[]) {
    await tokenAttributesContract.manageCollaborators(collection, collaboratorAddresses, collaboratorAddressAccess);
  }

  // Function to set an integer attribute
  async function setIntAttribute(collection: string, tokenId: number, key: string, value: number) {
    await tokenAttributesContract.setIntAttribute(collection, tokenId, key, value);
  }

  // Function to set a uint attribute
  async function setUintAttribute(collection: string, tokenId: number, key: string, value: number) {
    await tokenAttributesContract.setUintAttribute(collection, tokenId, key, value);
  }

  // Function to set a string attribute
  async function setStringAttribute(collection: string, tokenId: number, key: string, value: string) {
    await tokenAttributesContract.setStringAttribute(collection, tokenId, key, value);
  }

  // Function to set an address attribute
  async function setAddressAttribute(collection: string, tokenId: number, key: string, value: string) {
    await tokenAttributesContract.setAddressAttribute(collection, tokenId, key, value);
  }

  // Function to set multiple integer attributes
  async function setIntAttributes(collections: string[], tokenIds: number[], attributes: { key: string, value: number }[]) {
    await tokenAttributesContract.setIntAttributes(collections, tokenIds, attributes);
  }

  // Function to get a uint attribute
  async function getUintAttribute(collection: string, tokenId: number, key: string): Promise<BigInt> {
    return await tokenAttributesContract.connect(addr1).getUintAttribute(collection, tokenId, key);
  }

  // Function to get a string attribute
  async function getStringAttribute(collection: string, tokenId: number, key: string): Promise<string> {
    return await tokenAttributesContract.getStringAttribute(collection, tokenId, key);
  }

  // Function to get an address attribute
  async function getAddressAttribute(collection: string, tokenId: number, key: string): Promise<string> {
    return await tokenAttributesContract.getAddressAttribute(collection, tokenId, key);
  }

  console.log("fine")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
