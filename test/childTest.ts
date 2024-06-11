import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

async function fixtureAriaBody() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy AriaBody contract
    const collectionMeta = 'ipfs://QmNnn9M8rTbqPrk3rHTfN78sh4E1QLHaEKcSALrvhWfMkE';
    const maxSupply = ethers.MaxUint256;
    const royaltyRecipient = owner.address;
    const royaltyPercentageBps = 1000; // 10%

    const AriaBody = await ethers.getContractFactory('AriaBody');
    const ariaBody = await AriaBody.deploy(collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps);
    await ariaBody.waitForDeployment();

    return { ariaBody, owner, addr1, addr2 };
}

describe('AriaBody Tests', function () {
    let ariaBody: any
    let owner: { address: any; }, addr1: { address: any; }, addr2: { address: any; };

    beforeEach(async function () {
        ({ ariaBody, owner, addr1, addr2 } = await loadFixture(fixtureAriaBody));
    });

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await ariaBody.owner()).to.equal(owner.address);
        });

        it('Should set the collection metadata correctly', async function () {
            expect(await ariaBody.collectionMetadata()).to.equal('ipfs://QmNnn9M8rTbqPrk3rHTfN78sh4E1QLHaEKcSALrvhWfMkE');
        });

        it('Should set the max supply correctly', async function () {
            expect(await ariaBody.maxSupply()).to.equal(ethers.MaxUint256);
        });
    });

    describe('Permissions', function () {
        it('Should allow the owner to set external permissions', async function () {
            await ariaBody.setExternalPermission(addr1.address, true);
            expect(await ariaBody.hasExternalPermission(addr1.address)).to.equal(true);
        });

        it('Should revert if a non-owner tries to set external permissions', async function () {
            await expect(
                ariaBody.connect(addr1).setExternalPermission(addr1.address, true)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe('Minting', function () {
        beforeEach(async function () {
            await ariaBody.setExternalPermission(owner.address, true);
        });

        it('Should mint a new token with assets', async function () {
            const assetIds = [1, 2, 3];
            await ariaBody.mintWithAssets(addr1.address, assetIds);

            expect(await ariaBody.balanceOf(addr1.address)).to.equal(1);
            const tokenId = await ariaBody.tokenOfOwnerByIndex(addr1.address, 0);
            expect(await ariaBody.tokenURI(tokenId)).to.equal(
                await ariaBody.getAssetMetadata(tokenId, 1)
            );
        });

        it('Should revert if minting without permission', async function () {
            await ariaBody.setExternalPermission(owner.address, false);
            const assetIds = [1, 2, 3];
            await expect(
                ariaBody.mintWithAssets(addr1.address, assetIds)
            ).to.be.revertedWith("Permission denied");
        });

        it('Should revert if minting without assets', async function () {
            await expect(
                ariaBody.mintWithAssets(addr1.address, [])
            ).to.be.revertedWith("No assets to mint");
        });
    });

    describe('Enumeration', function () {
        beforeEach(async function () {
            await ariaBody.setExternalPermission(owner.address, true);
            const assetIds = [1, 2, 3];
            await ariaBody.mintWithAssets(addr1.address, assetIds);
            await ariaBody.mintWithAssets(addr1.address, assetIds);
        });

        it('Should enumerate tokens of owner correctly', async function () {
            expect(await ariaBody.tokenOfOwnerByIndex(addr1.address, 0)).to.equal(1);
            expect(await ariaBody.tokenOfOwnerByIndex(addr1.address, 1)).to.equal(2);
        });

        it('Should revert if querying token of owner by invalid index', async function () {
            await expect(
                ariaBody.tokenOfOwnerByIndex(addr1.address, 2)
            ).to.be.revertedWith("ERC721OutOfBoundsIndex");
        });

        it('Should enumerate all tokens correctly', async function () {
            expect(await ariaBody.tokenByIndex(0)).to.equal(1);
            expect(await ariaBody.tokenByIndex(1)).to.equal(2);
        });

        it('Should revert if querying token by invalid index', async function () {
            await expect(ariaBody.tokenByIndex(2)).to.be.revertedWith(
                "ERC721OutOfBoundsIndex"
            );
        });
    });

    describe('Auto Accept Collection', function () {
        it('Should allow the owner to set auto accept collection', async function () {
            await ariaBody.setAutoAcceptCollection(addr1.address, true);
            // Assuming a getter is implemented for autoAcceptCollection
            expect(await ariaBody._autoAcceptCollection(addr1.address)).to.equal(true);
        });

        it('Should revert if a non-owner tries to set auto accept collection', async function () {
            await expect(
                ariaBody.connect(addr1).setAutoAcceptCollection(addr1.address, true)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe('External Permission Management', function () {
        it('Should set and revoke external permission', async function () {
            await ariaBody.setExternalPermission(addr1.address, true);
            expect(await ariaBody.hasExternalPermission(addr1.address)).to.equal(true);

            await ariaBody.setExternalPermission(addr1.address, false);
            expect(await ariaBody.hasExternalPermission(addr1.address)).to.equal(false);
        });

        it('Should allow minting with external permission', async function () {
            await ariaBody.setExternalPermission(addr1.address, true);
            await ariaBody.connect(addr1).mintWithAssets(addr1.address, [1]);
            const balance = await ariaBody.balanceOf(addr1.address);
            expect(balance).to.equal(1);
        });

        it('Should deny minting without external permission', async function () {
            await expect(ariaBody.connect(addr2).mintWithAssets(addr2.address, [1])).to.be.revertedWith("Permission denied");
        });
    });
});
