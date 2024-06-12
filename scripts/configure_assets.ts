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
  console.log('Addr2:', addr2 ? addr2.address : 'undefined');

  const contractParentAddresses = {
      "Aria": "0x28E6bB44976A8CbdF32a826bf2b0F3C83827fBB4",
      "Luna": "0x713bDF77C02342c975ad16fcA41d923dea3D03B7",
      "Ryker": "0xa9f2E818A524b51900bc517A6EC97b27C7167F79",
      "Thaddeus": "0x44700E473182dC3ff512b98424fCd397634BE4EF"
  };

  const contractCatalogAddresses = {
      "Aria": "0x5D1A13A03b03c8A6183503f901C06676240DA6a3",
      "Luna": "0x7C50A1160E0d0B50c6BF302E4b7F90886654947D",
      "Ryker": "0xc16ee43a79beAcD8811729752EBE77ED9E0D43b3",
      "Thaddeus": "0x6b4318B1a0afEBA0263300488c42B2AE13a138A9"
  };

  const contractItemAddresses = {
      "AriaBody": "0xcDAC21a0396FCb696284d7e27e5c420A9002559a",
      "AriaHead": "0xBa8A397438F00b04840c7043f050cD7d57E01AA9",
      "AriaLeftHand": "0xA595b26ea43B69138e7498e2051453890031c16a",
      "AriaRightHand": "0xB4bD56aF329d9619E5912E22EE68299EA5e2d160",
      "LunaBody": "0x5b3927B951Ac8c13143EBb060fAA919A8192B08e",
      "LunaHead": "0x91de5daf1577f4b71624e62C4c4497678b403AE0",
      "LunaLeftHand": "0x09263E4a5e7FDA64eF3CE940221D11c56D8c2579",
      "LunaRightHand": "0x77E1bbA48Fa7Da070a3c070A5d082e5854a4aBF3",
      "RykerBody": "0x0AC928c0435FE8e884cb0385D26A828CAFa7d8dC",
      "RykerHead": "0x963eEC4B9330DdD594Bb064db30Ea2D03EfaB5Ac",
      "RykerLeftHand": "0x3f7Df31f787c07C8101c7be8C6916785aC5A3f61",
      "RykerRightHand": "0x804bC6FeA5b94e12c9ea82d4d79cc7E21C27727c",
      "ThaddeusBody": "0x14F448e072A0Bb30fB96a4cF402DE8179beAEC0D",
      "ThaddeusHead": "0xEd98Bd5D6Cff12472142bd553e300E044dde8Fbb",
      "ThaddeusLeftHand": "0x7C069383b7f0B54A8de1EEb395eb719545fD8F21",
      "ThaddeusRightHand": "0x78D5Ff1017d276E9397ab888F635B50937760fB7"
  };

const managerAddress: string = "0x77107E792C3a3bB0A05E27c141182B67Dc411baB";



  const timeSquadAria: TimeSquadAria = await ethers.getContractAt('TimeSquadAria', contractParentAddresses.Aria, deployer);
  const timeSquadLuna: TimeSquadLuna = await ethers.getContractAt('TimeSquadLuna', contractParentAddresses.Luna, deployer);
  const timeSquadRyker: TimeSquadRyker = await ethers.getContractAt('TimeSquadRyker', contractParentAddresses.Ryker, deployer);
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


    //readAssetsToToken(thaddeusLeftHand,1n)

    const replacesAssetWithId = 3n;  //quello vecchio da rimpiazzare
    const tokenId = 1;
    const assetId = 1n;


    // await addAssetToChildToken(thaddeusLeftHand, tokenId, assetId, replacesAssetWithId)
