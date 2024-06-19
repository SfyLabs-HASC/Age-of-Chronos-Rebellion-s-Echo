import { ethers, run, network } from 'hardhat';
import {
    TimeSquadAria,
    TimeSquadLuna,
    TimeSquadRyker,
    TimeSquadThaddeus,
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

export async function deployCatalog(name: string, catalogMetadata: string, catalogStringType: string): Promise<RMRKCatalogImpl> {
    const catalogMetadataUri = catalogMetadata;
    const catalogType = catalogStringType;

    const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl');
    const catalog = await catalogFactory.deploy(catalogMetadataUri, catalogType);
    await catalog.waitForDeployment();
    const catalogAddress = await catalog.getAddress();
    console.log(`Catalog ${name} deployed to:`, catalogAddress);

    return catalog;
}

export async function configureCatalogFixed(
    catalog: RMRKCatalogImpl,
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
    console.log('Catalog configured');
}

export async function addAssetsAria(
    parent: TimeSquadAria,
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

}

export async function addAssetsLuna(
    parent: TimeSquadLuna,
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


}

export async function addAssetsRyker(
    parent: TimeSquadRyker,
   
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


}

export async function addAssetsThaddeus(
    parent: TimeSquadThaddeus,
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

}

export async function mintParentNFT(parent: TimeSquadAria, recipient: string) {
    const nameContract = await parent.name()
    console.log(`Minting ${nameContract} NFT...`);
    const tx = await parent.mint(recipient);
    await tx.wait();
    console.log('Minted Parent NFT with ID 1 to:', recipient);
}