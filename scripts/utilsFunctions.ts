import { ethers, run, network } from 'hardhat';
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
    RMRKCatalogImpl
} from '../typechain-types';
import { getRegistry } from './get-gegistry';
import { delay, isHardhatNetwork } from './utils';
import * as C from './constants';

export async function deployParent(name: string, parentCollectionMetadata: String, mintEnumerateParent: string): Promise<TimeSquadAria> {
    console.log(`Deploying ${name} to ${network.name} blockchain...`);

    const contractFactory = await ethers.getContractFactory(name);
    const collectionMeta = parentCollectionMetadata;
    const maxSupply = ethers.MaxUint256;
    const royaltyRecipient = (await ethers.getSigners())[0].address;
    const royaltyPercentageBps = 1000; // 10%
    const baseTokenURI = mintEnumerateParent;

    const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps, baseTokenURI] as const;
    const parentContract: TimeSquadAria = await contractFactory.deploy(...args);
    await parentContract.waitForDeployment();
    const contractAddress = await parentContract.getAddress();
    console.log(`${name} deployed to ${contractAddress}`);

    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');


    if (!isHardhatNetwork()) {



        console.log('Waiting 20 seconds before verifying contract...');
        await delay(20000);
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
            contract: `contracts/parent/${name}.sol:${name}`,
        });
    }


    return parentContract as TimeSquadAria;
}

export async function deployChild(name: string, childCollectionMetadata: String): Promise<AriaBody> {
    console.log(`Deploying ${name} to ${network.name} blockchain...`);

    const contractFactory = await ethers.getContractFactory(name);
    const collectionMeta = childCollectionMetadata;
    const maxSupply = ethers.MaxUint256;
    const royaltyRecipient = (await ethers.getSigners())[0].address;
    const royaltyPercentageBps = 1000; // 10%

    const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps] as const;
    const childContract: AriaBody = await contractFactory.deploy(...args);
    await childContract.waitForDeployment();
    const contractAddress = await childContract.getAddress();
    console.log(`${name} deployed to ${contractAddress}`);

    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');

    if (!isHardhatNetwork()) {



        console.log('Waiting 20 seconds before verifying contract...');
        await delay(20000);
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
            contract: `contracts/child/${name}.sol:${name}`,
        });
    }
    return childContract as AriaBody;
}

export async function deployManager(): Promise<AgeOfChronosManager> {
    console.log(`Deploying AgeOfChronosManager to ${network.name} blockchain...`);

    const contractFactory = await ethers.getContractFactory('AgeOfChronosManager');
    const managerContract: AgeOfChronosManager = await contractFactory.deploy();
    await managerContract.waitForDeployment();
    const contractAddress = await managerContract.getAddress();
    console.log(`AgeOfChronosManager deployed to ${contractAddress}`);

    if (!isHardhatNetwork()) {
        console.log('Waiting 20 seconds before verifying contract...');
        await delay(20000);
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: [],
            contract: 'contracts/AgeOfChronosManager.sol:AgeOfChronosManager',
        });
    }

    return managerContract;
}

export async function deployCatalog(name: string, catalogMetadata: string, catalogStringType: string): Promise<RMRKCatalogImpl> {
    const catalogMetadataUri = catalogMetadata;
    const catalogType = catalogStringType;

    const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl');
    const catalog = await catalogFactory.deploy(catalogMetadataUri, catalogType);
    await catalog.waitForDeployment();
    const catalogAddress = await catalog.getAddress();
    console.log(`Catalog ${name} deployed to:`, catalogAddress);

    if (!isHardhatNetwork()) {
        console.log('Waiting 20 seconds before verifying contract...');
        await delay(20000);
        await run('verify:verify', {
            address: catalogAddress,
            constructorArguments: [catalogMetadataUri, catalogType],
            contract: 'contracts/catalog/RMRKCatalogImpl.sol:RMRKCatalogImpl',
        });
    }

    return catalog;
}

