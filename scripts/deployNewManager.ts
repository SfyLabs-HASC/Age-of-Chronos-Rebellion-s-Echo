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

async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Addr1:', addr1 ? addr1.address : 'undefined');
  console.log('Addr2:', addr2 ? addr2.address : 'undefined');

/*
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

*/
  
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
  

  /*
const managerContract = "0xC785C764d759a2d5860bb966a159DD72b15b9B07"
  const manager: AgeOfChronosManager = await ethers.getContractAt('AgeOfChronosManager', managerContract, deployer);
*/


  // Deploying Manager contract
  const Manager = await ethers.getContractFactory('AgeOfChronosManager');
  const manager = await Manager.deploy();
  await manager.waitForDeployment();

  const managerAddress = await manager.getAddress();
  console.log('managerAddress deployed to:', managerAddress);


  if (!isHardhatNetwork()) {
      console.log('Waiting 20 seconds before verifying contract...');
      await delay(20000);
      await run('verify:verify', {
          address: managerAddress,
          constructorArguments: [],
          contract: `contracts/manager/AgeOfChronosManager.sol:AgeOfChronosManager`,
      });
  }
  console.log('Deployment complete!');
  await delay(2000);

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

    //set parent collections
    await manager.setRykerCollection(await timeSquadAria.getAddress());
    await delay(5000)
    await manager.setLunaCollection(await timeSquadLuna.getAddress());
    await delay(5000)
    await manager.setAriaCollection(await timeSquadRyker.getAddress());
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
    const vicedirettoreAddress = "0x93e7b1f3fA8f57425B8a80337D94Ae3992879911"
    await manager.addContributor(vicedirettoreAddress)
    console.log("add contributor vicedirettore") 
    await delay(5000)


    //setFee
    await manager.setFee(100000000000000000n)  //0.1 ether
    console.log("fee configured") 
    await delay(5000)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});