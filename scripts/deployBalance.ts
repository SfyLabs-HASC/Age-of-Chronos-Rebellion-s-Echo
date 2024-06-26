import { ethers, run, network } from 'hardhat';

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account:', deployer.address);


    // Deploying RMRKCalculateBalance contract
    const RMRKCalculateBalance = await ethers.getContractFactory('RMRKCalculateBalance');
    const rmrkCalculateBalance = await RMRKCalculateBalance.deploy();

    await rmrkCalculateBalance.waitForDeployment();
    console.log('RMRKCalculateBalance deployed to:', await rmrkCalculateBalance.getAddress());


    console.log('Deployment complete!');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