export async function configureCatalog(
    catalog: RMRKCatalogImpl,
    childBody: string,
    childHead: string,
    childLeftHand: string,
    childRightHand: string,
    fixed_part_parent_metadata: string
): Promise<void> {
    console.log('Configuring Catalog...', await catalog.getAddress());

    //fixed
    const tx00 = await catalog.addPart({
        partId: C.FIXED_PART_PARENT_ID,
        part: {
            itemType: C.PART_TYPE_FIXED,
            z: C.Z_INDEX_BACKGROUND,
            equippable: [],
            metadataURI: fixed_part_parent_metadata,
        },
    });
    await tx00.wait();

    //slots
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

    const txHead = await catalog.addPart({
        partId: C.SQUAD_HEAD_SLOT_PART_ID,
        part: {
            itemType: C.PART_TYPE_SLOT,
            z: C.Z_INDEX_HEAD_ITEMS,
            equippable: [childHead],
            metadataURI: C.SQUAD_ITEM_HEAD_SLOT_METADATA,
        },
    });
    await txHead.wait();

    const txLeftHand = await catalog.addPart({
        partId: C.SQUAD_LEFT_HAND_SLOT_PART_ID,
        part: {
            itemType: C.PART_TYPE_SLOT,
            z: C.Z_INDEX_LEFT_HAND_ITEMS,
            equippable: [childLeftHand],
            metadataURI: C.SQUAD_ITEM_LEFT_SLOT_METADATA,
        },
    });
    await txLeftHand.wait();

    const txRightHand = await catalog.addPart({
        partId: C.SQUAD_RIGHT_HAND_SLOT_PART_ID,
        part: {
            itemType: C.PART_TYPE_SLOT,
            z: C.Z_INDEX_RIGHT_HAND_ITEMS,
            equippable: [childRightHand],
            metadataURI: C.SQUAD_ITEM_RIGHT_SLOT_METADATA,
        },
    });
    await txRightHand.wait();
    console.log('Catalog configured');
}

export async function addAssetsAria(
    parent: TimeSquadAria,
    childBody: AriaBody,
    childHead: AriaHead,
    childLeftHand: AriaLeftHand,
    childRightHand: AriaRightHand,
    catalog: RMRKCatalogImpl,
): Promise<void> {
    console.log('Adding assets to parent...');

    //forse non piu necessario? PARENT
    const tx1 = await parent.addEquippableAssetEntry(
        0n,
        await catalog.getAddress(),
        C.ARIA_ASSET_METADATA_URI,
        [C.FIXED_PART_PARENT_ID,
        C.SQUAD_BODY_SLOT_PART_ID,
        C.SQUAD_HEAD_SLOT_PART_ID,
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID
        ]);
    await tx1.wait();
    await delay(1000)



    //BODY
    //set primary asset
    const txChild01_body = await childBody.addAssetEntry(
        C.ARIA_ASSET_METADATA_BODY_URI_1,
    );
    await txChild01_body.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_body = await childBody.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        ethers.ZeroAddress,
        C.ARIA_ASSET_METADATA_BODY_URI_2,
        [],
    );
    await txChild02_body.wait();
    await delay(1000)
    const txChild03_body = await childBody.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        await parent.getAddress(),
        C.SQUAD_BODY_SLOT_PART_ID,
    );
    await txChild03_body.wait();
    await delay(1000)

    //HEAD
    //set primary asset
    const txChild01_head = await childHead.addAssetEntry(
        C.ARIA_ASSET_METADATA_HEAD_URI_1,
    );
    await txChild01_head.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_head = await childHead.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD,
        ethers.ZeroAddress,
        C.ARIA_ASSET_METADATA_HEAD_URI_2,
        [],
    );
    await txChild02_head.wait();
    await delay(1000)
    const txChild03_head = await childHead.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD,
        await parent.getAddress(),
        C.SQUAD_HEAD_SLOT_PART_ID,
    );
    await txChild03_head.wait();
    await delay(1000)


    //LEFT HAND
    //set primary asset
    const txChild01_left_hand = await childLeftHand.addAssetEntry(
        C.ARIA_ASSET_METADATA_LEFT_HAND_URI_1,
    );
    await txChild01_left_hand.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_left_hand = await childLeftHand.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
        ethers.ZeroAddress,
        C.ARIA_ASSET_METADATA_LEFT_HAND_URI_2,
        [],
    );
    await txChild02_left_hand.wait();
    await delay(1000)
    const txChild03_left_hand = await childLeftHand.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
        await parent.getAddress(),
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
    );
    await txChild03_left_hand.wait();
    await delay(1000)


    //RIGHT HAND
    //set primary asset
    const txChild01_right_hand = await childRightHand.addAssetEntry(
        C.ARIA_ASSET_METADATA_RIGHT_HAND_URI_1,
    );
    await txChild01_right_hand.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_right_hand = await childRightHand.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
        ethers.ZeroAddress,
        C.ARIA_ASSET_METADATA_RIGHT_HAND_URI_2,
        [],
    );
    await txChild02_right_hand.wait();
    await delay(1000)
    const txChild03_right_hand = await childRightHand.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
        await parent.getAddress(),
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID,
    );
    await txChild03_right_hand.wait();
    await delay(1000)

}

