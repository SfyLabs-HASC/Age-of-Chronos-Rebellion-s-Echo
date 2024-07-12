'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useActiveAccount, ThirdwebProvider } from 'thirdweb/react';
import { createThirdwebClient, defineChain } from 'thirdweb';

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

const contractParentAddresses: { [key: string]: string } = {
  "Aria": "0xf6F0130799de29cf1A402290766a1C9c95B6d017",
  "Luna": "0xe429fb9fD5dcFe9B148f0E6FF922C8A6d12B4f53",
  "Ryker": "0x972009B42a51CaCd43e059a2C56e92541EF2Bc2f",
  "Thaddeus": "0xE7AeB43Ed1dE5D357F190847830b2a9f31E0C032"
};

const SubmitData: React.FC = () => {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const activeWallet = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [rykerTokenId, setRykerTokenId] = useState('');
  const [lunaTokenId, setLunaTokenId] = useState('');
  const [ariaTokenId, setAriaTokenId] = useState('');
  const [thaddeusTokenId, setThaddeusTokenId] = useState('');
  const [key, setKey] = useState('NomindioLabs');

  const getBalanceOf = async () => {
    try {
      if (!activeWallet || !activeWallet.address) {
        throw new Error('No active wallet found');
      }

      setLoading(true);

      const balances: Record<string, any> = {};

      for (const [key, contractAddress] of Object.entries(contractParentAddresses)) {
        console.log('Making GET request to balanceOf:', {
          url: `/api/balanceof?parentContract=${contractAddress}&walletAddress=${activeWallet.address}`
        });

        const balanceResponse = await fetch(
          `/api/balanceof?parentContract=${contractAddress}&walletAddress=${activeWallet.address}`,
          {
            method: 'GET'
          }
        );

        const balanceResult = await balanceResponse.json();
        console.log(`Received balanceOf response for ${key}:`, balanceResult);
        balances[key] = balanceResult;
      }

      setResponseMessage(JSON.stringify(balances, null, 2));
    } catch (error: unknown) {
      console.error('Error getting balanceOf:', error);
      if (error instanceof Error) {
        setResponseMessage(error.message);
      } else {
        setResponseMessage('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getOwnedCharacters = async () => {
    try {
      if (!activeWallet || !activeWallet.address) {
        throw new Error('No active wallet found');
      }

      setLoading(true);

      const characters: Record<string, any> = {};

      for (const [key, contractAddress] of Object.entries(contractParentAddresses)) {
        console.log('Making GET request to getOwnedCharacters:', {
          url: `/api/GetOwnedCharacters?parentContract=${contractAddress}&walletAddress=${activeWallet.address}`
        });

        const charactersResponse = await fetch(
          `/api/GetOwnedCharacters?parentContract=${contractAddress}&walletAddress=${activeWallet.address}`,
          {
            method: 'GET'
          }
        );

        const charactersResult = await charactersResponse.json();
        console.log(`Received getOwnedCharacters response for ${key}:`, charactersResult);
        characters[key] = charactersResult;
      }

      setResponseMessage(JSON.stringify(characters, null, 2));
    } catch (error: unknown) {
      console.error('Error getting owned characters:', error);
      if (error instanceof Error) {
        setResponseMessage(error.message);
      } else {
        setResponseMessage('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const getCharacterDropRate = async () => {
    try {
      if (!activeWallet || !activeWallet.address) {
        throw new Error('No active wallet found');
      }

      setLoading(true);     
        
        console.log('Making GET request to getCharacterDropRate:', {
          url: `/api/getCharacterDropRate?rykerTokenId=${rykerTokenId}&lunaTokenId=${lunaTokenId}&ariaTokenId=${ariaTokenId}&thaddeusTokenId=${thaddeusTokenId}&key=${key}`
        });
        const dropRateResponse = await fetch(
          `/api/getCharacterDropRate?rykerTokenId=${rykerTokenId}&lunaTokenId=${lunaTokenId}&ariaTokenId=${ariaTokenId}&thaddeusTokenId=${thaddeusTokenId}&key=${key}`,
          {
            method: 'GET'
          }
        );

        const dropRateResult = await dropRateResponse.json();
        console.log(`Received getCharacterDropRate response`, dropRateResult);
        
      

      setResponseMessage(JSON.stringify(dropRateResult, null, 2));
    } catch (error: unknown) {
      console.error('Error getting character drop rates:', error);
      if (error instanceof Error) {
        setResponseMessage(error.message);
      } else {
        setResponseMessage('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '30vh' }}>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={getBalanceOf}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Get Balance Of
          </button>
          <button
            onClick={getOwnedCharacters}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Get Owned Characters
          </button>
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Ryker Token ID"
              value={rykerTokenId}
              onChange={(e) => setRykerTokenId(e.target.value)}
              style={{ padding: '10px', marginRight: '10px' }}
            />
            <input
              type="text"
              placeholder="Luna Token ID"
              value={lunaTokenId}
              onChange={(e) => setLunaTokenId(e.target.value)}
              style={{ padding: '10px', marginRight: '10px' }}
            />
            <input
              type="text"
              placeholder="Aria Token ID"
              value={ariaTokenId}
              onChange={(e) => setAriaTokenId(e.target.value)}
              style={{ padding: '10px', marginRight: '10px' }}
            />
            <input
              type="text"
              placeholder="Thaddeus Token ID"
              value={thaddeusTokenId}
              onChange={(e) => setThaddeusTokenId(e.target.value)}
              style={{ padding: '10px', marginRight: '10px' }}
            />
            <input
              type="text"
              placeholder="Key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              style={{ padding: '10px' }}
            />
            <button
              onClick={getCharacterDropRate}
              style={{
                padding: '10px 20px',
                backgroundColor: '#ffc107',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              Get Character Drop Rate
            </button>
          </div>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          responseMessage && (
            <div>
              <h2>Response Message:</h2>
              <pre style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                {responseMessage}
              </pre>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SubmitData;
