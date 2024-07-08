// src/app/SubmitData.tsx
'use client';
import React, { useState } from 'react';
import { useActiveAccount, useSendTransaction, TransactionButton, ThirdwebProvider } from 'thirdweb/react';

import { createThirdwebClient, defineChain, getContract, prepareContractCall, prepareTransaction, toWei } from 'thirdweb';

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!
});

const myChain = defineChain({
  id: 1287,
  name: 'MoonbaseAlpha',
  rpc: 'https://rpc.testnet.moonbeam.network',
  nativeCurrency: {
    name: 'DEV',
    symbol: 'DEV',
    decimals: 18,
  },
  blockExplorers: [
    {
      name: 'Moonscan',
      url: 'https://moonbase.moonscan.io'
    }
  ]
});

const contractManagerAddress = '0x7ccDc0BCaf6d3B4787Fd39e96587eEb1B384986d';

const SubmitData: React.FC = () => {
  const [solidityFunction, setSolidityFunction] = useState('');
  const [rykerTokenId, setRykerTokenId] = useState('');
  const [lunaTokenId, setLunaTokenId] = useState('');
  const [ariaTokenId, setAriaTokenId] = useState('');
  const [thaddeusTokenId, setThaddeusTokenId] = useState('');
  const [key, setKey] = useState('');
  const [response, setResponse] = useState(null);

  const activeAccount = useActiveAccount();

  const [loading, setLoading] = useState(false);

  async function sendData(endpoint: string) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ solidityFunction, rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, key })
    });

    const result = await response.json();
    setResponse(result);
  }

  async function preparePayFeeTransaction() {
    const contract = await getContract({
      client,
      chain: myChain,
      address: contractManagerAddress,
      abi: [
        {
          "inputs": [
            { "internalType": "uint256", "name": "rykerTokenId", "type": "uint256" },
            { "internalType": "uint256", "name": "lunaTokenId", "type": "uint256" },
            { "internalType": "uint256", "name": "ariaTokenId", "type": "uint256" },
            { "internalType": "uint256", "name": "thaddeusTokenId", "type": "uint256" }
          ],
          "name": "payFee",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        }
      ]
    });

    const callData = await prepareContractCall({
      contract,
      method: "payFee",
      params: [BigInt(rykerTokenId), BigInt(lunaTokenId), BigInt(ariaTokenId), BigInt(thaddeusTokenId)],
    });

    return await prepareTransaction({
      client: client,
      chain: myChain,
      to: contractManagerAddress,
      data: callData.data,
      value: toWei("0.1") as bigint, // Replace with the actual fee value in wei
    });
  }

  return (
    <div>
      <h1>Invia Dati a Davide</h1>
      <input
        type="text"
        placeholder="solidityFunction Nome"
        value={solidityFunction}
        onChange={(e) => setSolidityFunction(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ryker Token ID"
        value={rykerTokenId}
        onChange={(e) => setRykerTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Luna Token ID"
        value={lunaTokenId}
        onChange={(e) => setLunaTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Aria Token ID"
        value={ariaTokenId}
        onChange={(e) => setAriaTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Thaddeus Token ID"
        value={thaddeusTokenId}
        onChange={(e) => setThaddeusTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />

      <button onClick={() => sendData('/api/davide/startMission')}>Start Mission</button>
      <button onClick={() => sendData('/api/davide/endMission')}>End Mission</button>

      <ThirdwebProvider>
            <TransactionButton
        transaction={preparePayFeeTransaction}
        onTransactionSent={() => setLoading(true)}
        onTransactionConfirmed={() => {
          setLoading(false);
          alert('Fee paid successfully');
        }}
        onError={(error) => {
          setLoading(false);
          if (error instanceof Error) {
            alert('Error paying fee: ' + error.message);
          } else {
            alert('An unknown error occurred');
          }
        }}
        disabled={loading}
        unstyled
      >
        <button disabled={loading}>{loading ? 'Loading...' : 'Pay Fee'}</button>
        </TransactionButton>
        </ThirdwebProvider>

      {response && (
        <div>
          <h2>Risposta del server:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SubmitData;
