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

  return (

      <div>
      <div>
      <div>
      <div>
        <div>
          <button
            onClick={getBalanceOf}
            
          >
            Get Balance Of
          </button>
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
      </div>
      </div>
  );
};

export default SubmitData;
