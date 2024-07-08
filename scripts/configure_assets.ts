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
  const [deployer, addr1, addr2, addr044] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Addr1:', addr1 ? addr1.address : 'undefined');
  console.log('Addr2:', addr2 ? addr2.address : 'undefined');
  console.log('addr044:', addr044 ? addr044.address : 'undefined');

  const contractParentAddresses: { [key: string]: string } = {
    "Aria": "0xB594ff9BF060FE2fbb45f2eC528676856D8Da511",
    "Luna": "0xA8c3Cd7F534E6cA415F2978097885B9C6c5C749C",
    "Ryker": "0x53a2ee42506939bcEf2a9bf69097Ac7616D4AA66",
    "Thaddeus": "0x55A7dd722eAAb2e8Becd08b54b9f2cB79755a059"
  };

  const contractCatalogAddresses: { [key: string]: string } = {
    "Aria": "0x8E4773ff3Cb94E78cA44ed0E5aA0844033B462db",
    "Luna": "0xa4DdF7045925e96acfBe5d789A5994D07eb56a1D",
    "Ryker": "0x49827CF9ac8c00bf13dE240aF5211401D448e133",
    "Thaddeus": "0x3025CB69FaD0Eb26aB6F90DC01b02B31048f1Bf1"
  };

  const contractItemAddresses = {
    "AriaBody": "0x20D730B01ff9749b76e21D865128Da1B3Fe64392",
    "AriaHead": "0x24ec16B0A24554c857C5D58bF1f4BBE556f6D6A1",
    "AriaLeftHand": "0x962ac89d6DeF62E09e0e6BAE6a981b8A4536E6b5",
    "AriaRightHand": "0xF616d4c889654D81BBaA388D2c6fb1CA54Eea25E",

    "LunaBody": "0x07a2016536cc594ADca5CfF95A77aE6AdEbA8E83",
    "LunaHead": "0xceBA956B5C38E12330552C73dd8e718572541F07",
    "LunaLeftHand": "0x99Ccc376D152504f673b7D7D5875A1C30F43F987",
    "LunaRightHand": "0xf09484859C3750Ec880eC6349D1D021881c183bc",

    "RykerBody": "0xba228c1500912deE060227C5E9376800caefFbF9",
    "RykerHead": "0xA63dd6aC8E22FA4d09e81680168aBeF95fC97B46",
    "RykerLeftHand": "0x0A4e95b961ecB2E0c8212933966cc2609C33bb1C",
    "RykerRightHand": "0xebb8D47B02040131fCeB371C87948ade9c20e613",

    "ThaddeusBody": "0x7beb49b806Dc8F5c07d93aFE2c99c248CeA156Fb",
    "ThaddeusHead": "0x920334512979058ea29594e65212E3E641f9e66a",
    "ThaddeusLeftHand": "0x189457A1Be8f89D84aD24dE400B5748c8A825Af4",
    "ThaddeusRightHand": "0xfd68e0eEb4Ad3fA20A6BFcf1ffCf718AB65F677F"
  };

  const managerAddress: string = "0x7ccDc0BCaf6d3B4787Fd39e96587eEb1B384986d";
  const TOKEN_ATTRIBUTES_REPOSITORY_ADDRESS_DRAFT_MOONBASE =
    '0xE5CF7218253535E019bb4B38Fb9d0167BB6D049e';
  const vicedirettoreAddress = "0x93e7b1f3fA8f57425B8a80337D94Ae3992879911";



  const timeSquadAria: TimeSquadAria = await ethers.getContractAt('TimeSquadAria', contractParentAddresses.Aria, addr044);
  const timeSquadLuna: TimeSquadLuna = await ethers.getContractAt('TimeSquadLuna', contractParentAddresses.Luna, addr044);
  const timeSquadRyker: TimeSquadRyker = await ethers.getContractAt('TimeSquadRyker', contractParentAddresses.Ryker, addr044);
  const timeSquadThaddeus: TimeSquadThaddeus = await ethers.getContractAt('TimeSquadThaddeus', contractParentAddresses.Thaddeus, addr044);




  try {
    const tx00 = await timeSquadThaddeus.totalSupply();
    console.log(`parent totalSupply: ${tx00}`);
/*
    // Ensure approvals
    await ensureApproval(timeSquadAria, deployer, 1, "0x9bc3b51B229e0664dd48B2275f6580f973Dca044");
    await ensureApproval(timeSquadLuna, deployer, 1, "0x9bc3b51B229e0664dd48B2275f6580f973Dca044");
    await ensureApproval(timeSquadRyker, deployer, 1, "0x9bc3b51B229e0664dd48B2275f6580f973Dca044");
    await ensureApproval(timeSquadThaddeus, deployer, 1, "0x9bc3b51B229e0664dd48B2275f6580f973Dca044");

//manca il soulbound!!!!!!

    const tx02 = await timeSquadAria.transferFrom(deployer.address, "0x9bc3b51B229e0664dd48B2275f6580f973Dca044", 1);
    await tx02.wait();
    await delay(2000);
    const tx03 = await timeSquadLuna.transferFrom(deployer.address, "0x9bc3b51B229e0664dd48B2275f6580f973Dca044", 1);
    await tx03.wait();
    await delay(2000);
    const tx04 = await timeSquadRyker.transferFrom(deployer.address, "0x9bc3b51B229e0664dd48B2275f6580f973Dca044", 1);
    await tx04.wait();
    await delay(2000);
    const tx05 = await timeSquadThaddeus.transferFrom(deployer.address, "0x9bc3b51B229e0664dd48B2275f6580f973Dca044", 1);
    await tx05.wait();
*/


//const tx02 = await timeSquadAria.mint("0x9bc3b51B229e0664dd48B2275f6580f973Dca044");
//await tx02.wait();
//await delay(2000);
const tx03 = await timeSquadLuna.mint("0x9bc3b51B229e0664dd48B2275f6580f973Dca044");
await tx03.wait();
await delay(2000);
const tx04 = await timeSquadRyker.mint("0x9bc3b51B229e0664dd48B2275f6580f973Dca044");
await tx04.wait();
await delay(2000);
const tx05 = await timeSquadThaddeus.mint("0x9bc3b51B229e0664dd48B2275f6580f973Dca044");
await tx05.wait();


    async function ensureApproval(contract: any, owner: any, tokenId: number, recipient: string) {
      const approvedAddress = await contract.getApproved(tokenId);
      console.log(`Approved address for token ID ${tokenId}: ${approvedAddress}`);
    
      const isApprovedForAll = await contract.isApprovedForAll(owner.address, recipient);
      console.log(`Is approved for all: ${isApprovedForAll}`);
    
      if (approvedAddress !== recipient && !isApprovedForAll) {
        console.log(`Approving ${recipient} to transfer token ID ${tokenId}`);
        const tx = await contract.approve(recipient, tokenId);
        await tx.wait();
      }
    }


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


    //const replacesAssetWithId = 3n;  //quello vecchio da rimpiazzare
    //const tokenId = 1;
    //const assetId = 1n;


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


    /*
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
                      */
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
