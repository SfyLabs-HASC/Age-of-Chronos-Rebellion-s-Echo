//import { ethers } from 'hardhat';
const { ethers } = require("hardhat");
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { AgeOfChronosManager } from '../typechain-types';
import { ParentSample } from '../typechain-types';

async function deployContracts() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const contractParentFactory = await ethers.getContractFactory('parentSample');
    const contractManagerFactory = await ethers.getContractFactory('AgeOfChronosManager');

    const collectionMeta = 'ipfs://QmNnn9M8rTbqPrk3rHTfN78sh4E1QLHaEKcSALrvhWfMkE';
    const maxSupply = ethers.MaxUint256;
    const royaltyRecipient = owner.address;
    const royaltyPercentageBps = 1000; // 10%
    const pricePerMint = ethers.parseUnits("0", 18);

    const argsParent = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps, pricePerMint];
    const parentContract = await contractParentFactory.deploy(...argsParent);
    await parentContract.waitForDeployment(); // Ensure the contract is fully deployed

    const managerContract = await contractManagerFactory.deploy(parentContract.address);
    await managerContract.waitForDeployment(); // Ensure the contract is fully deployed

    return { parentContract, managerContract, owner, addr1, addr2 };
}

describe("Contract deployment and functionality tests", function () {
  it("Should correctly deploy and retrieve the name and symbol of the parentSample contract", async function () {
    const { parentContract } = await loadFixture(deployContracts);
    const name = await parentContract.name();
    const symbol = await parentContract.symbol();

    console.log(`Contract name: ${name}, Symbol: ${symbol}`);
    expect(name).to.be.a('string');
    expect(symbol).to.be.a('string');
  });

  it("Should correctly deploy and potentially retrieve the name and symbol of the AgeOfChronosManager contract, if applicable", async function () {
    const { managerContract } = await loadFixture(deployContracts);
    // Assuming AgeOfChronosManager also has name and symbol methods, which may not be the case
    // Uncomment and adjust below lines if your contract has these methods.
    // const name = await managerContract.name();
    // const symbol = await managerContract.symbol();

    // console.log(`Contract name: ${name}, Symbol: ${symbol}`);
    // expect(name).to.be.a('string');
    // expect(symbol).to.be.a('string');
    console.log("Assuming AgeOfChronosManager does not have name/symbol methods.");
  });
});


describe("xPARENTx Contract Tests", function () {
    describe("Soulbound Token Transfer Tests", function () {
        const fixture = async () => {
          console.log("inizio")
            const { parentContract, managerContract, owner, addr1, addr2 } = await loadFixture(deployContracts);
            console.log("parent: ",parentContract.address)
            console.log("owner: ",owner.address)
            console.log("managerContract: ",managerContract.address)
            console.log("addr1: ",addr1.address)
            console.log("addr2: ",addr2.address)
            await parentContract.connect(addr1).mint(addr1.address, 1, { value: ethers.parseEther("0.01") });
            return { parentContract, owner, addr1, addr2 };
        };

        it("should not allow transfer of a soulbound token", async function () {
            const { parentContract, addr1, addr2 } = await loadFixture(fixture);
            await expect(parentContract.connect(addr1).transferFrom(addr1.address, addr2.address, 1))
                .to.be.revertedWith("Token is soulbound");
        });
    });

    describe("Soulbound Token Removal and Transfer Test", function () {
        const fixture = async () => {
            const { parentContract, managerContract, owner, addr1, addr2 } = await loadFixture(deployContracts);
            await parentContract.connect(addr1).mint(addr1.address, 1, { value: ethers.utils.parseEther("0.01") });
            await managerContract.setSoulbound(1, false);
            return { parentContract, owner, addr1, addr2 };
        };

        it("should allow transfer of a non-soulbound token", async function () {
            const { parentContract, addr1, addr2 } = await loadFixture(fixture);
            await expect(parentContract.connect(addr1).transferFrom(addr1.address, addr2.address, 1))
                .to.emit(parentContract, "Transfer").withArgs(addr1.address, addr2.address, 1);
        });
    });
});
