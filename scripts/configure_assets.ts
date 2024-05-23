import { ethers, run } from 'hardhat';
import { ParentSample, ChildSample, RMRKCatalogImpl } from '../typechain-types';
import {
  deployxPARENTx,
  deployCHILD,
  deployManager,
  deployCatalog,
  configureCatalog,
  addAssets,
  setEquippableAddresses,
  setExternalPermission,
  nestTransferChildToParent,
  verifyEquippableStatus,
  equipChildOnParent,
  mintParentNFT,
  mintChildNFT,
  removeSoulbound,
  debugEquippableStatus,
  readAssets,
  addAssetToChildToken,
  readAssetsToToken,
  setValidParentForEquippableGroupMain,
  checkEquipConditions,
  getPartDetails
} from './utilsFunctions';
import { delay, isHardhatNetwork } from './utils';
import * as C from './constants';
async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Addr1:', addr1 ? addr1.address : 'undefined');

  const contractAddresses = {
    parent: '0x86b3A13928cadc2b25a632f856c4F6633d97214D',
    child: '0xd9A2052C431136D9D7e74bCD744F4d393acc04FE',
    manager: '0xB6C40De3f62CA1f77623Ae0C5a3dd83836A24D7D',
    catalog: '0x6b8715023e3F451Fa759148B630D5E8296A4b7B3'
  };

  const parentDeployer: ParentSample = await ethers.getContractAt('ParentSample', contractAddresses.parent, deployer);
  const childDeployer: ChildSample = await ethers.getContractAt('ChildSample', contractAddresses.child, deployer);
  const catalogDeployer: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractAddresses.catalog, deployer);

  try {
    const tx00 = await parentDeployer.totalSupply();
    console.log(`old parent totalSupply: ${tx00}`);
    const tx01 = await childDeployer.totalSupply();
    console.log(`ole child totalSupply: ${tx01}`);

    // Uncomment these lines if needed
    // await mintParentNFT(parent, deployer.address);
    
    //await setExternalPermission(child, deployer.address, true);
    //await mintChildNFT(child, deployer.address);
    
    //await setEquippableAddresses(catalog, [contractAddresses.child]);

    //await nestTransferChildToParent(parent, child, 1, 1, deployer.address);  // Assumi che sia il token ID 1 per entrambi
    
    //await readAssets(parent,child,catalog)
    //await verifyEquippableStatus(catalog, await child.getAddress(), 1000n);
    //await delay(1000)
    //await setValidParentForEquippableGroupMain(child, 1000n, contractAddresses.parent, 1000n);
    //await addAssetToChildToken(child, 1, 2n, 0n)
    //console.log("siamo qui")
    //await delay(2000)

  // Chiamata alla funzione di debug
  /*
  await catalog.addPart({
    partId: 1000,
    part: {
      itemType: 1n,  // Assumi che SLOT_PART_TYPE sia una costante definita
      z: 1,
      equippable: [await child.getAddress()],
      metadataURI: 'ipfs://QmbApj6iR4navxxNwdq3fFjvsTWZEtq4aXPwUhyYcVywwc'
    }
  });




*/

  //await getPartDetails(catalog,1000n)
  //await catalog.setEquippableAddresses(1000, [await child.getAddress()]);  // Setta indirizzi equipaggiabili

  //await child.setValidParentForEquippableGroup(1000, await parent.getAddress(), 1000);  // Setta il parent valido
  //await delay(2000)
  //await checkEquipConditions(child, parent, catalog, 1, 1, 1000);
  
  await setEquippableAddresses(catalogDeployer, [await childDeployer.getAddress()]);

  console.log('Deployment complete!');
  await delay(10000);

  await mintParentNFT(parentDeployer, deployer.address);
  console.log('Minted parent with id 1');
  await delay(10000);

  await setExternalPermission(childDeployer, deployer.address, true);

  await mintChildNFT(childDeployer, deployer.address)
  console.log('Minted child with id 1');

  /*
  const parentAddr1: ParentSample = await ethers.getContractAt('ParentSample', contractAddresses.parent, addr1);
  const childAddr1: ChildSample = await ethers.getContractAt('ChildSample', contractAddresses.child, addr1);
  
  
  
  let tx = await parentAddr1.mint(addr1.address);
  await tx.wait();
  await delay(1000)


  const newTotalSupplyParent = await parentDeployer.totalSupply();
  console.log(`New minted parent totalSupply: ${newTotalSupplyParent}`);



  let parentId = newTotalSupplyParent;
  let assetIds = [1n];  //se metti di piu è un bordello

  tx = await childDeployer.setExternalPermission(addr1.address, true);
   await tx.wait();
   await delay(3000)
   //console.log("tutto ok",tx)



  tx = await childAddr1.nestMint(await parentAddr1.getAddress(), parentId, assetIds);
    await tx.wait();
  await delay(3000)
  console.log("mintato")



  const newTotalSupplyChild = await childAddr1.totalSupply();
  console.log(`New minted parent totalSupply: ${newTotalSupplyChild}`);

  console.log('Minted 3 cores to cube with id 1');
  await delay(1000)

  const tokenId = newTotalSupplyChild+1n;
  const assetId=2n;
  const replacesAssetWithId=0n;
  await addAssetToChildToken(childDeployer, tokenId, assetId, replacesAssetWithId)
  //set approval to all per il parent2

  */


/*
if (!isHardhatNetwork()) {
  const collectionMeta = 'ipfs://QmdobALccC5sUCw8CqYPdCKxDoe1AQDt5zQst9SbrWs1hF';
    const maxSupply = ethers.MaxUint256;
    const royaltyRecipient = (await ethers.getSigners())[0].address;
    const royaltyPercentageBps = 1000; // 10%
    const baseTokenURI = C.MINT_ENUMERATE_PARENT;

    const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps, baseTokenURI] as const;
      //console.log('Waiting 10 seconds before verifying contract...');
      //await delay(10000);
      await run('verify:verify', {
        address: '0x264D52c0873977C9F6dea695da9b99F7D09EdfDe',
        constructorArguments: args,
        contract: 'contracts/parent/ParentSample.sol:ParentSample',
      });
    }
  */

  /*
  const tokenId = 1;
  const assetId = 1;
  const slotId = 1000;
  const canEquip = await child.canTokenBeEquippedWithAssetIntoSlot(contractAddresses.parent, tokenId, assetId, slotId);
  console.log(`Può equipaggiare: ${canEquip}`);
*/
    //await readAssetsToToken(child, 1)
    //await equipChildOnParent(parent, 1, 1, 1000);
    //await verifyEquippableStatus(catalog, await child.getAddress(), 1000n);
    //await removeSoulbound(parent, 1); // Add the function call to remove the soulbound attribute from token ID 1
    //await debugEquippableStatus(parent, catalog, child, contractAddresses.child, 1000n, 1, 1, 1000);

  } catch (error) {
    console.error('Error during contract interaction:', error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
