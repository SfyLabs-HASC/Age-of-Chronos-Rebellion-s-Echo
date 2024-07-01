import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import {
    TimeSquadAria,
    TimeSquadLuna,
    TimeSquadRyker,
    TimeSquadThaddeus,
    AriaBody,
    AriaHead,
    AriaLeftHand,
    AriaRightHand,
    LunaBody,
    LunaHead,
    LunaLeftHand,
    LunaRightHand,
    RykerBody,
    RykerHead,
    RykerLeftHand,
    RykerRightHand,
    ThaddeusBody,
    ThaddeusHead,
    ThaddeusLeftHand,
    ThaddeusRightHand,
    AgeOfChronosManager,
    RMRKCatalogImpl
  } from '../typechain-types';
import * as C from '../scripts/constants';
import '@nomiclabs/hardhat-ethers';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

async function deployContracts() {
  const [owner, addr1]: HardhatEthersSigner[] = await ethers.getSigners();

  // Deploy Parent Contracts
  const TimeSquadRyker = await ethers.getContractFactory('TimeSquadRyker');
  const timeSquadRyker = await TimeSquadRyker.deploy(
    C.SQUAD_METADATA_RYKER,
    ethers.MaxUint256,
    owner.address,
    1000,
    C.MINT_ENUMERATE_RYKER,
  );
  await timeSquadRyker.waitForDeployment();

  const TimeSquadLuna = await ethers.getContractFactory('TimeSquadLuna');
  const timeSquadLuna = await TimeSquadLuna.deploy(
    C.SQUAD_METADATA_LUNA,
    ethers.MaxUint256,
    owner.address,
    1000,
    C.MINT_ENUMERATE_LUNA,
  );
  await timeSquadLuna.waitForDeployment();

  const TimeSquadAria = await ethers.getContractFactory('TimeSquadAria');
  const timeSquadAria = await TimeSquadAria.deploy(
    C.SQUAD_METADATA_ARIA,
    ethers.MaxUint256,
    owner.address,
    1000,
    C.MINT_ENUMERATE_ARIA,
  );
  await timeSquadAria.waitForDeployment();

  const TimeSquadThaddeus = await ethers.getContractFactory('TimeSquadThaddeus');
  const timeSquadThaddeus = await TimeSquadThaddeus.deploy(
    C.SQUAD_METADATA_THADDEUS,
    ethers.MaxUint256,
    owner.address,
    1000,
    C.MINT_ENUMERATE_THADDEUS,
  );
  await timeSquadThaddeus.waitForDeployment();

  // Deploy Catalogs
  const RMRKCatalogRyker = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalogRyker: RMRKCatalogImpl = await RMRKCatalogRyker.deploy(
    C.SQUAD_CATALOG_RYKER_METADATA,
    C.CATALOG_TYPE,
  );
  await catalogRyker.waitForDeployment();

  const RMRKCatalogAria = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalogAria: RMRKCatalogImpl = await RMRKCatalogAria.deploy(
    C.SQUAD_CATALOG_ARIA_METADATA,
    C.CATALOG_TYPE,
  );
  await catalogAria.waitForDeployment();

  const RMRKCatalogLuna = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalogLuna: RMRKCatalogImpl = await RMRKCatalogLuna.deploy(
    C.SQUAD_CATALOG_LUNA_METADATA,
    C.CATALOG_TYPE,
  );
  await catalogLuna.waitForDeployment();

  const RMRKCatalogThaddeus = await ethers.getContractFactory('RMRKCatalogImpl');
  const catalogThaddeus: RMRKCatalogImpl = await RMRKCatalogThaddeus.deploy(
    C.SQUAD_CATALOG_THADDEUS_METADATA,
    C.CATALOG_TYPE,
  );
  await catalogThaddeus.waitForDeployment();

  // Configuring Catalogs
  await catalogAria.addPart({
    partId: C.FIXED_PART_PARENT_ID,
    part: {
      itemType: C.PART_TYPE_FIXED,
      z: C.Z_INDEX_BACKGROUND,
      equippable: [],
      metadataURI: C.FIXED_PART_ARIA_METADATA,
    },
  });

  await catalogRyker.addPart({
    partId: C.FIXED_PART_PARENT_ID,
    part: {
      itemType: C.PART_TYPE_FIXED,
      z: C.Z_INDEX_BACKGROUND,
      equippable: [],
      metadataURI: C.FIXED_PART_RYKER_METADATA,
    },
  });

  await catalogLuna.addPart({
    partId: C.FIXED_PART_PARENT_ID,
    part: {
      itemType: C.PART_TYPE_FIXED,
      z: C.Z_INDEX_BACKGROUND,
      equippable: [],
      metadataURI: C.FIXED_PART_LUNA_METADATA,
    },
  });

  await catalogThaddeus.addPart({
    partId: C.FIXED_PART_PARENT_ID,
    part: {
      itemType: C.PART_TYPE_FIXED,
      z: C.Z_INDEX_BACKGROUND,
      equippable: [],
      metadataURI: C.FIXED_PART_THADDEUS_METADATA,
    },
  });

  // Add assets to TimeSquad parents using deployed catalogs
  await timeSquadAria.addEquippableAssetEntry(
    0n,
    await catalogAria.getAddress(),
    C.ARIA_ASSET_METADATA_URI,
    [C.FIXED_PART_PARENT_ID,
        C.SQUAD_BODY_SLOT_PART_ID,
        C.SQUAD_HEAD_SLOT_PART_ID,
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID
        ],
  );

  await timeSquadRyker.addEquippableAssetEntry(
    0n,
    await catalogRyker.getAddress(),
    C.RYKER_ASSET_METADATA_URI,
    [C.FIXED_PART_PARENT_ID,
        C.SQUAD_BODY_SLOT_PART_ID,
        C.SQUAD_HEAD_SLOT_PART_ID,
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID
        ],
  );

  await timeSquadLuna.addEquippableAssetEntry(
    0n,
    await catalogLuna.getAddress(),
    C.LUNA_ASSET_METADATA_URI,
    [C.FIXED_PART_PARENT_ID,
        C.SQUAD_BODY_SLOT_PART_ID,
        C.SQUAD_HEAD_SLOT_PART_ID,
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID
        ],
  );

  await timeSquadThaddeus.addEquippableAssetEntry(
    0n,
    await catalogThaddeus.getAddress(),
    C.THADDEUS_ASSET_METADATA_URI,
    [C.FIXED_PART_PARENT_ID,
        C.SQUAD_BODY_SLOT_PART_ID,
        C.SQUAD_HEAD_SLOT_PART_ID,
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID
        ],
  );

  // Deploy Child Contracts
  const AriaBody = await ethers.getContractFactory('AriaBody');
  const ariaBody = await AriaBody.deploy(C.SQUAD_ITEM_METADATA_ARIA_BODY, ethers.MaxUint256, owner.address, 1000);
  await ariaBody.waitForDeployment();

  const AriaHead = await ethers.getContractFactory('AriaHead');
  const ariaHead = await AriaHead.deploy(C.SQUAD_ITEM_METADATA_ARIA_HEAD, ethers.MaxUint256, owner.address, 1000);
  await ariaHead.waitForDeployment();

  const AriaLeftHand = await ethers.getContractFactory('AriaLeftHand');
  const ariaLeftHand = await AriaLeftHand.deploy(C.SQUAD_ITEM_METADATA_ARIA_LEFT_HAND, ethers.MaxUint256, owner.address, 1000);
  await ariaLeftHand.waitForDeployment();

  const AriaRightHand = await ethers.getContractFactory('AriaRightHand');
  const ariaRightHand = await AriaRightHand.deploy(C.SQUAD_ITEM_METADATA_ARIA_RIGHT_HAND, ethers.MaxUint256, owner.address, 1000);
  await ariaRightHand.waitForDeployment();

  const LunaBody = await ethers.getContractFactory('LunaBody');
  const lunaBody = await LunaBody.deploy(C.SQUAD_ITEM_METADATA_LUNA_BODY, ethers.MaxUint256, owner.address, 1000);
  await lunaBody.waitForDeployment();

  const LunaHead = await ethers.getContractFactory('LunaHead');
  const lunaHead = await LunaHead.deploy(C.SQUAD_ITEM_METADATA_LUNA_HEAD, ethers.MaxUint256, owner.address, 1000);
  await lunaHead.waitForDeployment();

  const LunaLeftHand = await ethers.getContractFactory('LunaLeftHand');
  const lunaLeftHand = await LunaLeftHand.deploy(C.SQUAD_ITEM_METADATA_LUNA_LEFT_HAND, ethers.MaxUint256, owner.address, 1000);
  await lunaLeftHand.waitForDeployment();

  const LunaRightHand = await ethers.getContractFactory('LunaRightHand');
  const lunaRightHand = await LunaRightHand.deploy(C.SQUAD_ITEM_METADATA_LUNA_RIGHT_HAND, ethers.MaxUint256, owner.address, 1000);
  await lunaRightHand.waitForDeployment();

  const RykerBody = await ethers.getContractFactory('RykerBody');
  const rykerBody = await RykerBody.deploy(C.SQUAD_ITEM_METADATA_RYKER_BODY, ethers.MaxUint256, owner.address, 1000);
  await rykerBody.waitForDeployment();

  const RykerHead = await ethers.getContractFactory('RykerHead');
  const rykerHead = await RykerHead.deploy(C.SQUAD_ITEM_METADATA_RYKER_HEAD, ethers.MaxUint256, owner.address, 1000);
  await rykerHead.waitForDeployment();

  const RykerLeftHand = await ethers.getContractFactory('RykerLeftHand');
  const rykerLeftHand = await RykerLeftHand.deploy(C.SQUAD_ITEM_METADATA_RYKER_LEFT_HAND, ethers.MaxUint256, owner.address, 1000);
  await rykerLeftHand.waitForDeployment();

  const RykerRightHand = await ethers.getContractFactory('RykerRightHand');
  const rykerRightHand = await RykerRightHand.deploy(C.SQUAD_ITEM_METADATA_RYKER_RIGHT_HAND, ethers.MaxUint256, owner.address, 1000);
  await rykerRightHand.waitForDeployment();

  const ThaddeusBody = await ethers.getContractFactory('ThaddeusBody');
  const thaddeusBody = await ThaddeusBody.deploy(C.SQUAD_ITEM_METADATA_THADDEUS_BODY, ethers.MaxUint256, owner.address, 1000);
  await thaddeusBody.waitForDeployment();

  const ThaddeusHead = await ethers.getContractFactory('ThaddeusHead');
  const thaddeusHead = await ThaddeusHead.deploy(C.SQUAD_ITEM_METADATA_THADDEUS_HEAD, ethers.MaxUint256, owner.address, 1000);
  await thaddeusHead.waitForDeployment();

  const ThaddeusLeftHand = await ethers.getContractFactory('ThaddeusLeftHand');
  const thaddeusLeftHand = await ThaddeusLeftHand.deploy(C.SQUAD_ITEM_METADATA_THADDEUS_LEFT_HAND, ethers.MaxUint256, owner.address, 1000);
  await thaddeusLeftHand.waitForDeployment();

  const ThaddeusRightHand = await ethers.getContractFactory('ThaddeusRightHand');
  const thaddeusRightHand = await ThaddeusRightHand.deploy(C.SQUAD_ITEM_METADATA_THADDEUS_RIGHT_HAND, ethers.MaxUint256, owner.address, 1000);
  await thaddeusRightHand.waitForDeployment();

  // Deploy AgeOfChronosManager
  const AgeOfChronosManager = await ethers.getContractFactory('AgeOfChronosManager');
  const manager = await AgeOfChronosManager.deploy();
  await manager.waitForDeployment();

  // Setting up assets for Aria children
  await setupChildAssets(ariaBody, timeSquadAria, catalogAria, await timeSquadAria.getAddress(), C.ARIA_ASSET_METADATA_BODY_URI_1, C.ARIA_ASSET_METADATA_BODY_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY, C.SQUAD_BODY_SLOT_PART_ID);
  await setupChildAssets(ariaHead, timeSquadAria, catalogAria, await timeSquadAria.getAddress(), C.ARIA_ASSET_METADATA_HEAD_URI_1, C.ARIA_ASSET_METADATA_HEAD_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD, C.SQUAD_HEAD_SLOT_PART_ID);
  await setupChildAssets(ariaLeftHand, timeSquadAria, catalogAria, await timeSquadAria.getAddress(), C.ARIA_ASSET_METADATA_LEFT_HAND_URI_1, C.ARIA_ASSET_METADATA_LEFT_HAND_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND, C.SQUAD_LEFT_HAND_SLOT_PART_ID);
  await setupChildAssets(ariaRightHand, timeSquadAria, catalogAria, await timeSquadAria.getAddress(), C.ARIA_ASSET_METADATA_RIGHT_HAND_URI_1, C.ARIA_ASSET_METADATA_RIGHT_HAND_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND, C.SQUAD_RIGHT_HAND_SLOT_PART_ID);

  // Setting up assets for Luna children
  await setupChildAssets(lunaBody, timeSquadLuna, catalogLuna, await timeSquadLuna.getAddress(), C.LUNA_ASSET_METADATA_BODY_URI_1, C.LUNA_ASSET_METADATA_BODY_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY, C.SQUAD_BODY_SLOT_PART_ID);
  await setupChildAssets(lunaHead, timeSquadLuna, catalogLuna, await timeSquadLuna.getAddress(), C.LUNA_ASSET_METADATA_HEAD_URI_1, C.LUNA_ASSET_METADATA_HEAD_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD, C.SQUAD_HEAD_SLOT_PART_ID);
  await setupChildAssets(lunaLeftHand, timeSquadLuna, catalogLuna, await timeSquadLuna.getAddress(), C.LUNA_ASSET_METADATA_LEFT_HAND_URI_1, C.LUNA_ASSET_METADATA_LEFT_HAND_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND, C.SQUAD_LEFT_HAND_SLOT_PART_ID);
  await setupChildAssets(lunaRightHand, timeSquadLuna, catalogLuna, await timeSquadLuna.getAddress(), C.LUNA_ASSET_METADATA_RIGHT_HAND_URI_1, C.LUNA_ASSET_METADATA_RIGHT_HAND_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND, C.SQUAD_RIGHT_HAND_SLOT_PART_ID);

  // Setting up assets for Ryker children
  await setupChildAssets(rykerBody, timeSquadRyker, catalogRyker, await timeSquadRyker.getAddress(), C.RYKER_ASSET_METADATA_BODY_URI_1, C.RYKER_ASSET_METADATA_BODY_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY, C.SQUAD_BODY_SLOT_PART_ID);
  await setupChildAssets(rykerHead, timeSquadRyker, catalogRyker, await timeSquadRyker.getAddress(), C.RYKER_ASSET_METADATA_HEAD_URI_1, C.RYKER_ASSET_METADATA_HEAD_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD, C.SQUAD_HEAD_SLOT_PART_ID);
  await setupChildAssets(rykerLeftHand, timeSquadRyker, catalogRyker, await timeSquadRyker.getAddress(), C.RYKER_ASSET_METADATA_LEFT_HAND_URI_1, C.RYKER_ASSET_METADATA_LEFT_HAND_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND, C.SQUAD_LEFT_HAND_SLOT_PART_ID);
  await setupChildAssets(rykerRightHand, timeSquadRyker, catalogRyker, await timeSquadRyker.getAddress(), C.RYKER_ASSET_METADATA_RIGHT_HAND_URI_1, C.RYKER_ASSET_METADATA_RIGHT_HAND_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND, C.SQUAD_RIGHT_HAND_SLOT_PART_ID);

  // Setting up assets for Thaddeus children
  await setupChildAssets(thaddeusBody, timeSquadThaddeus, catalogThaddeus, await timeSquadThaddeus.getAddress(), C.THADDEUS_ASSET_METADATA_BODY_URI_1, C.THADDEUS_ASSET_METADATA_BODY_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY, C.SQUAD_BODY_SLOT_PART_ID);
  await setupChildAssets(thaddeusHead, timeSquadThaddeus, catalogThaddeus, await timeSquadThaddeus.getAddress(), C.THADDEUS_ASSET_METADATA_HEAD_URI_1, C.THADDEUS_ASSET_METADATA_HEAD_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD, C.SQUAD_HEAD_SLOT_PART_ID);
  await setupChildAssets(thaddeusLeftHand, timeSquadThaddeus, catalogThaddeus, await timeSquadThaddeus.getAddress(), C.THADDEUS_ASSET_METADATA_LEFT_HAND_URI_1, C.THADDEUS_ASSET_METADATA_LEFT_HAND_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND, C.SQUAD_LEFT_HAND_SLOT_PART_ID);
  await setupChildAssets(thaddeusRightHand, timeSquadThaddeus, catalogThaddeus, await timeSquadThaddeus.getAddress(), C.THADDEUS_ASSET_METADATA_RIGHT_HAND_URI_1, C.THADDEUS_ASSET_METADATA_RIGHT_HAND_URI_2, C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND, C.SQUAD_RIGHT_HAND_SLOT_PART_ID);

  return {
    owner, addr1, timeSquadRyker, timeSquadAria, timeSquadLuna, timeSquadThaddeus,
    ariaBody, ariaHead, ariaLeftHand, ariaRightHand,
    lunaBody, lunaHead, lunaLeftHand, lunaRightHand,
    rykerBody, rykerHead, rykerLeftHand, rykerRightHand,
    thaddeusBody, thaddeusHead, thaddeusLeftHand, thaddeusRightHand,
    manager
  };
}