/*
    let lol2 = await timeSquadAria.manageContributor(deployer, true);
    lol2 = await timeSquadLuna.manageContributor(deployer, true);
    lol2 = await timeSquadRyker.manageContributor(deployer, true);
    lol2 = await timeSquadThaddeus.manageContributor(deployer, true);
    await delay(10000)
*/
/*
    await mintParentNFT(timeSquadAria, deployer.address);
    await delay(1000);
    await mintParentNFT(timeSquadLuna, deployer.address);
    await delay(1000);
    await mintParentNFT(timeSquadRyker, deployer.address);
    await delay(1000);
    await mintParentNFT(timeSquadThaddeus, deployer.address);

    
    let lol = await timeSquadThaddeus.isContributor(deployer);
    console.log(lol)

    */
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
        const collectionMeta = C.SQUAD_METADATA_ARIA;
        const maxSupply = ethers.MaxUint256;
        const royaltyRecipient = (await ethers.getSigners())[0].address;
        const royaltyPercentageBps = 1000; // 10%
        const baseTokenURI = C.MINT_ENUMERATE_ARIA;
    
        const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps, baseTokenURI] as const;
          //console.log('Waiting 10 seconds before verifying contract...');
          //await delay(10000);
          await run('verify:verify', {
            address: contractParentAddresses.Aria,
            constructorArguments: args,
            contract: 'contracts/parent/TimeSquadAria.sol:TimeSquadAria',
          });
        }

        if (!isHardhatNetwork()) {
          const collectionMeta = C.SQUAD_METADATA_LUNA;
          const maxSupply = ethers.MaxUint256;
          const royaltyRecipient = (await ethers.getSigners())[0].address;
          const royaltyPercentageBps = 1000; // 10%
          const baseTokenURI = C.MINT_ENUMERATE_LUNA;
      
          const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps, baseTokenURI] as const;
            console.log('Waiting 10 seconds before verifying contract...');
            await delay(10000);
            await run('verify:verify', {
              address: contractParentAddresses.Luna,
              constructorArguments: args,
              contract: 'contracts/parent/TimeSquadLuna.sol:TimeSquadLuna',
            });
          }

          if (!isHardhatNetwork()) {
            const collectionMeta = C.SQUAD_METADATA_RYKER;
            const maxSupply = ethers.MaxUint256;
            const royaltyRecipient = (await ethers.getSigners())[0].address;
            const royaltyPercentageBps = 1000; // 10%
            const baseTokenURI = C.MINT_ENUMERATE_RYKER;
        
            const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps, baseTokenURI] as const;
              console.log('Waiting 10 seconds before verifying contract...');
              await delay(10000);
              await run('verify:verify', {
                address: contractParentAddresses.Ryker,
                constructorArguments: args,
                contract: 'contracts/parent/TimeSquadRyker.sol:TimeSquadRyker',
              });
            }

            if (!isHardhatNetwork()) {
              const collectionMeta = C.SQUAD_METADATA_THADDEUS;
              const maxSupply = ethers.MaxUint256;
              const royaltyRecipient = (await ethers.getSigners())[0].address;
              const royaltyPercentageBps = 1000; // 10%
              const baseTokenURI = C.MINT_ENUMERATE_THADDEUS;
          
              const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps, baseTokenURI] as const;
                console.log('Waiting 10 seconds before verifying contract...');
                await delay(10000);
                await run('verify:verify', {
                  address: contractParentAddresses.Thaddeus,
                  constructorArguments: args,
                  contract: 'contracts/parent/TimeSquadThaddeus.sol:TimeSquadThaddeus',
                });
              }
*/
              if (!isHardhatNetwork()) {
                const collectionMeta = C.SQUAD_ITEM_METADATA_RYKER_LEFT_HAND;
                const maxSupply = ethers.MaxUint256;
                const royaltyRecipient = (await ethers.getSigners())[0].address;
                const royaltyPercentageBps = 1000; // 10%
            
                const args = [collectionMeta, maxSupply, royaltyRecipient, royaltyPercentageBps] as const;
                  console.log('Waiting 10 seconds before verifying contract...');
                  await delay(10000);
                  await run('verify:verify', {
                    address: contractItemAddresses.rykerLeftHand,
                    constructorArguments: args,
                    contract: 'contracts/parent/RykerLeftHand.sol:RykerLeftHand',
                  });
                }
/*
        if (!isHardhatNetwork()) {
     
          const args = [] as const;
            console.log('Waiting 10 seconds before verifying contract...');
            await delay(10000);
            await run('verify:verify', {
              address: managerAddress,
              constructorArguments: args,
              contract: 'contracts/parent/AgeOfChronosManager.sol:AgeOfChronosManager',
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
