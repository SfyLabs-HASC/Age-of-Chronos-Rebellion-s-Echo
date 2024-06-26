import { ethers, run, network } from 'hardhat';
import { delay, isHardhatNetwork } from './utils';

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account:', deployer.address);


    // Deploying RMRKCalculateBalance contract
    const CalculateRecursivelyBalance = await ethers.getContractFactory('CalculateRecursivelyBalance');
    const calculateRecursivelyBalance = await CalculateRecursivelyBalance.deploy();

    await calculateRecursivelyBalance.waitForDeployment();
    const contractAddress = await calculateRecursivelyBalance.getAddress();
    console.log('CalculateBalance deployed to:', contractAddress);


    if (!isHardhatNetwork()) {
        console.log('Waiting 20 seconds before verifying contract...');
        await delay(20000);
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: [],
            contract: `contracts/manager/CalculateRecursivelyBalance.sol:CalculateRecursivelyBalance`,
        });
    }
    console.log('Deployment complete!');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
