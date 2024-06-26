import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import {
    TimeSquadRyker,
    RykerRightHand,
    RMRKCalculateBalance,
    RMRKCatalogImpl
} from '../typechain-types';
import * as C from '../scripts/constants';
import '@nomiclabs/hardhat-ethers';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

async function deployContracts() {
    const [owner, addr1]: HardhatEthersSigner[] = await ethers.getSigners();

    // Deploy Parent Contract
    const TimeSquadRyker = await ethers.getContractFactory('TimeSquadRyker');
    const timeSquadRyker = await TimeSquadRyker.deploy(
        C.SQUAD_METADATA_RYKER,
        ethers.MaxUint256,
        owner.address,
        1000,
        C.MINT_ENUMERATE_RYKER,
    );
    await timeSquadRyker.waitForDeployment();

    // Deploy Catalog
    const RMRKCatalog = await ethers.getContractFactory('RMRKCatalogImpl');
    const catalog: RMRKCatalogImpl = await RMRKCatalog.deploy(
        C.SQUAD_CATALOG_ARIA_METADATA,
        C.CATALOG_TYPE,
    );
    await catalog.waitForDeployment();

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

    // Add assets to TimeSquadAria using deployed catalog
    const tx1 = await timeSquadRyker.addEquippableAssetEntry(
        0n,
        await catalog.getAddress(),
        C.ARIA_ASSET_METADATA_URI,
        [
            C.FIXED_PART_PARENT_ID,
            C.SQUAD_BODY_SLOT_PART_ID
        ],
    );
    await tx1.wait();

    // Deploy Child Contract
    const RykerRightHand = await ethers.getContractFactory('RykerRightHand');
    const rykerRightHand = await RykerRightHand.deploy(
        C.SQUAD_ITEM_METADATA_RYKER_RIGHT_HAND,
        ethers.MaxUint256,
        owner.address,
        1000,
    );
    await rykerRightHand.waitForDeployment();

    // Deploy Calculate Balance Contract
    const RMRKCalculateBalance = await ethers.getContractFactory('RMRKCalculateBalance');
    const calculateBalance = await RMRKCalculateBalance.deploy();
    await calculateBalance.waitForDeployment();

    const childBody = await rykerRightHand.getAddress();

    // Slot body
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

    // Add asset
    // Body
    // Set primary asset
    const txChild01_body = await rykerRightHand.addAssetEntry(
        C.ARIA_ASSET_METADATA_BODY_URI_1,
    );
    await txChild01_body.wait();

    // Set secondary asset
    const txChild02_body = await rykerRightHand.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        ethers.ZeroAddress,
        C.ARIA_ASSET_METADATA_BODY_URI_2,
        [],
    );
    await txChild02_body.wait();

    const txChild03_body = await rykerRightHand.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        await timeSquadRyker.getAddress(),
        C.SQUAD_BODY_SLOT_PART_ID,
    );
    await txChild03_body.wait();

    const tx01 = await timeSquadRyker.setAutoAcceptCollection(await rykerRightHand.getAddress(), true);
    await tx01.wait();

    const tx = await catalog.setEquippableAddresses(C.SQUAD_BODY_SLOT_PART_ID, [childBody]);
    await tx.wait();

    return { owner, addr1, timeSquadRyker, rykerRightHand, calculateBalance };
}

describe('TimeSquadRyker and RykerRightHand Tests', function () {
    let owner: HardhatEthersSigner;
    let addr1: HardhatEthersSigner;
    let timeSquadRyker: TimeSquadRyker;
    let rykerRightHand: RykerRightHand;
    let calculateBalance: RMRKCalculateBalance;

    beforeEach(async function () {
        ({ owner, addr1, timeSquadRyker, rykerRightHand, calculateBalance } = await loadFixture(deployContracts));

        // Mint a TimeSquadRyker (parent) NFT
        await timeSquadRyker.mint(owner.address);

        // Mint 5 RykerRightHand (child) NFTs
        for (let i = 0; i < 5; i++) {
            await rykerRightHand.setExternalPermission(owner.address, true);
            await rykerRightHand.mintWithAssets(owner.address, [1, 2]);
        }

        // Verify the tokens were minted correctly
        for (let i = 0; i < 5; i++) {
            const tokenId = await rykerRightHand.tokenOfOwnerByIndex(owner.address, i);
            console.log(`Minted RykerRightHand token ID: ${tokenId.toString()}`);
        }

        
        // NestTransferFrom two child tokens into the parent token
        const collectionParentAddress = await timeSquadRyker.getAddress();
        const childAddress = await rykerRightHand.getAddress();
        await rykerRightHand.nestTransferFrom(
            owner.address,
            collectionParentAddress,
            1,
            1,
            "0x"
        );

        await rykerRightHand.nestTransferFrom(
            owner.address,
            collectionParentAddress,
            2,
            1,
            "0x"
        );
        
    });

    it('mintChild', async function () {
        await rykerRightHand.setExternalPermission(owner.address, true);
        await rykerRightHand.mintWithAssets(owner.address, [1, 2]);
        expect(await rykerRightHand.balanceOf(owner.address)).to.equal(4);
    });


    it('mintParent', async function () {
        await timeSquadRyker.connect(addr1).mint(addr1.address);
        expect(await timeSquadRyker.balanceOf(addr1.address)).to.equal(1);
    });

    it('balance', async function () {
        // Calculate balance
        const directOwnerAddress = owner.address;
        const collectionParentAddresses = [await timeSquadRyker.getAddress()];
        const childAddress = await rykerRightHand.getAddress();

        const [totalBalance, tokenIds] = await calculateBalance.calculateBalance(directOwnerAddress, collectionParentAddresses, childAddress);
        console.log('Total Balance:', totalBalance.toString());
        console.log('Token IDs:', tokenIds.map(id => id.toString()).join(', '));

        // Verify the balance
        expect(totalBalance).to.equal(5);

        // Verify the token IDs
        expect(tokenIds.length).to.equal(5);

        // Verify tokenOfOwnerByIndex in a loop
        for (let i = 0; i < tokenIds.length; i++) {
            const tokenId = tokenIds[i];
            console.log('Token ID at index', i.toString(), ':', tokenId.toString());
        }
    });
});
