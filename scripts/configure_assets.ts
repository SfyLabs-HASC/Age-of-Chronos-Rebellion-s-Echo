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
    "Aria": "0x28a147ebE82a64D294D0b2a92c51A487015773B1",
    "Luna": "0x5F0e041A5c039c2A83a00d85e487E6Cf066f4CEF",
    "Ryker": "0xAe6Ab9Bb9704ec017cb28F990f6a76a54D3104ce",
    "Thaddeus": "0x2472Ea2ddC078661b2f8b24A3468c65617d43530"
  };

  const contractCatalogAddresses: { [key: string]: string } = {
    "Aria": "0xfBBdF276bE2f8Eb35095a246de5003B56049b764",
    "Luna": "0x8f116f4f7c57963D9c6bCb08EFE8686A51c056d4",
    "Ryker": "0x1e6a9268c4f04e22470055884d85035cB31d6F6f",
    "Thaddeus": "0x78FD9Fc35E2D3D7d83227AE6340A18bC6957F59f"
  };

  const contractItemAddresses: { [key: string]: string } = {
    "AriaBody": "0xBd1fBdd38511566ab78b416BD92300895365858e",
    "AriaHead": "0x6992a197339b156A5a053D1cb05FC5ee430E9b0B",
    "AriaLeftHand": "0x136dfE210d76BF27D766E912204B2C02B0D4763C",
    "AriaRightHand": "0x1E8D331e9Ef55DA578E777A09388f7BcFa53c8D9",
    "LunaBody": "0x7898Fb1FCc5E3d7e12117f0A00407ae9818D0773",
    "LunaHead": "0x135498D46CD14081fF1bc3c67D0b5ff0ea12CCC7",
    "LunaLeftHand": "0x6f9160f98cA62105d33013E141A751FeD4E9A0AB",
    "LunaRightHand": "0x138e361b67D3FF9E191748f7a529De613dF6d9D8",
    "RykerBody": "0x3a4e805B6c2228A910F8b738AD9Ff1B7Bb1a8a6C",
    "RykerHead": "0x370BF465f388a829A34f2796077AB039CC9b4BB3",
    "RykerLeftHand": "0xD8aF19C961a3f9C5768Fe445D1E8Dbcf4Ea03d27",
    "RykerRightHand": "0xF5Ae527B0449859b24F7E4Dc307de27d258CE1CC",
    "ThaddeusBody": "0xdCead27F36c95cAfC337B3430Aa6C7420C3455A1",
    "ThaddeusHead": "0xbc488546E62Cd867eb2663a81d39A4258a35C5b0",
    "ThaddeusLeftHand": "0x2708B281Ee2fC2eBaca1Ec119da2532F5175d3e6",
    "ThaddeusRightHand": "0xb3A26D87103FE414c6d74AF77fb59c3574Eac916"
  };




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

    await mintParentNFT(timeSquadAria, deployer.address);
    await delay(1000);
    await mintParentNFT(timeSquadLuna, deployer.address);
    await delay(1000);
    await mintParentNFT(timeSquadRyker, deployer.address);
    await delay(1000);
    await mintParentNFT(timeSquadThaddeus, deployer.address);

    
    let lol = await timeSquadThaddeus.isContributor(deployer);
    console.log(lol)
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
      const collectionMeta =;
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