async function setupChildAssets(
    childContract: AriaBody, 
    parentContract: TimeSquadAria, 
    catalog: RMRKCatalogImpl, 
    parentAddress: string, 
    bodyMetadataURI1: string, 
    bodyMetadataURI2: string, 
    groupForItemsBody: bigint, 
    slotPartId: bigint
  ) {
    // Add asset
      // Slot body
  const txBody = await catalog.addPart({
    partId: slotPartId,
    part: {
      itemType: C.PART_TYPE_SLOT,
      z: C.Z_INDEX_BODY_ITEMS,
      equippable: [await childContract.getAddress()],
      metadataURI: bodyMetadataURI1,  //TODO ANDREBBE QUESTO: C.SQUAD_ITEM_BODY_SLOT_METADATA
    },
  });
  await txBody.wait();
    // Body
    // Set primary asset
    const txChild01_body = await childContract.addAssetEntry(bodyMetadataURI1);
    await txChild01_body.wait();
  
    // Set secondary asset
    const txChild02_body = await childContract.addEquippableAssetEntry(
      groupForItemsBody,
      ethers.ZeroAddress,
      bodyMetadataURI2,
      [],
    );
    await txChild02_body.wait();
  
    const txChild03_body = await childContract.setValidParentForEquippableGroup(
      groupForItemsBody,
      parentAddress,
      slotPartId,
    );
    await txChild03_body.wait();
  
    const tx01 = await parentContract.setAutoAcceptCollection(
      await childContract.getAddress(),
      true,
    );
    await tx01.wait();
  
    const tx = await catalog.setEquippableAddresses(slotPartId, [await childContract.getAddress()]);
    await tx.wait();
  }
  

