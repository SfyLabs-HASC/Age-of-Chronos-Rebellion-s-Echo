'use client'

import React, { useState, useEffect } from 'react';
import { ThirdwebProvider, TransactionButton, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient, defineChain, getContract, prepareContractCall, readContract } from 'thirdweb';

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!
});

const myChain = defineChain({
  id: 1284,
  name: 'Moonbeam',
  rpc: 'https://rpc.api.moonbeam.network',
  nativeCurrency: {
    name: 'GLMR',
    symbol: 'GLMR',
    decimals: 18,
  },
  blockExplorers: [
    {
      name: 'Moonscan',
      url: 'https://moonbeam.moonscan.io'
    }
  ]
});

const contractItemAddresses = {
  "AriaLeftHand": "0x9Ea72623340C7420f5cAb670e7a77Cca879ED9bD",
  "LunaLeftHand": "0x1F88d1694372BE1cAe8037888A2A2c22E949bb7d",
  "RykerRightHand": "0x9dB9312A55550B0F6a5fcaAb31F5fBb9Abfbb3Cb",
  "ThaddeusRightHand": "0x7ea2542c69B768747583D90a41cF35916571c15C"
};

const childData = {
  "AriaLeftHand": { assetIds: [BigInt(3), BigInt(4)] },
  "LunaLeftHand": { assetIds: [BigInt(3), BigInt(4)] },
  "RykerRightHand": { assetIds: [BigInt(7), BigInt(8)] },
  "ThaddeusRightHand": { assetIds: [BigInt(3), BigInt(4)] }
};

async function hasPermission(contract: any, address: string) {
  const permission = await readContract({
    contract,
    method: "function hasExternalPermission(address) view returns (bool)",
    params: [address]
  });
  return permission;
}

const MintChild: React.FC = () => {
  const [contract, setContract] = useState<any>(null);
  const [hasMintPermission, setHasMintPermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<keyof typeof contractItemAddresses | null>(null);
  const account = useActiveAccount();

  useEffect(() => {
    async function checkPermissions() {
      if (account) {
        for (const key in contractItemAddresses) {
          if (contractItemAddresses.hasOwnProperty(key)) {
            const contractInstance = await getContract({
              client,
              chain: myChain,
              address: contractItemAddresses[key],
              abi: [
                {
                  "constant": true,
                  "inputs": [{ "name": "owner", "type": "address" }],
                  "name": "balanceOf",
                  "outputs": [{ "name": "", "type": "uint256" }],
                  "payable": false,
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "constant": true,
                  "inputs": [{ "name": "owner", "type": "address" }],
                  "name": "hasExternalPermission",
                  "outputs": [{ "name": "", "type": "bool" }],
                  "payable": false,
                  "stateMutability": "view",
                  "type": "function"
                }
              ],
            });
            const permission = await hasPermission(contractInstance, account.address);
            if (permission) {
              setSelectedChild(key as keyof typeof contractItemAddresses);
              setHasMintPermission(true);
              setContract(contractInstance);
              break;
            }
          }
        }
      }
      setLoading(false);
    }
    checkPermissions();
  }, [account]);

  const handleTransaction = async () => {
    if (selectedChild && contract && account) {
      const tx = await prepareContractCall({
        contract,
        method: "function mintWithAssets(address to, uint64[] memory assetIds)",
        params: [account.address, childData[selectedChild].assetIds],
      });
      if (tx) {
        return tx;
      }
    }
    throw new Error("Failed to prepare transaction");
  };

  const handleTransactionSent = (result: any) => {
    console.log("Transaction submitted", result.transactionHash);
  };

  const handleTransactionConfirmed = (receipt: any) => {
    console.log("Transaction confirmed", receipt.transactionHash);
    setLoading(false);
  };

  const handleError = (error: any) => {
    console.error("Transaction error", error);
    setLoading(false);
  };

  if (loading) {
    return <div className="aoc_panel">...Loading</div>;
  }

  return (
    <ThirdwebProvider>
      {hasMintPermission && selectedChild ? (
        <TransactionButton
          transaction={handleTransaction}
          onTransactionSent={handleTransactionSent}
          onTransactionConfirmed={handleTransactionConfirmed}
          onError={handleError}
          disabled={!account || loading}
          unstyled
        >
          <span>{loading ? 'Loading' : 'Mint Child'}</span>
        </TransactionButton>
      ) : (
        <div className="aoc_panel">
          <p className="no-permission">You do not have permission to mint any child.</p>
        </div>
      )}
    </ThirdwebProvider>
  );
};

export default MintChild;
