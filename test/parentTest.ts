/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { TimeSquadAria, RMRKCatalogImpl } from '../typechain-types';
import * as C from '../scripts/constants';
import '@nomiclabs/hardhat-ethers';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

async function deployParentContracts() {
  const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

  // Deploy Parent Contracts
  const TimeSquadAria = await ethers.getContractFactory('TimeSquadAria');
  const timeSquadAria = await TimeSquadAria.deploy(
    C.SQUAD_METADATA_ARIA,
    ethers.MaxUint256,
    owner.address,
    1000,
    C.MINT_ENUMERATE_ARIA,
  );
  await timeSquadAria.waitForDeployment();

  /*
  const TimeSquadLuna = await ethers.getContractFactory('TimeSquadLuna');
  const timeSquadLuna = await TimeSquadLuna.deploy(
    C.SQUAD_METADATA_LUNA,
    ethers.MaxUint256,
    owner.address,
    1000,
    C.MINT_ENUMERATE_LUNA,
  );
  await timeSquadLuna.waitForDeployment();

  const TimeSquadRyker = await ethers.getContractFactory('TimeSquadRyker');
  const timeSquadRyker = await TimeSquadRyker.deploy(
    C.SQUAD_METADATA_RYKER,
    ethers.MaxUint256,
    owner.address,
    1000,
    C.MINT_ENUMERATE_RYKER,
  );
  await timeSquadRyker.waitForDeployment();

  const TimeSquadThaddeus = await ethers.getContractFactory('TimeSquadThaddeus');
  const timeSquadThaddeus = await TimeSquadThaddeus.deploy(
    C.SQUAD_METADATA_THADDEUS,
    ethers.MaxUint256,
    owner.address,
    1000,
    C.MINT_ENUMERATE_THADDEUS,
  );
  await timeSquadThaddeus.waitForDeployment();
  */



  // Deploy and configure catalog
  const RMRKCatalog = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalog: RMRKCatalogImpl = await RMRKCatalog.deploy(
    C.SQUAD_CATALOG_ARIA_METADATA,
    C.CATALOG_TYPE,
  );
  await catalog.waitForDeployment();

  // Configuring catalog
  await catalog.addPart({
    partId: C.FIXED_PART_PARENT_ID,
    part: {
      itemType: C.PART_TYPE_FIXED,
      z: C.Z_INDEX_BACKGROUND,
      equippable: [],
      metadataURI: C.FIXED_PART_ARIA_METADATA,
    },
  });

  // Add assets to TimeSquadAria using deployed catalog
  const tx1 = await timeSquadAria.addEquippableAssetEntry(
    0n,
    await catalog.getAddress(),
    C.ARIA_ASSET_METADATA_URI,
    [
      C.FIXED_PART_PARENT_ID,
      C.SQUAD_BODY_SLOT_PART_ID,
      C.SQUAD_HEAD_SLOT_PART_ID,
      C.SQUAD_LEFT_HAND_SLOT_PART_ID,
      C.SQUAD_RIGHT_HAND_SLOT_PART_ID,
    ],
  );
  await tx1.wait();

  return { owner, addr1, addr2, addr3, addr4, timeSquadAria, catalog };
}

