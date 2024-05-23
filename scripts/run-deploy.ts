import { ethers, run, network } from 'hardhat';
import {
  ParentSample,
  ChildSample,
  AgeOfChronosManager,
  RMRKCatalogImpl
} from '../typechain-types';
import { delay, isHardhatNetwork } from './utils';
import {
  deployParent,
  deployChild,
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
  readAssets,
  addAssetToChildToken,
  configureManager
} from './utilsFunctions';
import * as C from './constants';

async function main() {
  const [deployer, addr1,addr2] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('Addr1:', addr1 ? addr1.address : 'undefined');
  console.log('Addr2:', addr2 ? addr2.address : 'undefined');

  const TimeSquadAria = await deployParent('TimeSquadAria',C.SQUAD_METADATA_ARIA,C.MINT_ENUMERATE_ARIA);
  const TimeSquadLuna = await deployParent('TimeSquadLuna',C.SQUAD_METADATA_LUNA,C.MINT_ENUMERATE_LUNA);
  const TimeSquadRyker = await deployParent('TimeSquadRyker',C.SQUAD_METADATA_RYKER,C.MINT_ENUMERATE_RYKER);
  const TimeSquadThaddeus = await deployParent('TimeSquadThaddeus',C.SQUAD_METADATA_THADDEUS,C.MINT_ENUMERATE_THADDEUS);
  await delay(10000)
  const ariaBody = await deployCHILD();

  const manager = await deployManager();
  const catalog = await deployCatalog();

  await configureManager(parent, child, catalog, manager);

  await configureCatalog(catalog, await child.getAddress());
  await addAssets(parent, child, catalog);


  const tx01 = await parent.setAutoAcceptCollection(await child.getAddress(), true);
  await tx01.wait();

  //await readAssets(parent, child, catalog)

  //await delay(10000)

  await setEquippableAddresses(catalog, [await child.getAddress()]);

  console.log('Deployment complete!');
  await delay(10000);

  await mintParentNFT(parent, deployer.address);
  console.log('Minted parent with id 1');
  await delay(10000);

  await setExternalPermission(child, deployer.address, true);

  await mintChildNFT(child, deployer.address)
  console.log('Minted child with id 1');
  /*
  const assetIds = [1];
  const txchild = await child.mintWithAssets(deployer.address, assetIds);
  await txchild.wait();

  
  const tokenId = 1;
  const assetId=2n;
  const replacesAssetWithId=0n;
  await addAssetToChildToken(child, tokenId, assetId, replacesAssetWithId)  
*/

  console.log(" fine")
  /*
  //await setExternalPermission(child, deployer.address, true);
  const assetIds02 = [1,2];
  const txchild2 = await child.nestMint(await parent.getAddress(),parentId01, assetIds02);
  await txchild2.wait();
  console.log('Minted child with id 2');
*/
  // Esegui il nest transfer del Child al Parent
  //await addAssetToChildToken(child, 1, 2n, 0n)
  //await nestTransferChildToParent(parent, child, 1, 1, deployer.address);  // Assumi che sia il token ID 1 per entrambi

  //await verifyEquippableStatus(catalog, await child.getAddress(), 1000n);
  //await delay(1000)
  //await equipChildOnParent(parent, 1, 1, 1000);
  //await verifyEquippableStatus(catalog, await child.getAddress(), 1000n);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
