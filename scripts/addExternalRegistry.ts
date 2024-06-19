import { ethers, run, network } from 'hardhat';
import {
  TimeSquadAria,
  TimeSquadLuna,
  TimeSquadRyker,
   TimeSquadThaddeus,

} from '../typechain-types';
import { getRegistry } from './get-gegistry';
import { delay, isHardhatNetwork } from './utils';
import * as C from './constants';

async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  
  const contractParentAddresses = {
      "Aria": "0x689B3f5093bA55C03CbECb14572fc19bA8D64F09",
      "Luna": "0x0bd877641ca8C5717bc5fA13c2209EBF1F26c1ad",
      "Ryker": "0x931C7B819895873493EfFe7564bFc189d19159a6",
      "Thaddeus": "0x20D33947fcc949249c6213520552ba1690869703"
  };


  const timeSquadAria: TimeSquadAria = await ethers.getContractAt('TimeSquadAria', contractParentAddresses.Aria, deployer);
  const timeSquadLuna: TimeSquadLuna = await ethers.getContractAt('TimeSquadLuna', contractParentAddresses.Luna, deployer);
  const timeSquadRyker: TimeSquadRyker = await ethers.getContractAt('TimeSquadRyker', contractParentAddresses.Ryker, deployer);
  const timeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt('TimeSquadThaddeus', contractParentAddresses.Thaddeus, deployer);

  try {
    const tx00 = await timeSquadThaddeus.totalSupply();
    console.log(`parent totalSupply: ${tx00}`);

    //add external registry
    const registry = await getRegistry();
    await registry.addExternalCollection(contractParentAddresses.Aria,  C.SQUAD_METADATA_ARIA);
    delay(3000)
    await registry.addExternalCollection(contractParentAddresses.Luna,  C.SQUAD_METADATA_LUNA);
    delay(3000)
    await registry.addExternalCollection(contractParentAddresses.Ryker,  C.SQUAD_METADATA_RYKER);
    delay(3000)
    await registry.addExternalCollection(contractParentAddresses.Thaddeus,  C.SQUAD_METADATA_THADDEUS);
    delay(3000)
    console.log('Collection added to Singular Registry');

  } catch (error) {
    console.error('Error during contract interaction:', error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