export async function addAssetsLuna(
    parent: TimeSquadLuna,
    childBody: LunaBody,
    childHead: LunaHead,
    childLeftHand: LunaLeftHand,
    childRightHand: LunaRightHand,
    catalog: RMRKCatalogImpl,
): Promise<void> {
    console.log('Adding assets to parent...');

    //forse non piu necessario? PARENT
    const tx1 = await parent.addEquippableAssetEntry(
        0n,
        await catalog.getAddress(),
        C.LUNA_ASSET_METADATA_URI,
        [C.FIXED_PART_PARENT_ID,
        C.SQUAD_BODY_SLOT_PART_ID,
        C.SQUAD_HEAD_SLOT_PART_ID,
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID
        ]);
    await tx1.wait();
    await delay(1000)



    //BODY
    //set primary asset
    const txChild01_body = await childBody.addAssetEntry(
        C.LUNA_ASSET_METADATA_BODY_URI_1,
    );
    await txChild01_body.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_body = await childBody.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        ethers.ZeroAddress,
        C.LUNA_ASSET_METADATA_BODY_URI_2,
        [],
    );
    await txChild02_body.wait();
    await delay(1000)
    const txChild03_body = await childBody.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        await parent.getAddress(),
        C.SQUAD_BODY_SLOT_PART_ID,
    );
    await txChild03_body.wait();
    await delay(1000)

    //HEAD
    //set primary asset
    const txChild01_head = await childHead.addAssetEntry(
        C.LUNA_ASSET_METADATA_HEAD_URI_1,
    );
    await txChild01_head.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_head = await childHead.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD,
        ethers.ZeroAddress,
        C.LUNA_ASSET_METADATA_HEAD_URI_2,
        [],
    );
    await txChild02_head.wait();
    await delay(1000)
    const txChild03_head = await childHead.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD,
        await parent.getAddress(),
        C.SQUAD_HEAD_SLOT_PART_ID,
    );
    await txChild03_head.wait();
    await delay(1000)


    //LEFT HAND
    //set primary asset
    const txChild01_left_hand = await childLeftHand.addAssetEntry(
        C.LUNA_ASSET_METADATA_LEFT_HAND_URI_1,
    );
    await txChild01_left_hand.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_left_hand = await childLeftHand.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
        ethers.ZeroAddress,
        C.LUNA_ASSET_METADATA_LEFT_HAND_URI_2,
        [],
    );
    await txChild02_left_hand.wait();
    await delay(1000)
    const txChild03_left_hand = await childLeftHand.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
        await parent.getAddress(),
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
    );
    await txChild03_left_hand.wait();
    await delay(1000)


    //RIGHT HAND
    //set primary asset
    const txChild01_right_hand = await childRightHand.addAssetEntry(
        C.LUNA_ASSET_METADATA_RIGHT_HAND_URI_1,
    );
    await txChild01_right_hand.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_right_hand = await childRightHand.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
        ethers.ZeroAddress,
        C.LUNA_ASSET_METADATA_RIGHT_HAND_URI_2,
        [],
    );
    await txChild02_right_hand.wait();
    await delay(1000)
    const txChild03_right_hand = await childRightHand.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
        await parent.getAddress(),
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID,
    );
    await txChild03_right_hand.wait();
    await delay(1000)

}

