import { ethers, run, network } from 'hardhat';
import {
  TimeSquadAria,
  AriaBody,
  AgeOfChronosManager,
  RMRKCatalogImpl
} from '../typechain-types';
import { delay, isHardhatNetwork } from './utils';
import {
  deployParent,
  deployChild,
  deployManager,
  deployCatalog,
  configureCatalog,
  addAssetsAria,
  addAssetsLuna,
  addAssetsRyker,
  addAssetsThaddeus,
  setEquippableAddresses,
  setExternalPermission,
  nestTransferChildToParent,
  verifyEquippableStatus,
  equipChildOnParent,
  mintParentNFT,
  mintChildNFT,
  readAssets,
  addAssetToChildToken,
  configureManager
} from './utilsFunctions';
import * as C from './constants';

async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Addr1:', addr1 ? addr1.address : 'undefined');
  console.log('Addr2:', addr2 ? addr2.address : 'undefined');

  const TimeSquadAria = await deployParent('TimeSquadAria', C.SQUAD_METADATA_ARIA, C.MINT_ENUMERATE_ARIA);
  await delay(1000)
  const TimeSquadLuna = await deployParent('TimeSquadLuna', C.SQUAD_METADATA_LUNA, C.MINT_ENUMERATE_LUNA);
  await delay(1000)
  const TimeSquadRyker = await deployParent('TimeSquadRyker', C.SQUAD_METADATA_RYKER, C.MINT_ENUMERATE_RYKER);
  await delay(1000)
  const TimeSquadThaddeus = await deployParent('TimeSquadThaddeus', C.SQUAD_METADATA_THADDEUS, C.MINT_ENUMERATE_THADDEUS);
  await delay(10000)


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

  const manager = await deployManager();
  await delay(5000)
  const catalogAria = await deployCatalog('CatalogAria', C.SQUAD_CATALOG_ARIA_METADATA, C.CATALOG_TYPE);
  await delay(1000)
  const catalogLuna = await deployCatalog('CatalogLuna', C.SQUAD_CATALOG_LUNA_METADATA, C.CATALOG_TYPE);
  await delay(1000)
  const catalogRyker = await deployCatalog('CatalogRyker', C.SQUAD_CATALOG_RYKER_METADATA, C.CATALOG_TYPE);
  await delay(1000)
  const catalogThaddeus = await deployCatalog('CatalogThaddeus', C.SQUAD_CATALOG_THADDEUS_METADATA, C.CATALOG_TYPE);
  await delay(5000)

  await configureManager(TimeSquadAria, [ariaBody, ariaHead, ariaLeftHand, ariaRightHand], catalogAria, manager);
  await delay(5000)
  await configureManager(TimeSquadLuna, [lunaBody, lunaHead, lunaLeftHand, lunaRightHand], catalogLuna, manager);
  await delay(5000)
  await configureManager(TimeSquadRyker, [rykerBody, rykerHead, rykerLeftHand, rykerRightHand], catalogRyker, manager);
  await delay(5000)
  await configureManager(TimeSquadThaddeus, [thaddeusBody, thaddeusHead, thaddeusLeftHand, thaddeusRightHand], catalogThaddeus, manager);
  await delay(5000)


  await configureCatalog(catalogAria,
    await ariaBody.getAddress(),
    await ariaHead.getAddress(),
    await ariaLeftHand.getAddress(),
    await ariaRightHand.getAddress(),
    C.FIXED_PART_ARIA_METADATA);
  await delay(5000)

  await configureCatalog(
    catalogLuna,
    await lunaBody.getAddress(),
    await lunaHead.getAddress(),
    await lunaLeftHand.getAddress(),
    await lunaRightHand.getAddress(),
    C.FIXED_PART_LUNA_METADATA
  );
  await delay(5000)

  await configureCatalog(
    catalogRyker,
    await rykerBody.getAddress(),
    await rykerHead.getAddress(),
    await rykerLeftHand.getAddress(),
    await rykerRightHand.getAddress(),
    C.FIXED_PART_RYKER_METADATA
  );
  await delay(5000)

  await configureCatalog(
    catalogThaddeus,
    await thaddeusBody.getAddress(),
    await thaddeusHead.getAddress(),
    await thaddeusLeftHand.getAddress(),
    await thaddeusRightHand.getAddress(),
    C.FIXED_PART_THADDEUS_METADATA
  );
  await delay(5000)



  await addAssetsAria(TimeSquadAria, ariaBody, ariaHead, ariaLeftHand, ariaRightHand, catalogAria);
  console.log("Add Asset Aria complete")
  await delay(5000)
  await addAssetsLuna(TimeSquadLuna, lunaBody, lunaHead, lunaLeftHand, lunaRightHand, catalogLuna);
  console.log("Add Asset Aria complete")
  await delay(5000)
  await addAssetsRyker(TimeSquadRyker, rykerBody, rykerHead, rykerLeftHand, rykerRightHand, catalogRyker);
  console.log("Add Asset Aria complete")
  await delay(5000)
  await addAssetsThaddeus(TimeSquadThaddeus, thaddeusBody, thaddeusHead, thaddeusLeftHand, thaddeusRightHand, catalogThaddeus);
  console.log("Add Asset Aria complete")
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



  //TODO MINTARE DUE PARENT CON DUE ADDRESS DIVERSI E DUE CHILD (LEFT_HAND) CON DUE ADDRESS DIVERSI

  await mintParentNFT(TimeSquadAria, deployer.address);
  await delay(1000);
  await mintParentNFT(TimeSquadLuna, deployer.address);
  await delay(1000);
  await mintParentNFT(TimeSquadRyker, deployer.address);
  await delay(1000);
  await mintParentNFT(TimeSquadThaddeus, deployer.address);
  console.log(`Minted parents NFT by ${deployer.address} with id 1`);
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
  await mintChildNFT(rykerLeftHand, deployer.address);
  //await mintChildNFT(rykerRightHand, deployer.address);
  await delay(1000);
  //await mintChildNFT(thaddeusBody, deployer.address);
  //await mintChildNFT(thaddeusHead, deployer.address);
  await mintChildNFT(thaddeusLeftHand, deployer.address);
  //await mintChildNFT(thaddeusRightHand, deployer.address);
  await delay(1000);

  console.log('Minted child with id 1');


  await mintParentNFT(TimeSquadAria, addr1.address);
  await delay(10000);
  await mintParentNFT(TimeSquadLuna, addr1.address);
  await delay(10000);
  await mintParentNFT(TimeSquadRyker, addr1.address);
  await delay(10000);
  await mintParentNFT(TimeSquadThaddeus, addr1.address);
  console.log(`Minted parents NFT by ${addr1.address} with id 2`);
  await delay(10000);



  await setExternalPermission(ariaBody, addr1.address, true);
  await setExternalPermission(ariaHead, addr1.address, true);
  await setExternalPermission(ariaLeftHand, addr1.address, true);
  await setExternalPermission(ariaRightHand, addr1.address, true);
  await delay(10000);
  await setExternalPermission(lunaBody, addr1.address, true);
  await setExternalPermission(lunaHead, addr1.address, true);
  await setExternalPermission(lunaLeftHand, addr1.address, true);
  await setExternalPermission(lunaRightHand, addr1.address, true);
  await delay(10000);
  await setExternalPermission(rykerBody, addr1.address, true);
  await setExternalPermission(rykerHead, addr1.address, true);
  await setExternalPermission(rykerLeftHand, addr1.address, true);
  await setExternalPermission(rykerRightHand, addr1.address, true);
  await delay(10000);
  await setExternalPermission(thaddeusBody, addr1.address, true);
  await setExternalPermission(thaddeusHead, addr1.address, true);
  await setExternalPermission(thaddeusLeftHand, addr1.address, true);
  await setExternalPermission(thaddeusRightHand, addr1.address, true);
  await delay(10000);




  //todo NON WORKA PERCHé DOVRESTI PASSARGLI IL CONTRATTO FACTORY ASSOCIATO AD ADDR1 E NON DEPLOYER
  /*
  //await mintChildNFT(ariaBody, addr1.address);
  //await mintChildNFT(ariaHead, addr1.address);
  await mintChildNFT(ariaLeftHand, addr1.address);
  //await mintChildNFT(ariaRightHand, addr1.address);
  await delay(20000);
  //await mintChildNFT(lunaBody, addr1.address);
  //await mintChildNFT(lunaHead, addr1.address);
  await mintChildNFT(lunaLeftHand, addr1.address);
  //await mintChildNFT(lunaRightHand, addr1.address);
  await delay(20000);
  //await mintChildNFT(rykerBody, addr1.address);
  //await mintChildNFT(rykerHead, addr1.address);
  await mintChildNFT(rykerLeftHand, addr1.address);
  //await mintChildNFT(rykerRightHand, addr1.address);
  await delay(20000);
  //await mintChildNFT(thaddeusBody, addr1.address);
  //await mintChildNFT(thaddeusHead, addr1.address);
  await mintChildNFT(thaddeusLeftHand, addr1.address);
  //await mintChildNFT(thaddeusRightHand, addr1.address);
  await delay(20000);
*/
  console.log(" fine")
  /*
  //await nestTransferChildToParent(parent, child, 1, 1, deployer.address);  // Assumi che sia il token ID 1 per entrambi
*/
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
