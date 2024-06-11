import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

async function fixtureTimeSquadAria() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy TimeSquadAria contract
    const collectionMeta = 'ipfs://QmNnn9M8rTbqPrk3rHTfN78sh4E1QLHaEKcSALrvhWfMkE';
    const maxSupply = ethers.MaxUint256;
    const royaltyRecipient = owner.address;
    const royaltyPercentageBps = 1000; // 10%
    const baseTokenURI = 'https://example.com/token/';

    const TimeSquadAria = await ethers.getContractFactory('TimeSquadAria');
    const timeSquadAria = await TimeSquadAria.deploy(collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps, baseTokenURI);
    await timeSquadAria.waitForDeployment();

    return { timeSquadAria, owner, addr1, addr2 };
}

describe('TimeSquadAria Tests', function () {
    let timeSquadAria: any
    let owner: { address: any; }, addr1: { address: any; }, addr2: { address: any; };

    beforeEach(async function () {
        ({ timeSquadAria, owner, addr1, addr2 } = await loadFixture(fixtureTimeSquadAria));
    });

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await timeSquadAria.owner()).to.equal(owner.address);
        });

        it('Should set the collection metadata correctly', async function () {
            expect(await timeSquadAria.collectionMetadata()).to.equal('ipfs://QmNnn9M8rTbqPrk3rHTfN78sh4E1QLHaEKcSALrvhWfMkE');
        });

        it('Should set the max supply correctly', async function () {
            expect(await timeSquadAria.maxSupply()).to.equal(ethers.MaxUint256);
        });

        it('Should set the base URI correctly', async function () {
            expect(await timeSquadAria.getBaseURI()).to.equal('https://example.com/token/');
        });
    });

    describe('Permissions', function () {
        it('Should allow the owner to set external permissions', async function () {
            await timeSquadAria.setExternalPermission(addr1.address, true);
            expect(await timeSquadAria.hasExternalPermission(addr1.address)).to.equal(true);
        });

        it('Should revert if a non-owner tries to set external permissions', async function () {
            await expect(
                timeSquadAria.connect(addr1).setExternalPermission(addr1.address, true)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe('Minting', function () {
        beforeEach(async function () {
            await timeSquadAria.setExternalPermission(owner.address, true);
        });

        it('Should mint a new token with assets', async function () {
            const assetIds = [1, 2, 3];
            await timeSquadAria.mint(addr1.address);

            expect(await timeSquadAria.balanceOf(addr1.address)).to.equal(1);
            const tokenId = await timeSquadAria.tokenOfOwnerByIndex(addr1.address, 0);
            expect(await timeSquadAria.tokenURI(tokenId)).to.equal(
                await timeSquadAria.getAssetMetadata(tokenId, 1)
            );
        });

        it('Should revert if minting without permission', async function () {
            await timeSquadAria.setExternalPermission(owner.address, false);
            await expect(
                timeSquadAria.mint(addr1.address)
            ).to.be.revertedWith("Permission denied");
        });

        it('Should revert if minting without assets', async function () {
            await expect(
                timeSquadAria.mint(addr1.address)
            ).to.be.revertedWith("No assets to mint");
        });
    });

    describe('Enumeration', function () {
        beforeEach(async function () {
            await timeSquadAria.setExternalPermission(owner.address, true);
            await timeSquadAria.mint(addr1.address);
            await timeSquadAria.mint(addr1.address);
        });

        it('Should enumerate tokens of owner correctly', async function () {
            expect(await timeSquadAria.tokenOfOwnerByIndex(addr1.address, 0)).to.equal(1);
            expect(await timeSquadAria.tokenOfOwnerByIndex(addr1.address, 1)).to.equal(2);
        });

        it('Should revert if querying token of owner by invalid index', async function () {
            await expect(
                timeSquadAria.tokenOfOwnerByIndex(addr1.address, 2)
            ).to.be.revertedWith("ERC721OutOfBoundsIndex");
        });

        it('Should enumerate all tokens correctly', async function () {
            expect(await timeSquadAria.tokenByIndex(0)).to.equal(1);
            expect(await timeSquadAria.tokenByIndex(1)).to.equal(2);
        });

        it('Should revert if querying token by invalid index', async function () {
            await expect(timeSquadAria.tokenByIndex(2)).to.be.revertedWith(
                "ERC721OutOfBoundsIndex"
            );
        });
    });

    describe('Auto Accept Collection', function () {
        it('Should allow the owner to set auto accept collection', async function () {
            await timeSquadAria.setAutoAcceptCollection(addr1.address, true);
            expect(await timeSquadAria.isAutoAcceptCollection(addr1.address)).to.equal(true);
        });

        it('Should revert if a non-owner tries to set auto accept collection', async function () {
            await expect(
                timeSquadAria.connect(addr1).setAutoAcceptCollection(addr1.address, true)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe('External Permission Management', function () {
        it('Should set and revoke external permission', async function () {
            await timeSquadAria.setExternalPermission(addr1.address, true);
            expect(await timeSquadAria.hasExternalPermission(addr1.address)).to.equal(true);

            await timeSquadAria.setExternalPermission(addr1.address, false);
            expect(await timeSquadAria.hasExternalPermission(addr1.address)).to.equal(false);
        });

        it('Should allow minting with external permission', async function () {
            await timeSquadAria.setExternalPermission(addr1.address, true);
            await timeSquadAria.connect(addr1).mintWithAssets(addr1.address, [1]);
            const balance = await timeSquadAria.balanceOf(addr1.address);
            expect(balance).to.equal(1);
        });

        it('Should deny minting without external permission', async function () {
            await expect(timeSquadAria.connect(addr2).mintWithAssets(addr2.address, [1])).to.be.revertedWith("Permission denied");
        });
    });
});