export async function addAssetsRyker(
    parent: TimeSquadRyker,
    childBody: RykerBody,
    childHead: RykerHead,
    childLeftHand: RykerLeftHand,
    childRightHand: RykerRightHand,
    catalog: RMRKCatalogImpl,
): Promise<void> {
    console.log('Adding assets to parent...');

    //forse non piu necessario? PARENT
    const tx1 = await parent.addEquippableAssetEntry(
        0n,
        await catalog.getAddress(),
        C.RYKER_ASSET_METADATA_URI,
        [C.FIXED_PART_PARENT_ID,
        C.SQUAD_BODY_SLOT_PART_ID,
        C.SQUAD_HEAD_SLOT_PART_ID,
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID
        ]);
    await tx1.wait();
    await delay(1000)



    //BODY
    //set primary asset
    const txChild01_body = await childBody.addAssetEntry(
        C.RYKER_ASSET_METADATA_BODY_URI_1,
    );
    await txChild01_body.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_body = await childBody.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        ethers.ZeroAddress,
        C.RYKER_ASSET_METADATA_BODY_URI_2,
        [],
    );
    await txChild02_body.wait();
    await delay(1000)
    const txChild03_body = await childBody.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        await parent.getAddress(),
        C.SQUAD_BODY_SLOT_PART_ID,
    );
    await txChild03_body.wait();
    await delay(1000)

    //HEAD
    //set primary asset
    const txChild01_head = await childHead.addAssetEntry(
        C.RYKER_ASSET_METADATA_HEAD_URI_1,
    );
    await txChild01_head.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_head = await childHead.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD,
        ethers.ZeroAddress,
        C.RYKER_ASSET_METADATA_HEAD_URI_2,
        [],
    );
    await txChild02_head.wait();
    await delay(1000)
    const txChild03_head = await childHead.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD,
        await parent.getAddress(),
        C.SQUAD_HEAD_SLOT_PART_ID,
    );
    await txChild03_head.wait();
    await delay(1000)


    //LEFT HAND
    //set primary asset
    const txChild01_left_hand = await childLeftHand.addAssetEntry(
        C.RYKER_ASSET_METADATA_LEFT_HAND_URI_1,
    );
    await txChild01_left_hand.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_left_hand = await childLeftHand.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
        ethers.ZeroAddress,
        C.RYKER_ASSET_METADATA_LEFT_HAND_URI_2,
        [],
    );
    await txChild02_left_hand.wait();
    await delay(1000)
    const txChild03_left_hand = await childLeftHand.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
        await parent.getAddress(),
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
    );
    await txChild03_left_hand.wait();
    await delay(1000)


    //RIGHT HAND
    //set primary asset
    const txChild01_right_hand = await childRightHand.addAssetEntry(
        C.RYKER_ASSET_METADATA_RIGHT_HAND_URI_1,
    );
    await txChild01_right_hand.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_right_hand = await childRightHand.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
        ethers.ZeroAddress,
        C.RYKER_ASSET_METADATA_RIGHT_HAND_URI_2,
        [],
    );
    await txChild02_right_hand.wait();
    await delay(1000)
    const txChild03_right_hand = await childRightHand.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
        await parent.getAddress(),
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID,
    );
    await txChild03_right_hand.wait();
    await delay(1000)

}

