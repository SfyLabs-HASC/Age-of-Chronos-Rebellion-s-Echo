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
    "Aria": "0x0F2B21fB5a7962514B096f0dcE3F63eFA39C8eCA",
    "Luna": "0xf0d796f441E507a2ba2d61e15962FEE158509480",
    "Ryker": "0x2Bc097c8DAB92c919df5Ed2B7cCA537F82986c3D",
    "Thaddeus": "0x30322852C1FefA02c193857020C3eB2a8C33B353"
};

const contractCatalogAddresses: { [key: string]: string } = {
    "Aria": "0x0DEe06949C82f46BbD690e61e5bA275C32bfc096",
    "Luna": "0xD9eC22408583C8DB42293925d2a6a8626E7613aC",
    "Ryker": "0x7c6aB4C302C8352D683287832fd0Fb99153fE45A",
    "Thaddeus": "0xf8d5102161C591414c6B9acC0e54E4155601F6b5"
};

const contractItemAddresses: { [key: string]: string } = {
    "AriaBody": "0x14A4d3c92aec0Ab53f154057A4B2148137c79A26",
    "AriaHead": "0xdBea828CF560738D7B922218861E03ED73bCeABB",
    "AriaLeftHand": "0xC20c3672F40D545786D31D2ae966ed712477B02f",
    "AriaRightHand": "0xdCd840aFf89526EE31A183e27e93d8954E98D8A8",
    "LunaBody": "0xE12B4Dc9b985fbaE8748A3f452eCE0dd6DB7301C",
    "LunaHead": "0x0ca86c4bC47aB78cf411630fC301F2Bc7eB46caa",
    "LunaLeftHand": "0x3f58224BB8cA05bE9b070CfE6383D46c0b6F171F",
    "LunaRightHand": "0xcA810487f9aBDAF98bbD0a0e8ba394e77E9A2938",
    "RykerBody": "0xB554326eB0934C04770076A61d72debB2B2e6f19",
    "RykerHead": "0x360830DBef63c855E830A7B3cf29aC4A524956c3",
    "RykerLeftHand": "0x3a4707bc852d7723260f440e4fF0B4b122d12fc2",
    "RykerRightHand": "0xaEC1CC130a96d099D9f7bbd07Fe9964409D7C0F2",
    "ThaddeusBody": "0x46e4a74faC7D62ACa01b554C3851E29920c0ECe8",
    "ThaddeusHead": "0x0d3346f7D4BAf9689ED45021A3E15d0c453B0644",
    "ThaddeusLeftHand": "0x74870BB1DC6DEE7C42bffB961AB06D4053B008B7",
    "ThaddeusRightHand": "0x44bE0f82B1A1b175DC265f599dea847832A25f6c"
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
