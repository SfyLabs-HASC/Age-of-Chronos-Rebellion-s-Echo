/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import {
  TimeSquadAria,
  AriaBody,
  AriaHead,
  AriaLeftHand,
  AriaRightHand,
  TimeSquadLuna,
  LunaBody,
  LunaHead,
  LunaLeftHand,
  LunaRightHand,
  TimeSquadRyker,
  RykerBody,
  RykerHead,
  RykerLeftHand,
  RykerRightHand,
  TimeSquadThaddeus,
  ThaddeusBody,
  ThaddeusHead,
  ThaddeusLeftHand,
  ThaddeusRightHand,
  AgeOfChronosManager,
  RMRKCatalogImpl,
} from '../typechain-types';
import * as C from '../scripts/constants';

async function deployChildContracts() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  // Deploy Child Contracts
  const AriaBody = await ethers.getContractFactory('AriaBody');
  const AriaHead = await ethers.getContractFactory('AriaHead');
  const AriaLeftHand = await ethers.getContractFactory('AriaLeftHand');
  const AriaRightHand = await ethers.getContractFactory('AriaRightHand');

  const maxSupply = ethers.MaxUint256;
  const royaltyRecipient = (await ethers.getSigners())[0].address;
  const royaltyPercentageBps = 1000; // 10%

  const args1 = [
    C.SQUAD_ITEM_METADATA_ARIA_BODY,
    maxSupply,
    royaltyRecipient,
    royaltyPercentageBps,
  ] as const;
  const ariaBody: AriaBody = await AriaBody.deploy(...args1);
  await ariaBody.waitForDeployment();

  const args2 = [
    C.SQUAD_ITEM_METADATA_ARIA_HEAD,
    maxSupply,
    royaltyRecipient,
    royaltyPercentageBps,
  ] as const;
  const ariaHead: AriaHead = await AriaHead.deploy(...args2);
  await ariaHead.waitForDeployment();

  const args3 = [
    C.SQUAD_ITEM_METADATA_ARIA_LEFT_HAND,
    maxSupply,
    royaltyRecipient,
    royaltyPercentageBps,
  ] as const;
  const ariaLeftHand: AriaLeftHand = await AriaLeftHand.deploy(...args3);
  await ariaLeftHand.waitForDeployment();

  const args4 = [
    C.SQUAD_ITEM_METADATA_ARIA_RIGHT_HAND,
    maxSupply,
    royaltyRecipient,
    royaltyPercentageBps,
  ] as const;
  const ariaRightHand: AriaRightHand = await AriaRightHand.deploy(...args4);
  await ariaRightHand.waitForDeployment();

  return { owner, addr1, addr2, ariaBody, ariaHead, ariaLeftHand, ariaRightHand };
}