export async function addAssetsThaddeus(
    parent: TimeSquadThaddeus,
    childBody: ThaddeusBody,
    childHead: ThaddeusHead,
    childLeftHand: ThaddeusLeftHand,
    childRightHand: ThaddeusRightHand,
    catalog: RMRKCatalogImpl,
): Promise<void> {
    console.log('Adding assets to parent...');

    //forse non piu necessario? PARENT
    const tx1 = await parent.addEquippableAssetEntry(
        0n,
        await catalog.getAddress(),
        C.THADDEUS_ASSET_METADATA_URI,
        [C.FIXED_PART_PARENT_ID,
        C.SQUAD_BODY_SLOT_PART_ID,
        C.SQUAD_HEAD_SLOT_PART_ID,
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID
        ]);
    await tx1.wait();
    await delay(1000)



    //BODY
    //set primary asset
    const txChild01_body = await childBody.addAssetEntry(
        C.THADDEUS_ASSET_METADATA_BODY_URI_1,
    );
    await txChild01_body.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_body = await childBody.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        ethers.ZeroAddress,
        C.THADDEUS_ASSET_METADATA_BODY_URI_2,
        [],
    );
    await txChild02_body.wait();
    await delay(1000)
    const txChild03_body = await childBody.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_BODY,
        await parent.getAddress(),
        C.SQUAD_BODY_SLOT_PART_ID,
    );
    await txChild03_body.wait();
    await delay(1000)

    //HEAD
    //set primary asset
    const txChild01_head = await childHead.addAssetEntry(
        C.THADDEUS_ASSET_METADATA_HEAD_URI_1,
    );
    await txChild01_head.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_head = await childHead.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD,
        ethers.ZeroAddress,
        C.THADDEUS_ASSET_METADATA_HEAD_URI_2,
        [],
    );
    await txChild02_head.wait();
    await delay(1000)
    const txChild03_head = await childHead.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_HEAD,
        await parent.getAddress(),
        C.SQUAD_HEAD_SLOT_PART_ID,
    );
    await txChild03_head.wait();
    await delay(1000)


    //LEFT HAND
    //set primary asset
    const txChild01_left_hand = await childLeftHand.addAssetEntry(
        C.THADDEUS_ASSET_METADATA_LEFT_HAND_URI_1,
    );
    await txChild01_left_hand.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_left_hand = await childLeftHand.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
        ethers.ZeroAddress,
        C.THADDEUS_ASSET_METADATA_LEFT_HAND_URI_2,
        [],
    );
    await txChild02_left_hand.wait();
    await delay(1000)
    const txChild03_left_hand = await childLeftHand.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
        await parent.getAddress(),
        C.SQUAD_LEFT_HAND_SLOT_PART_ID,
    );
    await txChild03_left_hand.wait();
    await delay(1000)


    //RIGHT HAND
    //set primary asset
    const txChild01_right_hand = await childRightHand.addAssetEntry(
        C.THADDEUS_ASSET_METADATA_RIGHT_HAND_URI_1,
    );
    await txChild01_right_hand.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_right_hand = await childRightHand.addEquippableAssetEntry(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
        ethers.ZeroAddress,
        C.THADDEUS_ASSET_METADATA_RIGHT_HAND_URI_2,
        [],
    );
    await txChild02_right_hand.wait();
    await delay(1000)
    const txChild03_right_hand = await childRightHand.setValidParentForEquippableGroup(
        C.EQUIPPABLE_GROUP_FOR_ITEMS_RIGHT_HAND,
        await parent.getAddress(),
        C.SQUAD_RIGHT_HAND_SLOT_PART_ID,
    );
    await txChild03_right_hand.wait();
    await delay(1000)

}





