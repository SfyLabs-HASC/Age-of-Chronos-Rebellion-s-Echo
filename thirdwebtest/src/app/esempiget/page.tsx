'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
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

const contractItemAddresses = {
  "AriaLeftHand": "0x9Ea72623340C7420f5cAb670e7a77Cca879ED9bD",
  "LunaLeftHand": "0x1F88d1694372BE1cAe8037888A2A2c22E949bb7d",
  "RykerRightHand": "0x9dB9312A55550B0F6a5fcaAb31F5fBb9Abfbb3Cb",
  "ThaddeusRightHand": "0x7ea2542c69B768747583D90a41cF35916571c15C"
};

const SubmitData: React.FC = () => {
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const activeAccount = useActiveAccount();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeAccount) {
      getBalanceOf();
    }
  }, [activeAccount]);

  async function generateAccessToken() {
    const response = await fetch('/api/get', {
      method: 'GET'
    });
    const result = await response.json();
    console.log('Generated Access Token:', result.accessToken);
    return result.accessToken;
  }

  async function getBalanceOf() {
    try {
      if (!activeAccount || !activeAccount.address) {
        throw new Error('No active account found');
      }

      setLoading(true);
      const accessToken = await generateAccessToken();
      const chainId = myChain.id;
      const args = activeAccount.address;

      const balances: Record<string, any> = {};

      for (const [key, contractAddress] of Object.entries(contractItemAddresses)) {
        console.log('Making GET request to balanceOf:', {
          url: `https://c33fdf82.engine-usw2.thirdweb.com/contract/${chainId}/${contractAddress}/read?functionName=balanceOf&args=${args}`,
          accessToken
        });

        const balanceResponse = await fetch(
          `https://c33fdf82.engine-usw2.thirdweb.com/contract/${chainId}/${contractAddress}/read?functionName=balanceOf&args=${args}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
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
  }

  return (
    <ThirdwebProvider>
      <main className="main">
        <section id="inside">
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
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
        </section>
      </main>
    </ThirdwebProvider>
  );
};

export default SubmitData;
