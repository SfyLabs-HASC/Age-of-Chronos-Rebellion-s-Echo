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
  const tokenId = searchParams.get('tokenId');
  const parentCollectionAddress = searchParams.get('parentContract');
  const key = searchParams.get('key');

  if (!tokenId || !parentCollectionAddress || !key) {
    return NextResponse.json({ error: 'Missing tokenId, parentContract, or key' }, { status: 400 });
  }

  try {
    const results = await getCharacterDropRates(tokenId, parentCollectionAddress, key);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function getCharacterDropRates(tokenId: string, parentCollectionAddress: string, key: string) {
  const privateKeyPath = 'src/keys/private.pem';
  const publicKeyPath = 'src/keys/public.pem';

  const engineBaseUrl = 'https://c33fdf82.engine-usw2.thirdweb.com';
  const backendWalletAddress = '0x93e7b1f3fA8f57425B8a80337D94Ae3992879911';
  const managerContractAddress = '0xd50248022D8b254De8923109664918f707e4D074';
  
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

  const payload = createPayload(parentCollectionAddress, tokenId, key);
  const accessToken = createAccessToken(payload);
  const result = await makeRequest(parentCollectionAddress, tokenId, accessToken, key);

  return { result };
}