export async function checkEquipConditions(childContract: ChildSample,
    parentContract: ParentSample,
    catalogContract: RMRKCatalogImpl,
    childTokenId: number,
    parentTokenId: number,
    partId: number) {
    const childAddress = await childContract.getAddress();
    const parentAddress = await parentContract.getAddress();

    if (!childAddress || !parentAddress) {
        throw new Error("One of the contract addresses is undefined");
    }

    console.log("Child Address: ", childAddress);
    console.log("Parent Address: ", parentAddress);

    // Verifica se il child è equipaggiabile
    const isEquippable = await childContract.canTokenBeEquippedWithAssetIntoSlot(
        parentAddress,
        parentTokenId,
        childTokenId,
        partId // Assumendo che 1 sia il partId dello slot
    );
    console.log(`Is equippable: ${isEquippable}`);

    // Dettagli dell'asset
    const assetDetails = await parentContract.getAssetAndEquippableData(parentTokenId, 1);
    console.log(`Asset Details: ${assetDetails}`);

    // Verifica se il child è già equipaggiato
    const isEquipped = await parentContract.isChildEquipped(
        parentTokenId,
        childAddress,
        childTokenId
    );
    console.log(`Is child equipped: ${isEquipped}`);
}


export async function configureManager(
    parent: TimeSquadAria,
    childs: AriaBody[],
    catalog: RMRKCatalogImpl,
    manager: AgeOfChronosManager
): Promise<void> {
    const parentName = await parent.name()
    console.log('Configuring Manager...', parentName);

    const managerAddress = await manager.getAddress();

    // Adding manager as a contributor in the parent contract
    const tx1 = await parent.manageContributor(managerAddress, true);
    await tx1.wait();
    console.log(`Manager added as a contributor in ${parentName} contract`);

    // Adding manager as a contributor in the child contract
    for (const child of childs) {
        let childName = await child.name()
        let tx2 = await child.manageContributor(managerAddress, true);
        await tx2.wait();
        console.log(`Manager added as a contributor in ${childName} contract`);
        await delay(1000)
    }
    console.log('Manager configuration complete.');
}


export async function setEquippableAddresses(catalog: RMRKCatalogImpl,
    equippableChildAddressBody: string,
    equippableChildAddressHead: string,
    equippableChildAddressLeftHand: string,
    equippableChildAddressRightHand: string
) {

    try {
        const tx = await catalog.setEquippableAddresses(C.SQUAD_BODY_SLOT_PART_ID, [equippableChildAddressBody]);
        await tx.wait();
    } catch (error) {
        console.error('Error setting equippable addresses:', error);
        throw error;
    }
    try {
        const tx = await catalog.setEquippableAddresses(C.SQUAD_HEAD_SLOT_PART_ID, [equippableChildAddressHead]);
        await tx.wait();
    } catch (error) {
        console.error('Error setting equippable addresses:', error);
        throw error;
    }
    try {
        const tx = await catalog.setEquippableAddresses(C.SQUAD_LEFT_HAND_SLOT_PART_ID, [equippableChildAddressLeftHand]);
        await tx.wait();
    } catch (error) {
        console.error('Error setting equippable addresses:', error);
        throw error;
    }
    try {
        const tx = await catalog.setEquippableAddresses(C.SQUAD_RIGHT_HAND_SLOT_PART_ID, [equippableChildAddressRightHand]);
        await tx.wait();
    } catch (error) {
        console.error('Error setting equippable addresses:', error);
        throw error;
    }
}

export async function setExternalPermission(child: AriaBody, account: string, permission: boolean) {
    console.log('Setting external permission for minting Child NFT...');

    const tx = await child.setExternalPermission(account, permission);
    await tx.wait();

    console.log(`Set external permission for ${account} to ${permission}`);
}

