import { ethers, Signer } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { AgeOfChronosManager, ParentSample } from '../typechain-types';

async function fixtureParent(): Promise<ParentSample> {
    const [owner] = await ethers.getSigners();
    const collectionMeta = 'ipfs://QmNnn9M8rTbqPrk3rHTfN78sh4E1QLHaEKcSALrvhWfMkE';
    const maxSupply = ethers.MaxUint256;
    const royaltyRecipient = owner.address;
    const royaltyPercentageBps = 1000; // 10%
    const baseTokenURI = 'https://example.com/metadata/';

    const contractParentFactory = await ethers.getContractFactory('parentSample');

    const argsParent = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps, baseTokenURI];
    const parentContract = await contractParentFactory.deploy(...argsParent);
    await parentContract.waitForDeployment(); // Ensure the contract is fully deployed

    return parentContract;
}

async function fixtureManager(): Promise<AgeOfChronosManager> {
    const [owner] = await ethers.getSigners();
    const parentAddresses = [];

    const contractManagerFactory = await ethers.getContractFactory('AgeOfChronosManager');

    const ManagerContract = await contractManagerFactory.deploy(parentAddresses);
    await ManagerContract.waitForDeployment();

    return ManagerContract;
}

describe('Base TESTS', async () => {
    let parentContract: ParentSample;
    let contractManager: AgeOfChronosManager;
    let owner: Signer, addr1: Signer, addr2: Signer;

    beforeEach(async function () {
        parentContract = await loadFixture(fixtureParent);
        contractManager = await loadFixture(fixtureManager);
        [owner, addr1, addr2] = await ethers.getSigners();
    });

    describe('Init', async function () {
        it('can get names and symbols', async function () {
            expect(await parentContract.name()).to.equal('parentSample');
            expect(await parentContract.symbol()).to.equal('sPARENTs');
        });
    });

    describe("Mint and Pause Tests", async function () {
        it('pauses and unpauses minting', async function () {
            await parentContract.connect(owner).setPause(true);
            await expect(parentContract.connect(addr1).mint(addr1.address))
                .to.be.revertedWith("Minting is paused");

            await parentContract.connect(owner).setPause(false);
            await parentContract.connect(addr1).mint(addr1.address);
            expect(await parentContract.balanceOf(addr1.address)).to.equal(1);
        });
    });

    describe("URI Tests", async function () {
        it('sets and gets base URI', async function () {
            const newBaseURI = 'https://newexample.com/metadata/';
            await parentContract.connect(owner).setBaseURI(newBaseURI);
            await parentContract.connect(addr1).mint(addr1.address);

            const tokenId = 1;
            expect(await parentContract.tokenURI(tokenId)).to.equal(`${newBaseURI}${tokenId}.json`);
        });

        it('sets and gets base extension', async function () {
            const newBaseExtension = '.token';
            await parentContract.connect(owner).setBaseExtension(newBaseExtension);
            await parentContract.connect(addr1).mint(addr1.address);

            const tokenId = 1;
            expect(await parentContract.tokenURI(tokenId)).to.equal(`https://example.com/metadata/${tokenId}${newBaseExtension}`);
        });
    });

    describe("Soulbound Tests", async function () {
        beforeEach(async function () {
            await parentContract.connect(addr1).mint(addr1.address);
            await parentContract.connect(owner).manageContributor(await contractManager.getAddress(), true);
            await contractManager.connect(owner).addParentAddress(await parentContract.getAddress());
        });

        it('sets and unsets soulbound tokens', async function () {
            const tokenId = 1;
            await contractManager.connect(owner).setSoulbound(tokenId, true, await parentContract.getAddress());
            
            await expect(
                parentContract.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId)
            ).to.be.revertedWithCustomError(parentContract, 'RMRKCannotTransferSoulbound');

            await contractManager.connect(owner).setSoulbound(tokenId, false, await parentContract.getAddress());
            await parentContract.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId);
            expect(await parentContract.ownerOf(tokenId)).to.equal(addr2.address);
        });

        it('performs bulk soulbound operations', async function () {
            const startTokenId = 1;
            const endTokenId = 1;
            await contractManager.connect(owner).bulkSoulbound(startTokenId, endTokenId, true, await parentContract.getAddress());

            for (let tokenId = startTokenId; tokenId <= endTokenId; tokenId++) {
                await expect(
                    parentContract.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId)
                ).to.be.revertedWithCustomError(parentContract, 'RMRKCannotTransferSoulbound');
            }

            await contractManager.connect(owner).bulkSoulbound(startTokenId, endTokenId, false, await parentContract.getAddress());

            for (let tokenId = startTokenId; tokenId <= endTokenId; tokenId++) {
                await parentContract.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId);
                expect(await parentContract.ownerOf(tokenId)).to.equal(addr2.address);
            }
        });

        it('handles missions for soulbound tokens', async function () {
            const tokenId = 1;
            const missionId = ethers.encodeBytes32String("mission1");

            await contractManager.connect(owner).startMission(missionId, [await parentContract.getAddress()], [tokenId]);
            await expect(
                parentContract.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId)
            ).to.be.revertedWithCustomError(parentContract, 'RMRKCannotTransferSoulbound');

            await contractManager.connect(owner).endMission(missionId);
            await parentContract.connect(addr1).transferFrom(addr1.address, addr2.address, tokenId);
            expect(await parentContract.ownerOf(tokenId)).to.equal(addr2.address);
        });
    });
});
