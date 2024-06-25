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
    "Aria": "0x870D7B70d763FbD4CFBd980CEE92BeD8ea681859",
    "Luna": "0x09C774cbD3b784C5f93F053ba56C11c1c036A3Af",
    "Ryker": "0x456Ad22F5F40B183cc5a8E1AD6377d6A317CDB87",
    "Thaddeus": "0x959cDAfeeE9ecbd5ea7Ea6C2D3fcB1595F10e8bd"
  };

  const contractCatalogAddresses: { [key: string]: string } = {
    "Aria": "0x0a3fdc64FD9799c07f5E13644580914326d54AB3",
    "Luna": "0x3c48fa60bE6C45704ddcCffA7FbFC36dEe52b045",
    "Ryker": "0x631934D67177bA789E3e5f1f49d046456624fA6B",
    "Thaddeus": "0x93b87941640d7f7Bf28cab5AD1B77f40C7570cC7"
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
  //da qua devi riprendere
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
