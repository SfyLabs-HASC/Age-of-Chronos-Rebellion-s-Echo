import { ethers } from 'hardhat';
import { getManager } from './utils';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Running with the account:', deployer.address);
  const manager = await getManager();

  //   let tx = await manager.payFee(81, 158, 78, 58, { value: ethers.parseEther('0.1') });
  //   let tx = await manager.payFee(81, 158, 78, 58, { value: ethers.parseEther('0.1') });
  //   await tx.wait();
  //   let tx = await manager.startMission(1, 81, 158, 78, 58);
  //   await tx.wait();
  //   let tx = await manager.endMission(1, 81, 158, 78, 58, { gasLimit: 1000000 });
  let tx = await manager.setLevelAttribute('NomindioLabs');
  await tx.wait();
  console.log('level attribute set');
  let tx2 = await manager.endMission(1, 81, 158, 78, 58);
  await tx2.wait();
  //   console.log('Script complete!');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