describe('AgeOfChronosManagerContract', function () {
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let timeSquadRyker: TimeSquadRyker;
  let timeSquadAria: TimeSquadAria;
  let timeSquadLuna: TimeSquadLuna;
  let timeSquadThaddeus: TimeSquadThaddeus;
  let ariaBody: AriaBody;
  let ariaHead: AriaHead;
  let ariaLeftHand: AriaLeftHand;
  let ariaRightHand: AriaRightHand;
  let lunaBody: LunaBody;
  let lunaHead: LunaHead;
  let lunaLeftHand: LunaLeftHand;
  let lunaRightHand: LunaRightHand;
  let rykerBody: RykerBody;
  let rykerHead: RykerHead;
  let rykerLeftHand: RykerLeftHand;
  let rykerRightHand: RykerRightHand;
  let thaddeusBody: ThaddeusBody;
  let thaddeusHead: ThaddeusHead;
  let thaddeusLeftHand: ThaddeusLeftHand;
  let thaddeusRightHand: ThaddeusRightHand;
  let manager: AgeOfChronosManager;

  beforeEach(async function () {
    ({
      owner, addr1, timeSquadRyker, timeSquadAria, timeSquadLuna, timeSquadThaddeus,
      ariaBody, ariaHead, ariaLeftHand, ariaRightHand,
      lunaBody, lunaHead, lunaLeftHand, lunaRightHand,
      rykerBody, rykerHead, rykerLeftHand, rykerRightHand,
      thaddeusBody, thaddeusHead, thaddeusLeftHand, thaddeusRightHand,
      manager
    } = await loadFixture(deployContracts));
  });

  describe('DeploymentManager', function () {
    it('Should set the correct owner', async function () {
      expect(await manager.owner()).to.equal(owner.address);
    });
  });

  describe('Fee Management', function () {
    it('Should set and get fee correctly', async function () {
      await manager.setFee(ethers.parseEther('0.1'));
      expect(await manager.getFee()).to.equal(ethers.parseEther('0.1'));
    });

    it('Should allow the owner to drain fees', async function () {
      await manager.setFee(ethers.parseEther('0.1'));
      await manager.payFee(1, 1, 1, 1, { value: ethers.parseEther('0.1') });
      const initialBalance = await ethers.provider.getBalance(owner.address);
      await manager.drainFees();
      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.be.above(initialBalance);
    });
  });

  describe('Mission Management', function () {
    beforeEach(async function () {
      await manager.setFee(ethers.parseEther('0.1'));
    });

    it('Should start and end a mission', async function () {
      await timeSquadRyker.mint(owner.address);
      await timeSquadLuna.mint(owner.address);
      await timeSquadAria.mint(owner.address);
      await timeSquadThaddeus.mint(owner.address);

      await manager.payFee(1, 1, 1, 1, { value: ethers.parseEther('0.1') });

      await manager.startMission(1, 1, 1, 1);
      expect(await manager.isTokenInMission(1)).to.equal(true);

      await manager.endMission(1, 1, 1, 1, 1);
      expect(await manager.isTokenInMission(1)).to.equal(false);
    });
  });

  describe('Permission Management', function () {
    it('Should set and check external permission', async function () {
      await manager.setFee(ethers.parseEther('0.1'));
      await timeSquadRyker.mint(owner.address);
      await manager.payFee(1, 0, 0, 0, { value: ethers.parseEther('0.1') });

      await manager.startMission(1, 0, 0, 0);
      await manager.endMission(1, 0, 0, 0, 1);

      expect(await rykerBody.hasExternalPermission(owner.address)).to.equal(true);
    });
  });
});
