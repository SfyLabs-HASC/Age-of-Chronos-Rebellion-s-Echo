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

    /* the managerContract is hidden
    if (!isHardhatNetwork()) {
        console.log('Waiting 20 seconds before verifying contract...');
        await delay(20000);
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: [],
            contract: 'contracts/AgeOfChronosManager.sol:AgeOfChronosManager',
        });
    }
    */
    return managerContract;
}

export async function configureManager(
    parent: TimeSquadAria,
    childs: AriaBody[],
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
    console.log('Manager configuration complete.', parentName);
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
    childRightHand: AriaRightHand
): Promise<void> {
    console.log('Adding assets to parent...');

    
/*
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
*/

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

/*
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
*/
}

export async function addAssetsLuna(
    parent: TimeSquadLuna,
    childBody: LunaBody,
    childHead: LunaHead,
    childLeftHand: LunaLeftHand,
    childRightHand: LunaRightHand
): Promise<void> {
    console.log('Adding assets to parent...');

    
/*
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
*/

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

/*
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
*/
}

export async function addAssetsRyker(
    parent: TimeSquadRyker,
    childBody: RykerBody,
    childHead: RykerHead,
    childLeftHand: RykerLeftHand,
    childRightHand: RykerRightHand
): Promise<void> {
    console.log('Adding assets to parent...');



/*
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

*/

/*
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
*/

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
    childRightHand: ThaddeusRightHand
): Promise<void> {
    console.log('Adding assets to parent...');

/*
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

*/

/*
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
*/

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

export async function mintChildNFT(child: AriaBody, recipient: string) {
    console.log('Minting Child NFT...');
    const assetIds = [1, 2];
    const txchild = await child.mintWithAssets(recipient, assetIds);
    await txchild.wait();
    console.log('Minted Child NFT with asset ID 1 to:', recipient);
}