export async function nestTransferChildToParent(parent: ParentSample,
    child: ChildSample,
    childTokenId: number,
    parentTokenId: number,
    fromAddress: string) {
    console.log(`Nesting child token ${childTokenId} to parent token ${parentTokenId}...`);

    // Assicurati che il token child sia di proprietà dell'indirizzo 'fromAddress'
    const childOwner = await child.ownerOf(childTokenId);
    if (childOwner.toLowerCase() !== fromAddress.toLowerCase()) {
        throw new Error("L'indirizzo fornito non possiede il token child specificato.");
    }

    // Esegui il trasferimento nidificato
    const tx = await child.nestTransferFrom(fromAddress, await parent.getAddress(), childTokenId, parentTokenId, "0x");
    await tx.wait();

    console.log(`Nested child token ${childTokenId} under parent token ${parentTokenId} successfully.`);
}

export async function addAssetToChildToken(child: AriaBody,
    tokenId: number,
    assetId: bigint,
    replacesAssetWithId: bigint) {
    console.log(`Adding asset ${assetId} to token ${tokenId}...`);

    try {
        const tx = await child.addAssetToToken(tokenId, assetId, replacesAssetWithId);
        await tx.wait();
        console.log(`Asset ${assetId} added to token ${tokenId} successfully.`);
    } catch (error) {
        console.error('Failed to add asset to token:', error);
        throw error;
    }
}

// Nel file utilsFunctions.js o utilsFunctions.ts


export async function setValidParentForEquippableGroupMain(childContract: ChildSample,
    equippableGroupId: number,
    parentAddress: string,
    partId: number) {
    // Codice per configurare il gruppo equipaggiabile
    const tx = await childContract.setValidParentForEquippableGroup(
        equippableGroupId,
        parentAddress,
        partId
    );
    await tx.wait();
    console.log('Equippable group set successfully.');
}



export async function readAssetsToToken(child: AriaBody, tokenId: bigint) {
    console.log(`Reading assets for token ${tokenId}...`);

    try {
        const assetIds = await child.getActiveAssets(tokenId);
        console.log(`Active assets for token ${tokenId}:`, assetIds);

        // Fetch and log metadata for each asset
        for (const assetId of assetIds) {
            const metadata = await child.getAssetMetadata(tokenId, assetId);
            console.log(`Metadata for asset ${assetId}: ${metadata}`);
        }
    } catch (error) {
        console.error('Failed to read assets for token:', error);
        throw error;
    }
}



export async function equipChildOnParent(parent: ParentSample,
    parentTokenId: bigint,
    childTokenId: bigint,
    slotId: number) {
    console.log(`Preparing to equip child token ${childTokenId} on parent token ${parentTokenId} at slot ${slotId}...`);


    // Ottiene tutti i child tokens del parent
    const children = await parent.childrenOf(parentTokenId);
    const childIndex = children.findIndex(child => child.tokenId === childTokenId);

    // Controlla se il child è stato trovato
    if (childIndex === -1) {
        throw new Error("Child token not found among the parent's children.");
    }


    // Preparazione dei dati per la chiamata a 'equip'
    const data = {
        tokenId: parentTokenId,
        childTokenId,
        assetId: 2,  // assetID è 1
        slotPartId: slotId,  // ID dello slot dove vuoi equipaggiare il child
        childAssetId: 1,  // Assumo che il child abbia un assetId corrispondente allo slotId
        childIndex: childIndex  // Aggiungi l'indice del child
    };
    console.log("data", data);

    // Chiamata a 'equip'
    const tx02 = await parent.equip(data);
    await tx02.wait();

    console.log(`Equipped child token ${childTokenId} on parent token ${parentTokenId} at slot ${slotId} successfully.`);


}

export async function verifyEquippableStatus(catalog: RMRKCatalogImpl, childAddress: string, partId: bigint) {
    const isEquippable = await catalog.checkIsEquippable(partId, childAddress);
    if (!isEquippable) {
        throw new Error('Child contract address is not equippable.');
    }
    console.log('Child contract is equippable.');
}


export async function mintParentNFT(parent: TimeSquadAria, recipient: string) {
    const nameContract = await parent.name()
    console.log(`Minting ${nameContract} NFT...`);
    const tx = await parent.mint(recipient);
    await tx.wait();
    console.log('Minted Parent NFT with ID 1 to:', recipient);
}


