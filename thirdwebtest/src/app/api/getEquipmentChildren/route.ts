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
  if (req.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.json({ error: 'Requests must be made over HTTPS' }, { status: 400 });
  }
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get('walletAddress');
  const childAddress = searchParams.get('childAddress');

  if (!walletAddress || !childAddress) {
    return NextResponse.json({ error: 'Missing walletAddress or childAddress' }, { status: 400 });
  }

  try {
    const result = await calculateBalance(walletAddress, childAddress);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function calculateBalance(walletAddress: string, childAddress: string) {
  const privateKeyPath = 'src/keys/private.pem';
  const publicKeyPath = 'src/keys/public.pem';

  const engineBaseUrl = 'https://c33fdf82.engine-usw2.thirdweb.com';
  const backendWalletAddress = '0x93e7b1f3fA8f57425B8a80337D94Ae3992879911';
  const managerContractAddress = '0x352bDF4f570Cc7c49dfe95aB4B3d9F8950e31407';
  const chain = '1284';  // moonbeam

  const privateKey = await loadKey(privateKeyPath);
  const publicKey = await loadKey(publicKeyPath);

  const payload = {
    iss: publicKey,
    bodyHash: createHash('sha256').update(JSON.stringify({
      functionName: 'calculateBalance',
      args: [walletAddress, childAddress]
    })).digest('hex'),
  };

  const accessToken = jsonwebtoken.sign(payload, privateKey, {
    algorithm: 'ES256',
    expiresIn: '5m',
  });

  try {
    const response = await axios.get(`${engineBaseUrl}/contract/${chain}/${managerContractAddress}/read`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-backend-wallet-address': backendWalletAddress,
        'x-idempotency-key': Math.floor(Math.random() * 1000000).toString(), // Random number
      },
      params: {
        functionName: 'calculateBalance',
        args: `${walletAddress},${childAddress}`
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
}
