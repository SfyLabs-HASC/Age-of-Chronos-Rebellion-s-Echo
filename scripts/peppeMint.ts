import { ethers } from 'ethers';

async function main() {
    const rpcUrl = "https://base-sepolia-rpc.publicnode.com"
    const provider = new ethers.JsonRpcProvider(rpcUrl);  
    const privateKey = '4a50d9777bcc68f5ed3e90d81f784d1fcf6635091208f7c34dc348508e9cafe5';
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const contractAddress = '0x28a147ebE82a64D294D0b2a92c51A487015773B1';
    const abi = [
      // ABI del tuo contratto. Puoi ottenerlo dal compilatore di Solidity o da un servizio come Etherscan.
      "function myFunction() view returns (string)",
      "function setValue(uint256 value)"
    ];
    
    // Crea un'istanza del contratto
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    async function readData() {
      try {
        const data = await contract.totalSupply();
        console.log("totalSupply:", data);
      } catch (error) {
        console.error("Errore nella lettura dei dati:", error);
      }
    }
    
    readData();
    

    //not implemented
    async function writeData(value: any) {
      try {
        const tx = await contract.setValue(value);
        await tx.wait();
        console.log("Transazione completata:", tx.hash);
      } catch (error) {
        console.error("Errore nella scrittura dei dati:", error);
      }
    }
    
    //writeData(42);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
