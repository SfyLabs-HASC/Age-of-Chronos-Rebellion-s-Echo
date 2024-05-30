'use client'

import React, { useState, useEffect } from 'react';
import { ThirdwebProvider, TransactionButton, useActiveWallet,useActiveAccount } from "thirdweb/react";
import { createThirdwebClient, defineChain, getAddress, getContract, prepareContractCall } from 'thirdweb';

const client = createThirdwebClient({
  clientId: '258f6a7e272e3b6e74b8ad1d24ad1343'
});

const myChain = defineChain({
  id: 84532,
  rpc: 'https://sepolia.base.org'
});

const contractAddress = '0x28a147ebE82a64D294D0b2a92c51A487015773B1';


function Fdas() {
    const [contract, setContract] = useState<any>(null);
  const  wallet  = useActiveWallet();
  const  account  = useActiveAccount();


  useEffect(() => {
    async function fetchContract() {
      const contractInstance = await getContract({
        client,
        chain: myChain,
        address: contractAddress,
        abi: [], 
      });
      setContract(contractInstance);
    }
    fetchContract();
  }, []);

  return (
    <ThirdwebProvider>
      {contract && account &&  (
        <TransactionButton
          transaction={async () => {
            
            const tx:any = prepareContractCall({
              contract,
              method: "function mint(address to)",
              params: [account.address],
            });
            return tx;
          }}
          onTransactionSent={(result) => {
            console.log("Transaction submitted", result.transactionHash);
          }}
          onTransactionConfirmed={(receipt) => {
            console.log("Transaction confirmed", receipt.transactionHash);
          }}
          onError={(error) => {
            console.error("Transaction error", error);
          }}
        >
          Confirm Transaction
        </TransactionButton>
      )}
    </ThirdwebProvider>
  );
}

export default Fdas;