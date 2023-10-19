import { ethers, run, network } from 'hardhat';
import { BigNumber } from 'ethers';
import { AgeofChronos } from '../typechain-types';
import { getRegistry } from './getRegistry';

async function main() {
  await deployContracts();
}

async function deployContracts(): Promise<void> {
  console.log(`Deploying Age of Chronos - Incubators to ${network.name} blockchain...`);

  const contractFactory = await ethers.getContractFactory("AgeofChronos");
  const args = [
    "ipfs://QmeiYGefkPGypEWpTNpipyuxpG28X539nrDrHauWpFZLLS/",
    BigNumber.from(1000),
    "0xe150519ae293922cfE6217FEba3AdD4726f5E851",
    500,  //5%
  ] as const;
  
  const contract: AgeofChronos = await contractFactory.deploy(...args);
  await contract.deployed();
  console.log(`Age of Chronos deployed to ${contract.address}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
