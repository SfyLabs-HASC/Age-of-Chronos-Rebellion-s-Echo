/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { AriaBody, TimeSquadAria, RMRKCatalogImpl } from '../typechain-types';
import * as C from '../scripts/constants';
import '@nomiclabs/hardhat-ethers';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

async function deployChildContracts() {
  const [owner, addr1, addr2, addr3, addr4]: HardhatEthersSigner[] = await ethers.getSigners();

  // Deploy Parent Contract
  const TimeSquadAria = await ethers.getContractFactory('TimeSquadAria');
  const timeSquadAria = await TimeSquadAria.deploy(
    C.SQUAD_METADATA_ARIA,
    ethers.MaxUint256,
    owner.address,
    1000,
    C.MINT_ENUMERATE_ARIA,
  );
  await timeSquadAria.waitForDeployment();

  // Deploy Catalog
  const RMRKCatalog = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalog: RMRKCatalogImpl = await RMRKCatalog.deploy(
    C.SQUAD_CATALOG_ARIA_METADATA,
    C.CATALOG_TYPE,
  );
  await catalog.waitForDeployment();

  // Deploy Child Contract
  const AriaBody = await ethers.getContractFactory('AriaBody');
  const ariaBody = await AriaBody.deploy(
    C.SQUAD_ITEM_METADATA_ARIA_BODY,
    ethers.MaxUint256,
    owner.address,
    1000,
  );
  await ariaBody.waitForDeployment();

  const childBody = await ariaBody.getAddress();

  // Configuring Catalog
  await catalog.addPart({
    partId: C.FIXED_PART_PARENT_ID,
    part: {
      itemType: C.PART_TYPE_FIXED,
      z: C.Z_INDEX_BACKGROUND,
      equippable: [],
      metadataURI: C.FIXED_PART_ARIA_METADATA,
    },
  });

   //slot body
   const txBody = await catalog.addPart({
    partId: C.SQUAD_BODY_SLOT_PART_ID,
    part: {
        itemType: C.PART_TYPE_SLOT,
        z: C.Z_INDEX_BODY_ITEMS,
        equippable: [childBody],
        metadataURI: C.SQUAD_ITEM_BODY_SLOT_METADATA,
    },
});
await txBody.wait();

    //ADD ASSET
    //BODY
    //set primary asset
    const txChild01_body = await ariaBody.addAssetEntry(
        C.ARIA_ASSET_METADATA_BODY_URI_1,
    );
    await txChild01_body.wait();

    //set secondary asset
    const txChild02_body = await ariaBody.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        ethers.ZeroAddress,
        C.ARIA_ASSET_METADATA_BODY_URI_2,
        [],
    );
    await txChild02_body.wait();

    const txChild03_body = await ariaBody.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        await timeSquadAria.getAddress(),
        C.SQUAD_BODY_SLOT_PART_ID,
    );
    await txChild03_body.wait();

    const tx01 = await timeSquadAria.setAutoAcceptCollection(await ariaBody.getAddress(), true);
    await tx01.wait();

    const tx = await catalog.setEquippableAddresses(C.SQUAD_BODY_SLOT_PART_ID, [childBody]);
        await tx.wait();




  return { owner, addr1, addr2, addr3, addr4, timeSquadAria, catalog, ariaBody };
}

describe('AriaBody Child Contract Tests', function () {
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;
  let addr3: HardhatEthersSigner;
  let addr4: HardhatEthersSigner;
  let timeSquadAria: TimeSquadAria;
  let catalog: RMRKCatalogImpl;
  let ariaBody: AriaBody;

  beforeEach(async function () {
    ({ owner, addr1, addr2, addr3, addr4, timeSquadAria, catalog, ariaBody } = await loadFixture(deployChildContracts));
  });

  describe('Deployment', function () {
    it('Should deploy with correct owner and supply', async function () {
      expect(await ariaBody.owner()).to.equal(owner.address);
      expect(await ariaBody.maxSupply()).to.equal(ethers.MaxUint256);
    });
  });

  describe('Minting-and-Permissions', function () {
    it('Should allow the owner to mint with assets', async function () {
      await ariaBody.setExternalPermission(owner.address, true);
      await ariaBody.mintWithAssets(owner.address, [1, 2]);
      expect(await ariaBody.balanceOf(owner.address)).to.equal(1);
    });

    it('Should revert if a non-owner tries to mint without permission', async function () {
      await expect(ariaBody.connect(addr1).mintWithAssets(addr1.address, [1, 2])).to.be.revertedWith('Permission denied');
    });

    it('Should allow the owner to set and revoke external permission', async function () {
      await ariaBody.setExternalPermission(addr1.address, true);
      expect(await ariaBody.hasExternalPermission(addr1.address)).to.equal(true);
      await ariaBody.setExternalPermission(addr1.address, false);
      expect(await ariaBody.hasExternalPermission(addr1.address)).to.equal(false);
    });
  });

  describe('Adding Assets', function () {
    it('Should allow the owner to add asset entries', async function () {
      const tx = await ariaBody.addAssetEntry(C.ARIA_ASSET_METADATA_BODY_URI_1);
      await tx.wait();
      const assetId = await ariaBody.totalAssets();
      expect(assetId).to.equal(1);
    });

    it('Should allow the owner to add equippable asset entries', async function () {
      const tx = await ariaBody.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        ethers.ZeroAddress,
        C.ARIA_ASSET_METADATA_BODY_URI_2,
        [],
      );
      await tx.wait();
      const assetId = await ariaBody.totalAssets();
      expect(assetId).to.equal(2);
    });

    it('Should allow the owner to set valid parent for equippable group', async function () {
      const tx = await ariaBody.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        await timeSquadAria.getAddress(),
        C.SQUAD_BODY_SLOT_PART_ID,
      );
      await tx.wait();
    });
  });


  describe('Enumerable Functions', function () {
    it('Should enumerate tokens of owner correctly for AriaBody', async function () {
      await ariaBody.setExternalPermission(owner.address, true);
      await ariaBody.mintWithAssets(addr1.address, [1, 2]);
      await ariaBody.mintWithAssets(addr1.address, [3, 4]);
      expect(await ariaBody.tokenOfOwnerByIndex(addr1.address, 0)).to.equal(1);
      expect(await ariaBody.tokenOfOwnerByIndex(addr1.address, 1)).to.equal(2);
    });

    it('Should enumerate all tokens correctly for AriaBody', async function () {
      await ariaBody.setExternalPermission(owner.address, true);
      await ariaBody.mintWithAssets(addr1.address, [1, 2]);
      await ariaBody.mintWithAssets(addr1.address, [3, 4]);
      expect(await ariaBody.tokenByIndex(0)).to.equal(1);
      expect(await ariaBody.tokenByIndex(1)).to.equal(2);
    });

    it('Should revert if querying token of owner by invalid index for AriaBody', async function () {
      await ariaBody.setExternalPermission(owner.address, true);
      await ariaBody.mintWithAssets(addr1.address, [1, 2]);
      await expect(ariaBody.tokenOfOwnerByIndex(addr1.address, 1)).to.be.revertedWith('ERC721OutOfBoundsIndex');
    });

    it('Should revert if querying token by invalid index for AriaBody', async function () {
      await ariaBody.setExternalPermission(owner.address, true);
      await ariaBody.mintWithAssets(addr1.address, [1, 2]);
      await expect(ariaBody.tokenByIndex(1)).to.be.revertedWith('ERC721OutOfBoundsIndex');
    });
  });
});
