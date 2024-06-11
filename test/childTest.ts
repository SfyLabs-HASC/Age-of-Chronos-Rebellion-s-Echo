import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';

async function deployChildContracts() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy Child Contracts
    const AriaBody = await ethers.getContractFactory('AriaBody');
    const ariaBody = await AriaBody.deploy('metadata', 1000, owner.address, 500);
    await ariaBody.waitForDeployment();

    const AriaHead = await ethers.getContractFactory('AriaHead');
    const ariaHead = await AriaHead.deploy('metadata', 1000, owner.address, 500);
    await ariaHead.waitForDeployment();

    const AriaLeftHand = await ethers.getContractFactory('AriaLeftHand');
    const ariaLeftHand = await AriaLeftHand.deploy('metadata', 1000, owner.address, 500);
    await ariaLeftHand.waitForDeployment();

    const AriaRightHand = await ethers.getContractFactory('AriaRightHand');
    const ariaRightHand = await AriaRightHand.deploy('metadata', 1000, owner.address, 500);
    await ariaRightHand.waitForDeployment();

    return { owner, addr1, addr2, ariaBody, ariaHead, ariaLeftHand, ariaRightHand };
}

describe('Child Contracts Tests', function () {
    let owner: { address: any; }, addr1: { address: any; }, addr2: { address: any; };
    let ariaBody: any, ariaHead: any, ariaLeftHand: any, ariaRightHand: any;

    beforeEach(async function () {
        ({ owner, addr1, addr2, ariaBody, ariaHead, ariaLeftHand, ariaRightHand } = await loadFixture(deployChildContracts));
    });

    describe('Deployment', function () {
        it('Should set the right owner for all child contracts', async function () {
            expect(await ariaBody.owner()).to.equal(owner.address);
            expect(await ariaHead.owner()).to.equal(owner.address);
            expect(await ariaLeftHand.owner()).to.equal(owner.address);
            expect(await ariaRightHand.owner()).to.equal(owner.address);
        });

        it('Should set the collection metadata correctly for all child contracts', async function () {
            expect(await ariaBody.collectionMetadata()).to.equal('metadata');
            expect(await ariaHead.collectionMetadata()).to.equal('metadata');
            expect(await ariaLeftHand.collectionMetadata()).to.equal('metadata');
            expect(await ariaRightHand.collectionMetadata()).to.equal('metadata');
        });

        it('Should set the max supply correctly for all child contracts', async function () {
            expect(await ariaBody.maxSupply()).to.equal(1000);
            expect(await ariaHead.maxSupply()).to.equal(1000);
            expect(await ariaLeftHand.maxSupply()).to.equal(1000);
            expect(await ariaRightHand.maxSupply()).to.equal(1000);
        });
    });

    describe('Minting', function () {
        beforeEach(async function () {
            await ariaBody.setExternalPermission(owner.address, true);
            await ariaHead.setExternalPermission(owner.address, true);
            await ariaLeftHand.setExternalPermission(owner.address, true);
            await ariaRightHand.setExternalPermission(owner.address, true);
        });

        it('Should allow the owner to mint child NFTs with assets for AriaBody', async function () {
            await ariaBody.mintWithAssets(addr1.address, [1, 2, 3]);
            expect(await ariaBody.balanceOf(addr1.address)).to.equal(1);
        });

        it('Should allow the owner to mint child NFTs with assets for AriaHead', async function () {
            await ariaHead.mintWithAssets(addr1.address, [1, 2, 3]);
            expect(await ariaHead.balanceOf(addr1.address)).to.equal(1);
        });

        it('Should allow the owner to mint child NFTs with assets for AriaLeftHand', async function () {
            await ariaLeftHand.mintWithAssets(addr1.address, [1, 2, 3]);
            expect(await ariaLeftHand.balanceOf(addr1.address)).to.equal(1);
        });

        it('Should allow the owner to mint child NFTs with assets for AriaRightHand', async function () {
            await ariaRightHand.mintWithAssets(addr1.address, [1, 2, 3]);
            expect(await ariaRightHand.balanceOf(addr1.address)).to.equal(1);
        });

        it('Should revert if minting without permission for AriaBody', async function () {
            await ariaBody.setExternalPermission(owner.address, false);
            await expect(ariaBody.mintWithAssets(addr1.address, [1, 2, 3])).to.be.revertedWith("Permission denied");
        });

        it('Should revert if minting without assets for AriaBody', async function () {
            await expect(ariaBody.mintWithAssets(addr1.address, [])).to.be.revertedWith("No assets to mint");
        });
    });

    describe('Enumeration', function () {
        beforeEach(async function () {
            await ariaBody.setExternalPermission(owner.address, true);
            await ariaHead.setExternalPermission(owner.address, true);
            await ariaLeftHand.setExternalPermission(owner.address, true);
            await ariaRightHand.setExternalPermission(owner.address, true);

            await ariaBody.mintWithAssets(addr1.address, [1, 2, 3]);
            await ariaHead.mintWithAssets(addr1.address, [1, 2, 3]);
            await ariaLeftHand.mintWithAssets(addr1.address, [1, 2, 3]);
            await ariaRightHand.mintWithAssets(addr1.address, [1, 2, 3]);
        });

        it('Should enumerate tokens of owner correctly for AriaBody', async function () {
            expect(await ariaBody.tokenOfOwnerByIndex(addr1.address, 0)).to.equal(1);
        });

        it('Should enumerate all tokens correctly for AriaBody', async function () {
            expect(await ariaBody.tokenByIndex(0)).to.equal(1);
        });

        it('Should revert if querying token of owner by invalid index for AriaBody', async function () {
            await expect(ariaBody.tokenOfOwnerByIndex(addr1.address, 1)).to.be.revertedWith("ERC721OutOfBoundsIndex");
        });

        it('Should revert if querying token by invalid index for AriaBody', async function () {
            await expect(ariaBody.tokenByIndex(1)).to.be.revertedWith("ERC721OutOfBoundsIndex");
        });
    });

    describe('External Permission Management', function () {
        it('Should set and revoke external permission for AriaBody', async function () {
            await ariaBody.setExternalPermission(addr1.address, true);
            expect(await ariaBody.hasExternalPermission(addr1.address)).to.equal(true);

            await ariaBody.setExternalPermission(addr1.address, false);
            expect(await ariaBody.hasExternalPermission(addr1.address)).to.equal(false);
        });

        it('Should allow minting with external permission for AriaBody', async function () {
            await ariaBody.setExternalPermission(addr1.address, true);
            await ariaBody.connect(addr1).mintWithAssets(addr1.address, [1]);
            const balance = await ariaBody.balanceOf(addr1.address);
            expect(balance).to.equal(1);
        });

        it('Should deny minting without external permission for AriaBody', async function () {
            await expect(ariaBody.connect(addr2).mintWithAssets(addr2.address, [1])).to.be.revertedWith("Permission denied");
        });
    });

    describe('Metadata and Auto Accept Collection', function () {
        it('Should return correct token URI for AriaBody', async function () {
            await ariaBody.mintWithAssets(addr1.address, [1]);
            const tokenId = await ariaBody.tokenOfOwnerByIndex(addr1.address, 0);
            expect(await ariaBody.tokenURI(tokenId)).to.equal(await ariaBody.getAssetMetadata(tokenId, 1));
        });

        it('Should allow the owner to set auto accept collection for AriaBody', async function () {
            await ariaBody.setAutoAcceptCollection(addr1.address, true);
            // Assuming a getter is implemented for autoAcceptCollection
            expect(await ariaBody._autoAcceptCollection(addr1.address)).to.equal(true);
        });

        it('Should revert if a non-owner tries to set auto accept collection for AriaBody', async function () {
            await expect(ariaBody.connect(addr1).setAutoAcceptCollection(addr1.address, true)).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
});
