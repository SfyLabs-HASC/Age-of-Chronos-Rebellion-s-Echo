'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useActiveAccount, TransactionButton, ThirdwebProvider } from 'thirdweb/react';
import { createThirdwebClient, defineChain, getContract, prepareContractCall, prepareTransaction, toWei } from 'thirdweb';

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

const contractManagerAddress = '0xd50248022D8b254De8923109664918f707e4D074';

type ResponseType<T = any> = {
  result?: T;
  error?: string;
};

const SubmitData: React.FC = () => {
  const [whichChild, setWhichChild] = useState('');
  const [rykerTokenId, setRykerTokenId] = useState('');
  const [lunaTokenId, setLunaTokenId] = useState('');
  const [ariaTokenId, setAriaTokenId] = useState('');
  const [thaddeusTokenId, setThaddeusTokenId] = useState('');
  const [key, setKey] = useState('NomindioLabs');
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const activeAccount = useActiveAccount();
  const [loading, setLoading] = useState(false);

  async function sendData(endpoint: string, solidityFunction: string) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ solidityFunction, rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, whichChild, key })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error.message || `HTTP error! status: ${response.status}`);
      }

      console.log("Server response:", result);
      setResponse({ result });
      const queueId = result.queueId;
      setResponseMessage(`Queue ID: ${queueId}`);

      // Effettua la richiesta GET per ottenere lo stato della transazione
      const statusResponse = await fetch(
        `https://c33fdf82.engine-usw2.thirdweb.com/transaction/status/${queueId}`, // Usa l'URL corretto del tuo engine
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`, // Assicurati che l'access token sia configurato correttamente
          },
        }
      );

      const statusResult = await statusResponse.json();

      // Aggiorna lo stato con il risultato della transazione
      setResponseMessage(JSON.stringify(statusResult, null, 2));
    } catch (error: unknown) {
      console.error('Error sending data:', error);
      if (error instanceof Error) {
        setResponse({ error: error.message });
        setResponseMessage(error.message);
      } else {
        setResponse({ error: 'An unknown error occurred' });
        setResponseMessage('An unknown error occurred');
      }
    }
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
      value: toWei("0.3") as bigint, // TODO PRENDILE CON UNA GET getFee al manager
    });
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Invia Dati a Davide</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Token IDs</h2>
        <input
          type="text"
          placeholder="Ryker Token ID"
          value={rykerTokenId}
          onChange={(e) => setRykerTokenId(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Luna Token ID"
          value={lunaTokenId}
          onChange={(e) => setLunaTokenId(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Aria Token ID"
          value={ariaTokenId}
          onChange={(e) => setAriaTokenId(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Thaddeus Token ID"
          value={thaddeusTokenId}
          onChange={(e) => setThaddeusTokenId(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <h2>whichChild in endmission lascia bianco se fai altro</h2>
        <input
          type="text"
          placeholder="whichChild"
          value={whichChild}
          onChange={(e) => setWhichChild(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Chiave</h2>
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={() => sendData('/api/davide','startMission')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Start Mission
        </button>
        <button
          onClick={() => sendData('/api/davide','endMission')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          End Mission
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
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
            <div
              style={{
                width: '100%',
                padding: '10px 20px',
                backgroundColor: '#ffc107',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {loading ? 'Loading...' : 'Pay Fee'}
            </div>
          </TransactionButton>
        </ThirdwebProvider>
      </div>

      {response && (
        <div>
          <h2>Risposta del server:</h2>
          <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {responseMessage && (
        <div>
          <h2>Response Message:</h2>
          <text style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', display: 'block' }}>
            {responseMessage}
          </text>
        </div>
      )}
    </div>
  );
};

export default SubmitData;
