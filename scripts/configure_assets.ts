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

import {
  deployManager,
  deployCatalog,
  configureCatalog,
  addAssetsAria,
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
import { exit } from 'process';


async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Addr1:', addr1 ? addr1.address : 'undefined');

  const contractParentAddresses: { [key: string]: string } = {
    "Aria": "0xAEa861Ab8978231a7dB5f5EB82F669Eae12f022A",
    "Luna": "0x767d80957deB3e98908C32EBfa8fd7A7D0f87F99",
    "Ryker": "0x52764789B16db4CDBf29252b738b0A5E42186069",
    "Thaddeus": "0x9DF502168dce8C0E9F8a366A328223f99517e59d"
  };

  const contractCatalogAddresses: { [key: string]: string } = {
    "Aria": "0x8f710aa5629ee2bEa9E7962b9927018945e2103F",
    "Luna": "0x029006e8130c559C007Cab63637D0fD5345A80DF",
    "Ryker": "0xeC56152122C4eeEdf235A83e5D625B6eb093f274",
    "Thaddeus": "0xe85FD0dB024F2B7Eead0d2b81c3F6D5A7f975b16"
  };

  const contractItemAddresses: { [key: string]: string } = {
    "AriaBody": "0xeeAA3220d6996f9601AcF138479B3419eFe07Ab1",
    "AriaHead": "0xEA8DDDEc49fFa7D188018CEFA6A64891ee893363",
    "AriaLeftHand": "0x7C7ad018966EA6fb7D4b13E6158DeE85F6A03f7C",
    "AriaRightHand": "0xCb0335e57d24252911c62DB8A1E2E818Ff0A6dCC",
    "LunaBody": "0x6F4496c1DAAbA04Fb308cAa2F5ABfd4D6dd2cfA7",
    "LunaHead": "0x2B24d1f36139e522f14816C65EBd43eEA58f3527",
    "LunaLeftHand": "0xD89C8e2f9dBD7De2DD87eA84725313Fe4BDe265e",
    "LunaRightHand": "0x37418464BcC64e6A80B6B227C078B9C6fa38E155",
    "RykerBody": "0x7eb0Be602Ec013B2D8344f9dda8887A5Dac77D55",
    "RykerHead": "0xA3610922C166F5CBF901C6De23f9a100A9C446B6",
    "RykerLeftHand": "0xdf40ade78c05cfe9ADF91a2a4442F2899D7143C6",
    "RykerRightHand": "0x6f5a4a778c2F75980e26B27D39Ff936fC85c4e3B",
    "ThaddeusBody": "0x5E9182d691683B5DA16056a0A62eaf5D94E049cE",
    "ThaddeusHead": "0x8B5032010F684e7EB5f36C40Fd0363e18De3d245",
    "ThaddeusLeftHand": "0xdbadCEe6f3063449151f8454a49e9Dc7CFBF3a74",
    "ThaddeusRightHand": "0x7781aA5E216665bc5A644C65c94404F9C891f4ba"
  };


  const timeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt('TimeSquadThaddeus', contractParentAddresses.Thaddeus, deployer);
  const thaddeusLeftHand: ThaddeusLeftHand = await ethers.getContractAt('ThaddeusLeftHand', contractItemAddresses.ThaddeusLeftHand, deployer);
  const catalogThaddeus: RMRKCatalogImpl = await ethers.getContractAt('RMRKCatalogImpl', contractCatalogAddresses.Thaddeus, deployer);




  try {
    const tx00 = await timeSquadThaddeus.totalSupply();
    console.log(`parent totalSupply: ${tx00}`);
    const tx01 = await thaddeusLeftHand.totalSupply();
    console.log(`child totalSupply: ${tx01}`);



    //set primary asset
    /*
    const txChild01_left_hand = await thaddeusLeftHand.addAssetEntry(
      C.THADDEUS_ASSET_METADATA_LEFT_HAND_URI_1,
    );
    await txChild01_left_hand.wait();
    await delay(1000)
    //set secondary asset
    const txChild02_left_hand = await thaddeusLeftHand.addEquippableAssetEntry(
      C.EQUIPPABLE_GROUP_FOR_ITEMS_LEFT_HAND,
      ethers.ZeroAddress,
      C.THADDEUS_ASSET_METADATA_LEFT_HAND_URI_2,
      [],
    );
    await txChild02_left_hand.wait();
    await delay(1000)
*/


readAssetsToToken(thaddeusLeftHand,1n)

    const replacesAssetWithId = 3n;  //quello vecchio da rimpiazzare
    const tokenId = 1;
    const assetId = 1n;


   // await addAssetToChildToken(thaddeusLeftHand, tokenId, assetId, replacesAssetWithId)
    
    
    
    //set approval to all per il parent2

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

    /*
    await setEquippableAddresses(catalogDeployer, [await childDeployer.getAddress()]);
  
    console.log('Deployment complete!');
    await delay(10000);
  
    await mintParentNFT(parentDeployer, deployer.address);
    console.log('Minted parent with id 1');
    await delay(10000);
  
    await setExternalPermission(childDeployer, deployer.address, true);
  
    await mintChildNFT(childDeployer, deployer.address)
    console.log('Minted child with id 1');
    */

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
