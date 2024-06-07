import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { AgeOfChronosManager, TimeSquadAria, AriaBody } from '../typechain-types';

async function fixtureAgeOfChronosManager(): Promise<{ manager: AgeOfChronosManager, parent: TimeSquadAria, child: AriaBody, owner: any }> {
    const [owner] = await ethers.getSigners();

    // Deploy AgeOfChronosManager contract
    const managerFactory = await ethers.getContractFactory('AgeOfChronosManager');
    const managerContract = await managerFactory.deploy();
    await managerContract.waitForDeployment();

    // Deploy TimeSquadAria contract as a parent example
    const collectionMeta = 'ipfs://QmNnn9M8rTbqPrk3rHTfN78sh4E1QLHaEKcSALrvhWfMkE';
    const maxSupply = ethers.MaxUint256;
    const royaltyRecipient = owner.address;
    const royaltyPercentageBps = 1000; // 10%
    const baseTokenURI = 'https://example.com/metadata/';

    const contractFactory = await ethers.getContractFactory('TimeSquadAria');
    const args: [string, typeof maxSupply, string, number, string] = [
        collectionMeta,
        maxSupply,
        royaltyRecipient,
        royaltyPercentageBps,
        baseTokenURI,
    ];
    const parentContract = await contractFactory.deploy(...args);
    await parentContract.waitForDeployment();

    // Deploy AriaBody contract as a child example
    const childFactory = await ethers.getContractFactory('AriaBody');
    const childArgs: [string, typeof maxSupply, string, number] = [
        collectionMeta,
        maxSupply,
        royaltyRecipient,
        royaltyPercentageBps,
    ];
    const childContract = await childFactory.deploy(...childArgs);
    await childContract.waitForDeployment();

    // Add an asset to the parent contract
    await parentContract.addAssetEntry("ipfs://QmAssetMetadata");

    // Add the parent contract to the manager
    await managerContract.addParentAddress(await parentContract.getAddress());

    return { manager: managerContract as AgeOfChronosManager, parent: parentContract as TimeSquadAria, child: childContract as AriaBody, owner };
}

describe('AgeOfChronosManager Tests', async () => {
    let manager: AgeOfChronosManager;
    let parent: TimeSquadAria;
    let child: AriaBody;
    let owner: any, addr1: any, addr2: any;

    beforeEach(async function () {
        ({ manager, parent, child, owner } = await loadFixture(fixtureAgeOfChronosManager));
        [owner, addr1, addr2] = await ethers.getSigners();

        // Grant permissions to mint multiple tokens as owner
        await parent.manageContributor(owner.address, true);
        await child.setExternalPermission(owner.address, true);

        // Mint a token to addr1
        await parent.connect(owner).setPause(false);
        await parent.connect(owner).mint(addr1.address);
    });

    describe('Initialization', async function () {
        it('should set the correct owner', async function () {
            expect(await manager.owner()).to.equal(owner.address);
        });
    });

    describe('Parent Address Management', async function () {
        it('should add a parent address', async function () {
            await manager.addParentAddress(await parent.getAddress());
            const addresses = await manager.getParentAddresses();
            expect(addresses).to.include(await parent.getAddress());
        });

        it('should remove a parent address', async function () {
            await manager.addParentAddress(await parent.getAddress());
            await manager.removeParentAddress(await parent.getAddress());
            const addresses = await manager.getParentAddresses();
            expect(addresses).to.not.include(await parent.getAddress());
        });
    });

    describe('Soulbound Functions', async function () {
        beforeEach(async function () {
            await parent.connect(owner).setPause(false);
            await parent.connect(owner).mint(owner.address);  // Mint another token to the owner to test bulk operations
        });

        it('should set and unset soulbound status', async function () {
            const tokenId = 1;
            await manager.setSoulbound(tokenId, true, await parent.getAddress());
            expect(await parent.isTransferable(tokenId, addr1.address, addr2.address)).to.be.false;

            await manager.setSoulbound(tokenId, false, await parent.getAddress());
            expect(await parent.isTransferable(tokenId, addr1.address, addr2.address)).to.be.true;
        });

        it('should bulk set soulbound status', async function () {
            const startTokenId = 1;
            const endTokenId = 2;
            await manager.bulkSoulbound(startTokenId, endTokenId, true, await parent.getAddress());
            expect(await parent.isTransferable(startTokenId, addr1.address, addr2.address)).to.be.false;
            expect(await parent.isTransferable(endTokenId, owner.address, addr2.address)).to.be.false;

            await manager.bulkSoulbound(startTokenId, endTokenId, false, await parent.getAddress());
            expect(await parent.isTransferable(startTokenId, addr1.address, addr2.address)).to.be.true;
            expect(await parent.isTransferable(endTokenId, owner.address, addr2.address)).to.be.true;
        });
    });

    describe('Mission Functions', async function () {
        beforeEach(async function () {
            await parent.connect(owner).setPause(false);
            await parent.connect(owner).manageContributor(await manager.getAddress(), true);
        });

        it('should start and end a mission', async function () {
            const tokenId = 1;
            const collectionAddresses = [await parent.getAddress(), await parent.getAddress(), await parent.getAddress(), await parent.getAddress()];
            const tokenIds = [tokenId, tokenId, tokenId, tokenId];

            const startTx = await manager.connect(owner).startMission(collectionAddresses, tokenIds);
            const startReceipt = await startTx.wait();
            console.log(`Gas used for startMission: ${startReceipt.gasUsed.toString()}`);

            expect(await parent.isTransferable(tokenId, addr1.address, addr2.address)).to.be.false;
            expect(await manager.isAddressInMission(await parent.getAddress())).to.be.true;

            const endTx = await manager.connect(owner).endMission(collectionAddresses, tokenIds);
            const endReceipt = await endTx.wait();
            console.log(`Gas used for endMission: ${endReceipt.gasUsed.toString()}`);

            expect(await parent.isTransferable(tokenId, addr1.address, addr2.address)).to.be.true;
            expect(await manager.isAddressInMission(await parent.getAddress())).to.be.false;
        });
    });

    describe('Ownership Transfer', async function () {
        it('should transfer ownership', async function () {
            await manager.transferOwnership(addr1.address);
            expect(await manager.owner()).to.equal(addr1.address);
        });
    });

    describe('External Permission Management', async function () {
        it('should set and revoke external permission', async function () {
            await child.setExternalPermission(addr1.address, true);
            //expect(await child.isExternalPermissionGranted(addr1.address)).to.be.true;

            await child.setExternalPermission(addr1.address, false);
            //expect(await child.isExternalPermissionGranted(addr1.address)).to.be.false;
        });

        it('should allow minting with external permission', async function () {
            await child.setExternalPermission(addr1.address, true);
            await child.connect(addr1).mintWithAssets(addr1.address, [1]);
            const balance = await child.balanceOf(addr1.address);
            expect(balance).to.equal(1);
        });

        it('should deny minting without external permission', async function () {
            await expect(child.connect(addr2).mintWithAssets(addr2.address, [1])).to.be.revertedWith("Permission denied");
        });
    });
});
