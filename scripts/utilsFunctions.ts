import { ethers, run, network } from 'hardhat';
import {
    ParentSample,
    ChildSample,
    AgeOfChronosManager,
    RMRKCatalogImpl
} from '../typechain-types';
import { getRegistry } from './get-gegistry';
import { delay, isHardhatNetwork } from './utils';
import * as C from './constants';

export async function deployParent(name: string,parentCollectionMetadata: String, mintEnumerateParent: string): Promise<ParentSample> {
    console.log(`Deploying ${name} to ${network.name} blockchain...`);

    const contractFactory = await ethers.getContractFactory(name);
    const collectionMeta = parentCollectionMetadata;
    const maxSupply = ethers.MaxUint256;
    const royaltyRecipient = (await ethers.getSigners())[0].address;
    const royaltyPercentageBps = 1000; // 10%
    const baseTokenURI = mintEnumerateParent;

    const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps, baseTokenURI] as const;
    const parentContract: ParentSample = await contractFactory.deploy(...args);
    await parentContract.waitForDeployment();
    const contractAddress = await parentContract.getAddress();
    console.log(`ParentSample deployed to ${contractAddress}`);

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


    return parentContract;
}

export async function deployCHILD(): Promise<ChildSample> {
    console.log(`Deploying ChildSample to ${network.name} blockchain...`);

    const contractFactory = await ethers.getContractFactory('ChildSample');
    const collectionMeta = C.CHILD_COLLECTION_METADATA;
    const maxSupply = ethers.MaxUint256;
    const royaltyRecipient = (await ethers.getSigners())[0].address;
    const royaltyPercentageBps = 300; // 3%

    const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps] as const;
    const childContract: ChildSample = await contractFactory.deploy(...args);
    await childContract.waitForDeployment();
    const contractAddress = await childContract.getAddress();
    console.log(`ChildSample deployed to ${contractAddress}`);

    const registry = await getRegistry();
    await registry.addExternalCollection(contractAddress, args[0]);
    console.log('Collection added to Singular Registry');

    if (!isHardhatNetwork()) {
        console.log('Waiting 20 seconds before verifying contract...');
        await delay(20000);
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
            contract: 'contracts/child/ChildSample.sol:ChildSample',
        });
    }
    return childContract;
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

export async function deployCatalog(): Promise<RMRKCatalogImpl> {
    const catalogMetadataUri = C.CATALOG_METADATA;
    const catalogType = C.CATALOG_TYPE;

    const catalogFactory = await ethers.getContractFactory('RMRKCatalogImpl');
    const catalog = await catalogFactory.deploy(catalogMetadataUri, catalogType);
    await catalog.waitForDeployment();
    const catalogAddress = await catalog.getAddress();
    console.log('Catalog deployed to:', catalogAddress);

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
    childAddress: string,
): Promise<void> {
    console.log('Configuring Catalog...');

    //todo forse non è piu necessario
    const tx00 = await catalog.addPart({
        partId: C.FIXED_PART_PARENT_ID,
        part: {
            itemType: C.PART_TYPE_FIXED,
            z: C.Z_INDEX_FOR_PARENT,
            equippable: [],
            metadataURI: C.FIXED_PART_CHILD_METADATA,
        },
    });
    await tx00.wait();

    const tx01 = await catalog.addPart({
        partId: C.SLOT_FOR_CHILD_ID,
        part: {
            itemType: C.PART_TYPE_SLOT,
            z: C.Z_INDEX_FOR_CHILD,
            equippable: [childAddress],
            metadataURI: C.SLOT_FOR_CHILD_METADATA,
        },
    });
    await tx01.wait();
    console.log('Catalog configured');
}

export async function addAssets(
    parent: ParentSample,
    child: ChildSample,
    catalog: RMRKCatalogImpl,
): Promise<void> {
    console.log('Adding assets to parent...');

    //forse non piu necessario?
    const tx1 = await parent.addEquippableAssetEntry(
        0n,
        await catalog.getAddress(),
        C.PARENT_ASSET_METADATA_URI,
        [C.FIXED_PART_PARENT_ID, C.SLOT_FOR_CHILD_ID],
    );
    await tx1.wait();

    
    //setprimary asset
    const tx2 = await child.addAssetEntry(
        C.CHILD_ASSET_METADATA_URI_1,
    );
    await tx2.wait();


    const tx3 = await child.addEquippableAssetEntry(
        C.CHILD_EQUIPPABLE_GROUP_ID,
        ethers.ZeroAddress,
        C.CHILD_ASSET_METADATA_URI_2,
        [],
    );
    await tx3.wait();

    const tx4 = await child.setValidParentForEquippableGroup(
        C.CHILD_EQUIPPABLE_GROUP_ID,
        await parent.getAddress(),
        C.SLOT_FOR_CHILD_ID,
    );
    await tx4.wait();


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
    parent: ParentSample,
    child: ChildSample,
    catalog: RMRKCatalogImpl,
    manager: AgeOfChronosManager
): Promise<void> {
    console.log('Configuring Manager...');

    const managerAddress = await manager.getAddress();

    // Adding manager as a contributor in the parent contract
    const tx1 = await parent.manageContributor(managerAddress, true);
    await tx1.wait();
    console.log('Manager added as a contributor in Parent contract');

    // Adding manager as a contributor in the child contract
    const tx2 = await child.manageContributor(managerAddress, true);
    await tx2.wait();
    console.log('Manager added as a contributor in Child contract');

    console.log('Manager configuration complete.');
}


export async function setEquippableAddresses(catalog: RMRKCatalogImpl, equippableChildAddresses: string[]) {
    const partId = C.SLOT_FOR_CHILD_ID
    console.log(`Setting equippable addresses for partId: ${partId}, addresses: ${equippableChildAddresses}`);

    try {
        const tx = await catalog.setEquippableAddresses(partId, equippableChildAddresses);
        await tx.wait();
        console.log('Equippable addresses set successfully.');
    } catch (error) {
        console.error('Error setting equippable addresses:', error);
        throw error;
    }
}

export async function setExternalPermission(child: ChildSample, account: string, permission: boolean) {
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

export async function addAssetToChildToken(child: ChildSample, 
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



export async function readAssetsToToken(child: ChildSample, tokenId:bigint) {
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


export async function mintParentNFT(parent: ParentSample, recipient: string) {
    console.log('Minting Parent NFT...');
    const tx = await parent.mint(recipient);
    await tx.wait();
    console.log('Minted Parent NFT with ID 1 to:', recipient);
}


export async function mintChildNFT(child: ChildSample, recipient: string) {
    console.log('Minting Child NFT...');
    const assetIds = [1, 2]; // Replace with actual asset IDs as needed.
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


