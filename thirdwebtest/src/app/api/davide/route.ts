// src/app/api/davide/route.ts
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
  return key.replace(/\r/g, '').trim(); // Remove any carriage returns and trim spaces
};


const privateKeyPath = 'src/keys/private.pem';
const publicKeyPath = 'src/keys/public.pem';

// Define the engine URL and wallet addresses
const engineBaseUrl = 'https://c33fdf82.engine-usw2.thirdweb.com';
const backendWalletAddress = '0x93e7b1f3fA8f57425B8a80337D94Ae3992879911';
const managerContractAddress = '0x7ccDc0BCaf6d3B4787Fd39e96587eEb1B384986d';
const recipientAddress = '0xe204E95cD77Fa95FE669aeCCD8d51A59bFa25A52'; // Wallet to send funds to
const chain = '1287'; // Assuming '1287' is the correct chain ID for MoonbaseAlpha

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Ciao Davide!' });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, key } = data;

  const bodyToHash = {
    functionName: "startMission",
    args: [
      rykerTokenId,
      lunaTokenId,
      ariaTokenId,
      thaddeusTokenId,
      key
    ],
    txOverrides: {
      gas: "530000",
      maxFeePerGas: "1000000000",
      maxPriorityFeePerGas: "1000000000",
      value: "10000000000"
    },
    abi: [
      {
        type: "function",
        name: "startMission",
        inputs: [
          {
            type: "uint256",
            name: "rykerTokenId"
          },
          {
            type: "uint256",
            name: "lunaTokenId"
          },
          {
            type: "uint256",
            name: "ariaTokenId"
          },
          {
            type: "uint256",
            name: "thaddeusTokenId"
          },
          {
            type: "string",
            name: "key"
          }
        ],
        stateMutability: "nonpayable"
      }
    ]
  };

  // Carica le chiavi
  const privateKey = await loadKey(privateKeyPath);
  const publicKey = await loadKey(publicKeyPath);

  const payload = {
    iss: publicKey,
    bodyHash: createHash('sha256').update(JSON.stringify(bodyToHash)).digest('hex'),
  };

  // Crea access token
  const accessToken = jsonwebtoken.sign(payload, privateKey, {
    algorithm: 'ES256',
    expiresIn: '5m', // Token valid for 5 minutes
  });

  // Configura il corpo della richiesta per endMission
  const requestBody = JSON.stringify({
    functionName: "startMission",
    args: [
      rykerTokenId,
      lunaTokenId,
      ariaTokenId,
      thaddeusTokenId,
      key
    ],
    txOverrides: {
      gas: "530000",
      maxFeePerGas: "1000000000",
      maxPriorityFeePerGas: "1000000000",
      value: "10000000000"
    },
    abi: [
      {
        type: "function",
        name: "startMission",
        inputs: [
          {
            type: "uint256",
            name: "rykerTokenId"
          },
          {
            type: "uint256",
            name: "lunaTokenId"
          },
          {
            type: "uint256",
            name: "ariaTokenId"
          },
          {
            type: "uint256",
            name: "thaddeusTokenId"
          },
          {
            type: "string",
            name: "key"
          }
        ],
        stateMutability: "nonpayable"
      }
    ]
  });

  try {
    // Effettua la richiesta all'engine
    const response = await axios.post(
      `${engineBaseUrl}/contract/${chain}/${managerContractAddress}/write?simulateTx=true`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-backend-wallet-address': backendWalletAddress,
        },
      }
    );

    // Restituisci il risultato come risposta alla richiesta POST originale
    return NextResponse.json({ result: response.data }, { status: 201 });
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json({ error: error.response.data }, { status: error.response.status });
    } else if (error.request) {
      return NextResponse.json({ error: 'No response received from engine' }, { status: 500 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  return NextResponse.json({ message: 'Dati aggiornati', data }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: 'Risorsa eliminata' }, { status: 200 });
}
