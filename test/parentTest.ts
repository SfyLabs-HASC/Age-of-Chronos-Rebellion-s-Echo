import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

async function deployParentContracts() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy Parent Contracts
    const TimeSquadAria = await ethers.getContractFactory('TimeSquadAria');
    const timeSquadAria = await TimeSquadAria.deploy('metadata', 1000, owner.address, 500, 'baseURI');
    await timeSquadAria.waitForDeployment();

    const TimeSquadLuna = await ethers.getContractFactory('TimeSquadLuna');
    const timeSquadLuna = await TimeSquadLuna.deploy('metadata', 1000, owner.address, 500, 'baseURI');
    await timeSquadLuna.waitForDeployment();

    const TimeSquadRyker = await ethers.getContractFactory('TimeSquadRyker');
    const timeSquadRyker = await TimeSquadRyker.deploy('metadata', 1000, owner.address, 500, 'baseURI');
    await timeSquadRyker.waitForDeployment();

    const TimeSquadThaddeus = await ethers.getContractFactory('TimeSquadThaddeus');
    const timeSquadThaddeus = await TimeSquadThaddeus.deploy('metadata', 1000, owner.address, 500, 'baseURI');
    await timeSquadThaddeus.waitForDeployment();

    return { owner, addr1, addr2, timeSquadAria, timeSquadLuna, timeSquadRyker, timeSquadThaddeus };
}

describe('TimeSquad Parent Contract Tests', function () {
    let owner: { address: any; }, addr1: { address: any; }, addr2: { address: any; };
    let timeSquadAria: any, timeSquadLuna: any, timeSquadRyker: any, timeSquadThaddeus: any;

    beforeEach(async function () {
        ({ owner, addr1, addr2, timeSquadAria, timeSquadLuna, timeSquadRyker, timeSquadThaddeus } = await loadFixture(deployParentContracts));
    });

    describe('Deployment', function () {
        it('Should set the right owner for all parent contracts', async function () {
            expect(await timeSquadAria.owner()).to.equal(owner.address);
            expect(await timeSquadLuna.owner()).to.equal(owner.address);
            expect(await timeSquadRyker.owner()).to.equal(owner.address);
            expect(await timeSquadThaddeus.owner()).to.equal(owner.address);
        });

        it('Should set the collection metadata correctly for all parent contracts', async function () {
            expect(await timeSquadAria.collectionMetadata()).to.equal('metadata');
            expect(await timeSquadLuna.collectionMetadata()).to.equal('metadata');
            expect(await timeSquadRyker.collectionMetadata()).to.equal('metadata');
            expect(await timeSquadThaddeus.collectionMetadata()).to.equal('metadata');
        });

        it('Should set the max supply correctly for all parent contracts', async function () {
            expect(await timeSquadAria.maxSupply()).to.equal(1000);
            expect(await timeSquadLuna.maxSupply()).to.equal(1000);
            expect(await timeSquadRyker.maxSupply()).to.equal(1000);
            expect(await timeSquadThaddeus.maxSupply()).to.equal(1000);
        });
    });

    describe('Minting', function () {
        it('Should allow the owner to mint NFTs for TimeSquadAria', async function () {
            await timeSquadAria.mint(addr1.address);
            expect(await timeSquadAria.balanceOf(addr1.address)).to.equal(1);
        });

        it('Should allow the owner to mint NFTs for TimeSquadLuna', async function () {
            await timeSquadLuna.mint(addr1.address);
            expect(await timeSquadLuna.balanceOf(addr1.address)).to.equal(1);
        });

        it('Should allow the owner to mint NFTs for TimeSquadRyker', async function () {
            await timeSquadRyker.mint(addr1.address);
            expect(await timeSquadRyker.balanceOf(addr1.address)).to.equal(1);
        });

        it('Should allow the owner to mint NFTs for TimeSquadThaddeus', async function () {
            await timeSquadThaddeus.mint(addr1.address);
            expect(await timeSquadThaddeus.balanceOf(addr1.address)).to.equal(1);
        });

        it('Should revert if an address tries to mint more than once for TimeSquadAria', async function () {
            await timeSquadAria.mint(addr1.address);
            await expect(timeSquadAria.mint(addr1.address)).to.be.revertedWith("Address has already minted an NFT");
        });

        it('Should revert if minting is paused for TimeSquadAria', async function () {
            await timeSquadAria.setPause(true);
            await expect(timeSquadAria.mint(addr1.address)).to.be.revertedWith("Minting is paused");
        });
    });

    describe('Soulbound Tokens', function () {
        it('Should set and unset a token as soulbound for TimeSquadAria', async function () {
            await timeSquadAria.mint(addr1.address);
            await timeSquadAria.setSoulbound(1, true);
            // Check the soulbound state here

            await timeSquadAria.setSoulbound(1, false);
            // Check the soulbound state here
        });

        it('Should revert if a non-owner tries to set soulbound state for TimeSquadAria', async function () {
            await timeSquadAria.mint(addr1.address);
            await expect(timeSquadAria.connect(addr1).setSoulbound(1, true)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe('Base URI and Extensions', function () {
        it('Should set and get base URI correctly for TimeSquadAria', async function () {
            await timeSquadAria.setBaseURI('newBaseURI');
            expect(await timeSquadAria.getBaseURI()).to.equal('newBaseURI');
        });

        it('Should set and get base extension correctly for TimeSquadAria', async function () {
            await timeSquadAria.setBaseExtension('.png');
            expect(await timeSquadAria.getBaseExtension()).to.equal('.png');
        });

        it('Should set and get main asset correctly for TimeSquadAria', async function () {
            await timeSquadAria.setMainAsset(2);
            expect(await timeSquadAria.getMainAsset()).to.equal(2);
        });
    });

    describe('Auto Accept Collection', function () {
        it('Should revert if a non-owner tries to set auto accept collection for TimeSquadAria', async function () {
            await expect(timeSquadAria.connect(addr1).setAutoAcceptCollection(addr1.address, true)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe('Enumerable Functions', function () {
        it('Should enumerate tokens of owner correctly for TimeSquadAria', async function () {
            await timeSquadAria.mint(addr1.address);
            await timeSquadAria.mint(addr1.address);
            expect(await timeSquadAria.tokenOfOwnerByIndex(addr1.address, 0)).to.equal(1);
            expect(await timeSquadAria.tokenOfOwnerByIndex(addr1.address, 1)).to.equal(2);
        });

        it('Should enumerate all tokens correctly for TimeSquadAria', async function () {
            await timeSquadAria.mint(addr1.address);
            await timeSquadAria.mint(addr1.address);
            expect(await timeSquadAria.tokenByIndex(0)).to.equal(1);
            expect(await timeSquadAria.tokenByIndex(1)).to.equal(2);
        });

        it('Should revert if querying token of owner by invalid index for TimeSquadAria', async function () {
            await timeSquadAria.mint(addr1.address);
            await expect(timeSquadAria.tokenOfOwnerByIndex(addr1.address, 1)).to.be.revertedWith("ERC721OutOfBoundsIndex");
        });

        it('Should revert if querying token by invalid index for TimeSquadAria', async function () {
            await timeSquadAria.mint(addr1.address);
            await expect(timeSquadAria.tokenByIndex(1)).to.be.revertedWith("ERC721OutOfBoundsIndex");
        });
    });
});