describe('Child Contracts Tests', function () {
  let owner: { address: any }, addr1: { address: any }, addr2: { address: any };
  let ariaBody: any, ariaHead: any, ariaLeftHand: any, ariaRightHand: any;
  const maxSupply = ethers.MaxUint256;

  beforeEach(async function () {
    ({ owner, addr1, addr2, ariaBody, ariaHead, ariaLeftHand, ariaRightHand } =
      await loadFixture(deployChildContracts));
  });

  describe('Deployment', function () {
    it('Should set the right owner for all child contracts', async function () {
      expect(await ariaBody.owner()).to.equal(owner.address);
      expect(await ariaHead.owner()).to.equal(owner.address);
      expect(await ariaLeftHand.owner()).to.equal(owner.address);
      expect(await ariaRightHand.owner()).to.equal(owner.address);
    });

    it('Should set the collection metadata correctly for all child contracts', async function () {
      expect(await ariaBody.collectionMetadata()).to.equal(C.SQUAD_ITEM_METADATA_ARIA_BODY);
      expect(await ariaHead.collectionMetadata()).to.equal(C.SQUAD_ITEM_METADATA_ARIA_HEAD);
      expect(await ariaLeftHand.collectionMetadata()).to.equal(
        C.SQUAD_ITEM_METADATA_ARIA_LEFT_HAND,
      );
      expect(await ariaRightHand.collectionMetadata()).to.equal(
        C.SQUAD_ITEM_METADATA_ARIA_RIGHT_HAND,
      );
    });

    it('Should set the max supply correctly for all child contracts', async function () {
      expect(await ariaBody.maxSupply()).to.equal(maxSupply);
      expect(await ariaHead.maxSupply()).to.equal(maxSupply);
      expect(await ariaLeftHand.maxSupply()).to.equal(maxSupply);
      expect(await ariaRightHand.maxSupply()).to.equal(maxSupply);
    });
  });

  describe('Minting', function () {
    beforeEach(async function () {
      await ariaBody.setExternalPermission(owner.address, true);
      await ariaHead.setExternalPermission(owner.address, true);
      await ariaLeftHand.setExternalPermission(owner.address, true);
      await ariaRightHand.setExternalPermission(owner.address, true);
      await ariaBody.setExternalPermission(addr1.address, true);
      await ariaHead.setExternalPermission(addr1.address, true);
      await ariaLeftHand.setExternalPermission(addr1.address, true);
      await ariaRightHand.setExternalPermission(addr1.address, true);
    });

    it('Should allow the owner to mint child NFTs with assets for AriaBody', async function () {
      await ariaBody.connect(addr1).mintWithAssets(addr1.address, [1, 2]);
      expect(await ariaBody.balanceOf(addr1.address)).to.equal(1);
      
    });

    it('Should allow the owner to mint child NFTs with assets for AriaHead', async function () {
      await ariaHead.connect(addr1).mintWithAssets(addr1.address, [1, 2]);
      expect(await ariaHead.balanceOf(addr1.address)).to.equal(1);
    });

    it('Should allow the owner to mint child NFTs with assets for AriaLeftHand', async function () {
      await ariaLeftHand.connect(addr1).mintWithAssets(addr1.address, [1, 2]);
      expect(await ariaLeftHand.balanceOf(addr1.address)).to.equal(1);
    });

    it('Should allow the owner to mint child NFTs with assets for AriaRightHand', async function () {
      await ariaRightHand.connect(addr1).mintWithAssets(addr1.address, [1, 2]);
      expect(await ariaRightHand.balanceOf(addr1.address)).to.equal(1);
    });

    it('Should revert if minting without permission for AriaBody', async function () {
      await ariaBody.setExternalPermission(owner.address, false);
      await expect(ariaBody.mintWithAssets(addr1.address, [1, 2])).to.be.revertedWith(
        'Permission denied',
      );
    });

    it('Should revert if minting without assets for AriaBody', async function () {
      await expect(ariaBody.mintWithAssets(addr1.address, [])).to.be.revertedWith(
        'No assets to mint',
      );
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
      await expect(ariaBody.tokenOfOwnerByIndex(addr1.address, 1)).to.be.revertedWith(
        'ERC721OutOfBoundsIndex',
      );
    });

    it('Should revert if querying token by invalid index for AriaBody', async function () {
      await expect(ariaBody.tokenByIndex(1)).to.be.revertedWith('ERC721OutOfBoundsIndex');
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
      await expect(ariaBody.connect(addr2).mintWithAssets(addr2.address, [1])).to.be.revertedWith(
        'Permission denied',
      );
    });
  });

  describe('Metadata and Auto Accept Collection', function () {
    it('Should return correct token URI for AriaBody', async function () {
      await ariaBody.mintWithAssets(addr1.address, [1]);
      const tokenId = await ariaBody.tokenOfOwnerByIndex(addr1.address, 0);
      expect(await ariaBody.tokenURI(tokenId)).to.equal(
        await ariaBody.getAssetMetadata(tokenId, 1),
      );
    });

    it('Should allow the owner to set auto accept collection for AriaBody', async function () {
      await ariaBody.setAutoAcceptCollection(addr1.address, true);
      // Assuming a getter is implemented for autoAcceptCollection
      expect(await ariaBody._autoAcceptCollection(addr1.address)).to.equal(true);
    });

    it('Should revert if a non-owner tries to set auto accept collection for AriaBody', async function () {
      await expect(
        ariaBody.connect(addr1).setAutoAcceptCollection(addr1.address, true),
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
