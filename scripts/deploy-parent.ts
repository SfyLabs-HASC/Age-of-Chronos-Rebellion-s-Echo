import { ethers, run, network } from 'hardhat';
import {
  TimeSquadAria,
  RMRKCatalogImpl
} from '../typechain-types';
import { delay, isHardhatNetwork } from './utils';
import {
  deployParent,
  deployCatalog,
  configureCatalogFixed,
  addAssetsAria,
  addAssetsLuna,
  addAssetsRyker,
  addAssetsThaddeus,
  mintParentNFT
} from './utils-parent';
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

  const catalogAria = await deployCatalog('CatalogAria', C.SQUAD_CATALOG_ARIA_METADATA, C.CATALOG_TYPE);
  await delay(1000)
  const catalogLuna = await deployCatalog('CatalogLuna', C.SQUAD_CATALOG_LUNA_METADATA, C.CATALOG_TYPE);
  await delay(1000)
  const catalogRyker = await deployCatalog('CatalogRyker', C.SQUAD_CATALOG_RYKER_METADATA, C.CATALOG_TYPE);
  await delay(1000)
  const catalogThaddeus = await deployCatalog('CatalogThaddeus', C.SQUAD_CATALOG_THADDEUS_METADATA, C.CATALOG_TYPE);
  await delay(5000)


  await configureCatalogFixed(catalogAria,
    C.FIXED_PART_ARIA_METADATA);
  await delay(5000)

  await configureCatalogFixed(
    catalogLuna,
    C.FIXED_PART_LUNA_METADATA
  );
  await delay(5000)

  await configureCatalogFixed(
    catalogRyker,
    C.FIXED_PART_RYKER_METADATA
  );
  await delay(5000)

  await configureCatalogFixed(
    catalogThaddeus,
    C.FIXED_PART_THADDEUS_METADATA
  );
  await delay(5000)

  await addAssetsAria(TimeSquadAria, catalogAria);
  console.log("Add Asset Aria complete")
  await delay(5000)
  await addAssetsLuna(TimeSquadLuna, catalogLuna);
  console.log("Add Asset Luna complete")
  await delay(5000)
  await addAssetsRyker(TimeSquadRyker, catalogRyker);
  console.log("Add Asset Ryker complete")
  await delay(5000)
  await addAssetsThaddeus(TimeSquadThaddeus,catalogThaddeus);
  console.log("Add Asset Thaddeus complete")
  await delay(20000)

  await mintParentNFT(TimeSquadAria, deployer.address);
  await delay(1000);
  await mintParentNFT(TimeSquadLuna, deployer.address);
  await delay(1000);
  await mintParentNFT(TimeSquadRyker, deployer.address);
  await delay(1000);
  await mintParentNFT(TimeSquadThaddeus, deployer.address);
  console.log(`Minted parents NFT by ${deployer.address} with id 1`);
  await delay(10000);

  await TimeSquadAria.manageContributor(deployer,true);
  await TimeSquadLuna.manageContributor(deployer,true);
  await TimeSquadRyker.manageContributor(deployer,true);
  await TimeSquadThaddeus.manageContributor(deployer,true);
  console.log(`Manage contributor finished`);
  console.log(" fine")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