export async function mintChildNFT(child: AriaBody, recipient: string) {
    console.log('Minting Child NFT...');
    const assetIds = [1, 2];
    const txchild = await child.mintWithAssets(recipient, assetIds);
    await txchild.wait();
    console.log('Minted Child NFT with asset ID 1 to:', recipient);
}


export async function removeSoulbound(parent: ParentSample, tokenId: number) {
    console.log(`Removing soulbound attribute from token ID ${tokenId}...`);

    // Call setSoulbound to remove the soulbound attribute
    const tx = await parent.setSoulbound(tokenId, false);
    await tx.wait();
    console.log(`Soulbound attribute removed from token ID ${tokenId}`);
}

export async function checkIsEquippable(catalog: RMRKCatalogImpl, partId: bigint, childAddress: string) {
    console.log(`Checking if part ${partId} is equippable by address ${childAddress}...`);
    const isEquippable = await catalog.checkIsEquippable(partId, childAddress);
    console.log(`Is equippable: ${isEquippable}`);
    return isEquippable;
}

export async function getPartDetails(catalog: RMRKCatalogImpl, partId: bigint) {
    console.log(`Getting details for part ${partId}...`);
    const part = await catalog.getPart(partId);
    console.log(`Part details:`, part);
    return part;
}


export async function debugEquippableStatus(
    parent: ParentSample,
    catalog: RMRKCatalogImpl,
    child: ChildSample,
    childAddress: string,
    partId: bigint,
    tokenId: number,
    assetId: number,
    slotId: number
) {
    // Controlla se l'indirizzo child è equipaggiabile
    await checkIsEquippable(catalog, partId, childAddress);
    // Ottieni i dettagli della parte
    await getPartDetails(catalog, partId);

    await setEquippableAddresses(catalog, [childAddress]);

    // Verifica se il parent può equipaggiare il child
    const parentAddress = await parent.getAddress();
    console.log(`Verifica se il contratto parent può equipaggiare il child...`);
    console.log(parentAddress, tokenId, assetId, slotId);
    const canEquip = await child.canTokenBeEquippedWithAssetIntoSlot(parentAddress, tokenId, assetId, slotId);
    console.log(`Può equipaggiare: ${canEquip}`);
}

export async function readAssets(
    parent: ParentSample,

    child: ChildSample,
    catalog: RMRKCatalogImpl
) {
    try {
        let tx = await parent.getActiveAssets(1);
        console.log(`parent getActiveAssets: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }


    try {
        let tx = await parent.getAssetMetadata(1, 1n);
        console.log(`parent getAssetMetadata: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }
    await delay(500)
    try {
        let tx = await child.getAssetMetadata(1, 1n);
        console.log(`child 1,1 getAssetMetadata: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }
    await delay(500)
    try {
        let tx = await child.getAssetMetadata(1, 2n);
        console.log(`child 1,2 getAssetMetadata: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }
    await delay(500)

    try {
        let tx = await parent.totalAssets();
        console.log(`parent totalAssets: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }

    try {
        let tx = await catalog.getAllPartIds();
        console.log(`getAllPartIds: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }
    try {
        let tx = await catalog.getPart(1);
        console.log(`getPart: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }
    try {
        let tx = await catalog.getPart(1000);
        console.log(`getPart 1000: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }
    try {
        let tx = await child.getActiveAssets(1);
        console.log(`child getActiveAssets: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }
    try {
        let tx = await child.getActiveAssets(2);
        console.log(`child getActiveAssets: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }

    try {
        let tx = await child.getAssetReplacements(2, 1n);
        console.log(`child getAssetReplacements: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }
    await delay(500)

    try {
        let tx = await child.totalAssets();
        console.log(`child totalAssets: ${tx}`);
    } catch (error) {
        console.error('Error during contract interaction:', error);
    }
}


