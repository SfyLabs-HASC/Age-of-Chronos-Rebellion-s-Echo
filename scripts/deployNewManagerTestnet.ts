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
  mintChildNFT,
  configureManager
} from './04_utilsFunctions-others';
import * as C from './constants';
import { decodeUnsafe } from 'bs58';

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


  const timeSquadAria: TimeSquadAria = await ethers.getContractAt('TimeSquadAria', contractParentAddresses.Aria, deployer);
  const timeSquadLuna: TimeSquadLuna = await ethers.getContractAt('TimeSquadLuna', contractParentAddresses.Luna, deployer);
  const timeSquadRyker: TimeSquadRyker = await ethers.getContractAt('TimeSquadRyker', contractParentAddresses.Ryker, deployer);
  const timeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt('TimeSquadThaddeus', contractParentAddresses.Thaddeus, deployer);

 
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
  


const vicedirettoreAddress = "0x93e7b1f3fA8f57425B8a80337D94Ae3992879911"
const contract7508Address = "0xE5CF7218253535E019bb4B38Fb9d0167BB6D049e"
const managerAddress = "0xceed712979DE2D082cBDc50c58FB4411F8b1A006"
  const manager: AgeOfChronosManager = await ethers.getContractAt('AgeOfChronosManager', managerAddress, deployer);

  if (!isHardhatNetwork()) {
    console.log('Waiting 20 seconds before verifying contract...');
    //await delay(20000);
    await run('verify:verify', {
        address: managerAddress,
        constructorArguments: [],
        contract: 'contracts/manager/AgeOfChronosManager.sol:AgeOfChronosManager',
    });
}


/*
  //configure manager
  await configureManager(timeSquadAria, [ariaBody, ariaHead, ariaLeftHand, ariaRightHand], manager);
  await delay(5000)
  await configureManager(timeSquadLuna, [lunaBody, lunaHead, lunaLeftHand, lunaRightHand], manager);
  await delay(5000)
  await configureManager(timeSquadRyker, [rykerBody, rykerHead, rykerLeftHand, rykerRightHand], manager);
  await delay(5000)
  await configureManager(timeSquadThaddeus, [thaddeusBody, thaddeusHead, thaddeusLeftHand, thaddeusRightHand], manager);
  await delay(5000)
  console.log("Manager configured")  
*/


/*
    //set parent collections
    await manager.setRykerCollection(await timeSquadRyker.getAddress());
    await delay(5000)
    await manager.setLunaCollection(await timeSquadLuna.getAddress());
    await delay(5000)
    await manager.setAriaCollection(await timeSquadAria.getAddress());
    await delay(5000)
    await manager.setThaddeusCollection(await timeSquadThaddeus.getAddress());
    await delay(5000)
    console.log("parent collection configured") 
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
            await thaddeusRightHand.getAddress()
        ];
        
        await manager.setChildCollections(childCollections);
        console.log("child collection configured") 
        await delay(5000)
    //metti al vicedirettore come contributor al manager
    
    await manager.addContributor(vicedirettoreAddress)
    console.log("add contributor vicedirettore") 
    await delay(5000)


    //setFee
    await manager.setFee(100000000000000000n)  //0.1 ether
    console.log("fee configured") 
    await delay(5000)

    //set7508
    await manager.set7508Address(contract7508Address)
    console.log("add set7508") 
    await delay(5000)

    //setExternalAccount
    await manager.setExternalAccount(vicedirettoreAddress)
    console.log("setExternalAccount") 
    await delay(5000)

    //set key e value
    await manager.setFeeAttribute("NomindioLabs",0)
    console.log("add set7508") 
    await delay(5000)



    */
       //configura la 7508
       
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});