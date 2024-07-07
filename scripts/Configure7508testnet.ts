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

  const contractItemAddresses = {
    "AriaBody": "0x20D730B01ff9749b76e21D865128Da1B3Fe64392",
    "AriaHead": "0x24ec16B0A24554c857C5D58bF1f4BBE556f6D6A1",
    "AriaLeftHand": "0x962ac89d6DeF62E09e0e6BAE6a981b8A4536E6b5",
    "AriaRightHand": "0xF616d4c889654D81BBaA388D2c6fb1CA54Eea25E",

    "LunaBody": "0x07a2016536cc594ADca5CfF95A77aE6AdEbA8E83",
    "LunaHead": "0xceBA956B5C38E12330552C73dd8e718572541F07",
    "LunaLeftHand": "0x99Ccc376D152504f673b7D7D5875A1C30F43F987",
    "LunaRightHand": "0xf09484859C3750Ec880eC6349D1D021881c183bc",

    "RykerBody": "0xba228c1500912deE060227C5E9376800caefFbF9",
    "RykerHead": "0xA63dd6aC8E22FA4d09e81680168aBeF95fC97B46",
    "RykerLeftHand": "0x0A4e95b961ecB2E0c8212933966cc2609C33bb1C",
    "RykerRightHand": "0xebb8D47B02040131fCeB371C87948ade9c20e613",

    "ThaddeusBody": "0x7beb49b806Dc8F5c07d93aFE2c99c248CeA156Fb",
    "ThaddeusHead": "0x920334512979058ea29594e65212E3E641f9e66a",
    "ThaddeusLeftHand": "0x189457A1Be8f89D84aD24dE400B5748c8A825Af4",
    "ThaddeusRightHand": "0xfd68e0eEb4Ad3fA20A6BFcf1ffCf718AB65F677F"
  };

  const managerAddress: string = "0xceed712979DE2D082cBDc50c58FB4411F8b1A006";
  const TOKEN_ATTRIBUTES_REPOSITORY_ADDRESS_DRAFT_MOONBASE =
    '0xE5CF7218253535E019bb4B38Fb9d0167BB6D049e';
  const vicedirettoreAddress = "0x93e7b1f3fA8f57425B8a80337D94Ae3992879911"


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
  const tokenAttributesContract: RMRKTokenAttributesRepository = await ethers.getContractAt('RMRKTokenAttributesRepository', TOKEN_ATTRIBUTES_REPOSITORY_ADDRESS_DRAFT_MOONBASE, deployer);

  console.log('start');
  const attributesKey = "NomindioLabs";
  const firstTime = false


  if (firstTime) {
    for (const [key, address] of Object.entries(contractParentAddresses)) {
      //Used to register a collection to use the RMRK token attributes repository.
      const tx = await tokenAttributesContract.registerAccessControl(address, deployer.address, true);
      await tx.wait();
      console.log(`${deployer.address} is set an access control for ${key} collection`)
      delay(2000)
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
      delay(2000)

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
      delay(2000)

    }
  }



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
      delay(2000)
    }
  }


  /*
  for (const [key, address] of Object.entries(contractParentAddresses)) {
    let isSpecificAddressDeployer = await tokenAttributesContract.isSpecificAddress(deployer.address, address, "NomindioLabs");
    console.log(`${key} collection (address: ${address}):isSpecificAddress for Deployer: ${isSpecificAddressDeployer}`);

    let isSpecificAddressAddr1 = await tokenAttributesContract.isSpecificAddress(addr1.address, address, "NomindioLabs");
    console.log(`${key} collection (address: ${address}):isSpecificAddress for addr1: ${isSpecificAddressAddr1}`);

  }
*/

  const tokenId = 1;
  for (const [key, address] of Object.entries(contractParentAddresses)) {
    const whichLevel = await getUintAttribute(address, tokenId, attributesKey);
    console.log(`${key} collection TokenID: ${tokenId} (address: ${address}):whichLevel: ${whichLevel}`);
  }


  console.log("provo col videdirettore")



  const accessTypeCollaborator = 1;  //1 is collaborator
    for (const [key, address] of Object.entries(contractParentAddresses)) {
      //Only the owner of the collection can call this function
      let tx = await tokenAttributesContract.manageAccessControl(
        address,
        attributesKey,
        accessTypeCollaborator,
        addr1.address,
      );
      await tx.wait();
      console.log(`manageAccessControl: ${addr1.address} is set as ${accessTypeCollaborator} for ${key} collection`)
      delay(2000)

    }

    for (const [key, address] of Object.entries(contractParentAddresses)) {
      let whois = await tokenAttributesContract.isCollaborator(addr1.address, address);
      console.log(`${key} collection (address: ${address}): ${whois ? 'addr1.address is a collaborator' : 'Deployer is not a collaborator'}`);
      if (!whois) {
        //Only the owner of the collection can call this function
        let tx = await tokenAttributesContract.manageCollaborators(
          address,
          [addr1.address],
          [true],
        );
        await tx.wait();
        console.log(`manageCollaborators: ${addr1.address} is set as ${true} for ${key} collection`)
        delay(2000)
      }
    }

    delay(5000)
  const tokenAttributesContractAddr1: RMRKTokenAttributesRepository = await ethers.getContractAt('RMRKTokenAttributesRepository', TOKEN_ATTRIBUTES_REPOSITORY_ADDRESS_DRAFT_MOONBASE, addr1);

  for (const [key, address] of Object.entries(contractParentAddresses)) {
    const resultato = await tokenAttributesContractAddr1.setUintAttribute(address,tokenId,attributesKey,0)
    delay(2000)
    console.log("ricevuta",resultato.hash)
  }

  /*
  const resultato = await setUintAttribute(collection,2,attributesKey,0)
    delay(2000)
    console.log("ricevuta",resultato)
    */



  /*
  
    const firstTime = false
    if (firstTime) {
      const tx = await tokenAttributesContract.registerAccessControl(collection, deployer.address, true);
      await tx.wait();
    }
  
    whois = await tokenAttributesContract.isCollaborator(deployer.address, collection);
    console.log(whois);
  
    //delay(1000)
  
    const attributesKey = "NomindioLabs";
    const accessType = 0;  //0 is owner
  
    
    let tx = await tokenAttributesContract.manageAccessControl(
      collection,
      attributesKey,
      accessType,
      deployer.address,
    );
    await tx.wait(); 
  
  
    
  
    //whois= await tokenAttributesContract.isCollaborator(deployer.address, collection);
    //console.log(whois);
  
    whois = await tokenAttributesContract.isSpecificAddress(deployer.address, collection, "multiCorp");
    console.log(whois);
    whois = await tokenAttributesContract.isSpecificAddress(deployer.address, collection, "MultiCorp");
    console.log(whois);
  
    
  
    
    const resultato = await setUintAttribute(collection,2,"Nomindio Labs",0)
    delay(2000)
    console.log("ricevuta",resultato)
    
    
    
  
    const whichLevel = await getUintAttribute(collection,2,"Nomindio Labs");
    console.log(whichLevel)
  
  */

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
