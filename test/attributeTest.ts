import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { TimeSquadAria, RMRKTokenAttributesRepository } from '../typechain-types';
import * as C from '../scripts/constants';

async function fixtureAttributesRepository(): Promise<{ parent: TimeSquadAria, attributesRepo: RMRKTokenAttributesRepository, owner: any }> {
    const [owner] = await ethers.getSigners();

    // Deploy TimeSquadAria contract as a parent example
    const contractFactory = await ethers.getContractFactory('TimeSquadAria');
    const collectionMeta = C.SQUAD_METADATA_ARIA;
    const maxSupply = ethers.MaxUint256;
    const royaltyRecipient = (await ethers.getSigners())[0].address;
    const royaltyPercentageBps = 1000; // 10%
    const baseTokenURI = C.MINT_ENUMERATE_ARIA;

    const args: [string, typeof maxSupply, string, number, string] = [
        collectionMeta,
        maxSupply,
        royaltyRecipient,
        royaltyPercentageBps,
        baseTokenURI,
    ];
    const parentContract = await contractFactory.deploy(...args);
    await parentContract.waitForDeployment();

    // Add an asset to the parent contract
    await parentContract.addAssetEntry("ipfs://QmAssetMetadata");

    // Deploy RMRKTokenAttributesRepository contract
    const attributesRepoFactory = await ethers.getContractFactory('RMRKTokenAttributesRepository');
    const attributesRepoContract = await attributesRepoFactory.deploy();
    await attributesRepoContract.waitForDeployment();

    // Register the collection with the attributes repository
    await attributesRepoContract.registerAccessControl(await parentContract.getAddress(), owner.address, false);

    return { parent: parentContract as TimeSquadAria, attributesRepo: attributesRepoContract as RMRKTokenAttributesRepository, owner };
}

describe('RMRKTokenAttributesRepository Tests', async () => {
    let parent: TimeSquadAria;
    let attributesRepo: RMRKTokenAttributesRepository;
    let owner: any, addr1: any;

    beforeEach(async function () {
        ({ parent, attributesRepo, owner } = await loadFixture(fixtureAttributesRepository));
        [owner, addr1] = await ethers.getSigners();

        // Grant permissions to mint multiple tokens as owner
        await parent.manageContributor(owner.address, true);

        // Mint a token to addr1
        await parent.connect(owner).setPause(false);
        await parent.connect(owner).mint(owner.address);

        // Add the asset to the minted token
        const tokenId = 1;
        //await parent.connect(owner).addAssetToToken(tokenId, 1, 0); // Assuming assetId = 1
        //await parent.connect(owner).acceptAsset(tokenId, 0, 1); // Accepting the asset
    });

    describe('Attributes Management', async function () {
        it('should set and get integer attribute', async function () {
            const tokenId = 1;
            const key = "Strength";
            const value = 100;

            await attributesRepo.setUintAttribute(await parent.getAddress(), tokenId, key, value);
            //await attributesRepo.setUintAttribute(await parent.getAddress(), tokenId, key, value);
            //await attributesRepo.setUintAttribute(await parent.getAddress(), tokenId, key, value);
            //await attributesRepo.setUintAttribute(await parent.getAddress(), tokenId, key, value);
            const attributeValue = await attributesRepo.getIntAttribute(await parent.getAddress(), tokenId, key);
            expect(attributeValue).to.equal(value);
        });

        it('should set and get multiple integer attributes', async function () {
            const tokenId = 1;
            const keys = ["Dungeon01", "Dungeon01"];
            const values = [100, 80];

            const attributes = keys.map((key, index) => ({ key, value: values[index] }));
            await attributesRepo.setUintAttributes([await parent.getAddress()], [tokenId], attributes);

            const retrievedAttributes = await attributesRepo.getIntAttributes([await parent.getAddress()], [tokenId], keys);
            expect(retrievedAttributes).to.deep.equal(values);
        });
    });
});
