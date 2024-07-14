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
  return key.replace(/\r/g, '').trim();
};

const privateKeyPath = 'src/keys/private.pem';
const publicKeyPath = 'src/keys/public.pem';

const engineBaseUrl = 'https://c33fdf82.engine-usw2.thirdweb.com';
const backendWalletAddress = '0x93e7b1f3fA8f57425B8a80337D94Ae3992879911';
//testing
//const managerContractAddress = '0x7ccDc0BCaf6d3B4787Fd39e96587eEb1B384986d';
//const chain = '1287';  //moonbasealpha

//productino
const managerContractAddress = '0xd50248022D8b254De8923109664918f707e4D074';
const chain = '1284';  //moonbeam


export async function GET(req: NextRequest) {
  try {
    
    return NextResponse.json({ message: 'Age Of Chronos will go to the Moon!!!' });
  } catch (error) {
    console.error("Error generating access token:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    //console.log("Data received in POST request:", data);
    const { solidityFunction, rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, whichChild, key } = data;

    // Controlli sui parametri ricevuti
    if (solidityFunction !== 'startMission' && solidityFunction !== 'endMission') {
      return NextResponse.json({ error: 'Invalid solidityFunction value' }, { status: 400 });
    }

    let bodyToHash;
    if (solidityFunction === 'startMission') {
      bodyToHash = {
        functionName: solidityFunction,
        args: [
          rykerTokenId,
          lunaTokenId,
          ariaTokenId,
          thaddeusTokenId,
          key
        ]
      };
    } else if (solidityFunction === 'endMission') {
      bodyToHash = {
        functionName: solidityFunction,
        args: [
          rykerTokenId,
          lunaTokenId,
          ariaTokenId,
          thaddeusTokenId,
          whichChild,
          key
        ]
      };
    }
    //console.log("JSON.stringify(bodyToHash):", JSON.stringify(bodyToHash));
    const privateKey = await loadKey(privateKeyPath);
    const publicKey = await loadKey(publicKeyPath);

    const payload = {
      iss: publicKey,
      bodyHash: createHash('sha256').update(JSON.stringify(bodyToHash)).digest('hex'),
    };

    const accessToken = jsonwebtoken.sign(payload, privateKey, {
      algorithm: 'ES256',
      expiresIn: '5m',
    });

    const requestBody = JSON.stringify(bodyToHash);

    try {
      const response = await axios.post(
        `${engineBaseUrl}/contract/${chain}/${managerContractAddress}/write`,
        requestBody,
        {
          headers: {
            'simulateTx':'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'x-backend-wallet-address': backendWalletAddress,
            'x-idempotency-key': Math.floor(Math.random() * 1000000), // Numero a caso
          },
        }
      );

      //console.log("Response:", response.data);
      return NextResponse.json({ result: response.data }, { status: 201 });
    } catch (error: any) {
      if (error.response) {
        console.log("Error response:", error.response.data);
        return NextResponse.json({ error: error.response.data }, { status: error.response.status });
      } else if (error.request) {
        return NextResponse.json({ error: 'No response received from engine' }, { status: 500 });
      } else {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  return NextResponse.json({ message: 'Dati aggiornati', data }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: 'Risorsa eliminata' }, { status: 200 });
}
