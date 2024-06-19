import { ethers, run, network } from 'hardhat';
import {
  TimeSquadAria,
  TimeSquadLuna,
  TimeSquadRyker,
  TimeSquadThaddeus,
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
} from './03_utils-parent';
import * as C from './constants';

async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Addr1:', addr1 ? addr1.address : 'undefined');
  console.log('Addr2:', addr2 ? addr2.address : 'undefined');

  const contractParentAddresses = {
      "Aria": "0x689B3f5093bA55C03CbECb14572fc19bA8D64F09",
      "Luna": "0x0bd877641ca8C5717bc5fA13c2209EBF1F26c1ad",
      "Ryker": "0x931C7B819895873493EfFe7564bFc189d19159a6",
      "Thaddeus": "0x20D33947fcc949249c6213520552ba1690869703"
  };

  const contractCatalogAddresses = {
      "Aria": "0xdb826Ff30552383F251e07D89FCC545D1917eFFe",
      "Luna": "",
      "Ryker": "",
      "Thaddeus": ""
  };

  const TimeSquadAria: TimeSquadAria = await ethers.getContractAt('TimeSquadAria', contractParentAddresses.Aria, deployer);
  const TimeSquadLuna: TimeSquadLuna = await ethers.getContractAt('TimeSquadLuna', contractParentAddresses.Luna, deployer);
  const TimeSquadRyker: TimeSquadRyker = await ethers.getContractAt('TimeSquadRyker', contractParentAddresses.Ryker, deployer);
  const TimeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt('TimeSquadThaddeus', contractParentAddresses.Thaddeus, deployer);

  const catalogAria: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Aria, deployer);








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
