/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

const loadKey = async (keyPath: string): Promise<string> => {
  const keyAbsolutePath = path.resolve(process.cwd(), keyPath);
  const key = await fs.readFile(keyAbsolutePath, 'utf-8');
  return key.replace(/\r/g, '').trim();
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rykerTokenId = searchParams.get('rykerTokenId');
  const lunaTokenId = searchParams.get('lunaTokenId');
  const ariaTokenId = searchParams.get('ariaTokenId');
  const thaddeusTokenId = searchParams.get('thaddeusTokenId');
  const key = searchParams.get('key');

  if (!rykerTokenId || !lunaTokenId || !ariaTokenId || !thaddeusTokenId || !key) {
    return NextResponse.json({ error: 'Missing rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, or key' }, { status: 400 });
  }

  try {
    const results = await getCharacterDropRates(rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, key);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function getCharacterDropRates(rykerTokenId: string, lunaTokenId: string, ariaTokenId: string, thaddeusTokenId: string, key: string) {
  const privateKeyPath = 'src/keys/private.pem';
  const publicKeyPath = 'src/keys/public.pem';

  const engineBaseUrl = 'https://c33fdf82.engine-usw2.thirdweb.com';
  const backendWalletAddress = '0x93e7b1f3fA8f57425B8a80337D94Ae3992879911';
  const managerContractAddress = '0xd50248022D8b254De8923109664918f707e4D074';
  
  const rykerCollectionAddress = '0x972009B42a51CaCd43e059a2C56e92541EF2Bc2f';
  const lunaCollectionAddress = '0xe429fb9fD5dcFe9B148f0E6FF922C8A6d12B4f53';
  const ariaCollectionAddress = '0xf6F0130799de29cf1A402290766a1C9c95B6d017';
  const thaddeusCollectionAddress = '0xE7AeB43Ed1dE5D357F190847830b2a9f31E0C032';
  
  const chain = '1284';  //moonbeam

  const privateKey = await loadKey(privateKeyPath);
  const publicKey = await loadKey(publicKeyPath);

  const createPayload = (collectionAddress: string, tokenId: string, key: string) => ({
    iss: publicKey,
    bodyHash: createHash('sha256').update(JSON.stringify({
      functionName: 'getUintAttribute',
      args: [collectionAddress, tokenId, key]
    })).digest('hex'),
  });

  const createAccessToken = (payload: any) => jsonwebtoken.sign(payload, privateKey, {
    algorithm: 'ES256',
    expiresIn: '5m',
  });

  const makeRequest = async (collectionAddress: string, tokenId: string, accessToken: string, key: string) => {
    try {
      const response = await axios.get(`${engineBaseUrl}/contract/${chain}/${managerContractAddress}/read`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-backend-wallet-address': backendWalletAddress,
          'x-idempotency-key': Math.floor(Math.random() * 1000000).toString(), // Random number
        },
        params: {
          functionName: 'getUintAttribute',
          args: `${collectionAddress},${tokenId},${key}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.log("Error response:", error.response.data);
        throw new Error(error.response.data);
      } else if (error.request) {
        throw new Error('No response received from engine');
      } else {
        throw new Error(error.message);
      }
    }
  };

  const rykerPayload = createPayload(rykerCollectionAddress, rykerTokenId, key);
  const rykerAccessToken = createAccessToken(rykerPayload);
  const rykerResponse = await makeRequest(rykerCollectionAddress, rykerTokenId, rykerAccessToken, key);

  const lunaPayload = createPayload(lunaCollectionAddress, lunaTokenId, key);
  const lunaAccessToken = createAccessToken(lunaPayload);
  const lunaResponse = await makeRequest(lunaCollectionAddress, lunaTokenId, lunaAccessToken, key);

  const ariaPayload = createPayload(ariaCollectionAddress, ariaTokenId, key);
  const ariaAccessToken = createAccessToken(ariaPayload);
  const ariaResponse = await makeRequest(ariaCollectionAddress, ariaTokenId, ariaAccessToken, key);

  const thaddeusPayload = createPayload(thaddeusCollectionAddress, thaddeusTokenId, key);
  const thaddeusAccessToken = createAccessToken(thaddeusPayload);
  const thaddeusResponse = await makeRequest(thaddeusCollectionAddress, thaddeusTokenId, thaddeusAccessToken, key);

  return { rykerResponse, lunaResponse, ariaResponse, thaddeusResponse };
}