describe('TimeSquad Parent Contract Tests', function () {
  let owner: { address: HardhatEthersSigner };
  let addr1: { address: HardhatEthersSigner };
  let addr2: { address: HardhatEthersSigner };
  let addr3: { address: HardhatEthersSigner };
  let addr4: { address: HardhatEthersSigner };
  let timeSquadAria: TimeSquadAria;
  let catalog: RMRKCatalogImpl;

  beforeEach(async function () {
    ({ owner, addr1, addr2, addr3, addr4, timeSquadAria, catalog } = await loadFixture(deployParentContracts));
  });

  describe('Deployment', function () {
    it('owner and supply', async function () {
      expect(await timeSquadAria.owner()).to.equal(owner.address);
      expect(await timeSquadAria.maxSupply()).to.equal(ethers.MaxUint256);
    });
  });

  describe('Minting', function () {
    it('Should allow the owner to mint NFTs for TimeSquadAria', async function () {
      await timeSquadAria.connect(addr1).mint(addr1.address);
      expect(await timeSquadAria.balanceOf(addr1.address)).to.equal(1);
    });

    it('Should revert if an address tries to mint more than once for TimeSquadAria', async function () {
      await timeSquadAria.connect(addr1).mint(addr1.address);
      await expect(timeSquadAria.connect(addr1).mint(addr1.address)).to.be.revertedWith(
        'Address has already minted an NFT',
      );
    });

    it('Should revert che succede se non uso connect? TimeSquadAria', async function () {
      await timeSquadAria.mint(addr1.address);
      await expect(timeSquadAria.connect(addr1).mint(addr1.address)).to.be.revertedWith(
        'Address has already minted an NFT',
      );
    });

    it('Should revert if minting is paused for TimeSquadAria', async function () {
      await timeSquadAria.setPause(true);
      await expect(timeSquadAria.connect(addr1).mint(addr1.address)).to.be.revertedWith(
        'Minting is paused',
      );
    });

    it('Should allow an account to mint for multiple addresses', async function () {
      const addresses = [addr1.address, addr2.address, addr3.address, addr4.address];
      for (let i = 0; i < addresses.length; i++) {
        await timeSquadAria.connect(owner).mint(addresses[i]);
        expect(await timeSquadAria.balanceOf(addresses[i])).to.equal(1);
      }
    });
  });

  describe('Soulbound Tokens', function () {
    it('Should set and unset a token as soulbound for TimeSquadAria', async function () {
      await timeSquadAria.connect(addr1).mint(addr1.address);
      await timeSquadAria.setSoulbound(1, true);
      expect(await timeSquadAria.isTransferable(1n, addr1.address, addr2.address)).to.equal(false); // Ensure token is soulbound

      await timeSquadAria.setSoulbound(1, false);
      expect(await timeSquadAria.isTransferable(1n, addr1.address, addr2.address)).to.equal(true); // Ensure token is soulbound
    });

    it('Should revert if a non-owner tries to set soulbound state for TimeSquadAria', async function () {
      await expect(
        timeSquadAria.connect(addr1).setSoulbound(1, true),
      ).to.be.revertedWithCustomError(timeSquadAria, 'RMRKNotOwnerOrContributor()');
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
    it('getnewassetmetadata vedi se va', async function () {
      await timeSquadAria.setMainAsset(2);
      expect(await timeSquadAria.getMainAsset()).to.equal(2);
    });
  });

  describe('Auto Accept Collection', function () {
    it('Should revert if a non-owner tries to set auto accept collection for TimeSquadAria', async function () {
      await expect(
        timeSquadAria.connect(addr1).setAutoAcceptCollection(addr2.address, true),
      ).to.be.revertedWithCustomError(timeSquadAria, 'RMRKNotOwnerOrContributor()');
    });
  });

  describe('Minting Limits and Permissions', function () {
    it('Should not allow addr1 to mint two NFTs consecutively if not restricted', async function () {
      await timeSquadAria.connect(addr1).mint(addr1.address);
      await expect(timeSquadAria.connect(addr1).mint(addr1.address)).to.be.revertedWith('Address has already minted an NFT');
    });

    it('Should allow the owner to mint two NFTs consecutively', async function () {
      await timeSquadAria.connect(owner).mint(owner.address);
      await timeSquadAria.connect(owner).manageContributor(owner.address, true);
      await expect(timeSquadAria.connect(owner).mint(owner.address)).to.emit(timeSquadAria, 'Transfer');
      expect(await timeSquadAria.balanceOf(owner.address)).to.equal(2);
    });

    it('Should prevent transferring a soulbound token', async function () {
      await timeSquadAria.connect(owner).mint(addr1.address);
      await timeSquadAria.connect(owner).setSoulbound(1, true);

      try {
        // Tentativo di trasferimento che dovrebbe fallire
        await timeSquadAria.connect(addr1).transferFrom(addr1.address, addr2.address, 1);
        expect.fail("The transaction should have failed");
      } catch (error) {
        const errorMessage = (error as any).message;
        //console.log(errorMessage);
        expect(errorMessage).to.include('RMRKCannotTransferSoulbound()');
      }
    });
  });

  describe('Soulbound Token Enforcement', function () {
    it('Should allow transferring a token if it is not soulbound', async function () {
      await timeSquadAria.connect(owner).mint(addr1.address);
      await timeSquadAria.connect(owner).setSoulbound(1, false);
      await expect(timeSquadAria.connect(addr1).transferFrom(addr1.address, addr2.address, 1)).to.emit(timeSquadAria, 'Transfer');
      expect(await timeSquadAria.ownerOf(1)).to.equal(addr2.address);
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
      await expect(timeSquadAria.tokenOfOwnerByIndex(addr1.address, 1)).to.be.revertedWith(
        'ERC721OutOfBoundsIndex',
      );
    });

    it('Should revert if querying token by invalid index for TimeSquadAria', async function () {
      await timeSquadAria.mint(addr1.address);
      await expect(timeSquadAria.tokenByIndex(1)).to.be.revertedWith('ERC721OutOfBoundsIndex');
    });
  });

});
