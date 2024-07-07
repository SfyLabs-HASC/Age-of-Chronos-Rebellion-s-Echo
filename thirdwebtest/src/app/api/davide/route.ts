// src/app/api/davide/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';

// Carica chiavi pubblica e privata
const loadKey = async (keyPath: string): Promise<string> => {
  const keyAbsolutePath = path.resolve(process.cwd(), keyPath);
  return await fs.readFile(keyAbsolutePath, 'utf-8');
};

const privateKeyPath = 'src/keys/private.pem';
const publicKeyPath = 'src/keys/public.pem';

// Define the engine URL and wallet addresses
const engineBaseUrl = 'https://c33fdf82.engine-usw2.thirdweb.com';
const backendWalletAddress = '0x93e7b1f3fA8f57425B8a80337D94Ae3992879911';
const managerContractAddress = '0x93e7b1f3fA8f57425B8a80337D94Ae3992879911';
const recipientAddress = '0xe204E95cD77Fa95FE669aeCCD8d51A59bFa25A52'; // Wallet to send funds to
const chain = '1284'; // Assuming '1284' is the correct chain ID for Moonbeam

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Ciao Davide!' });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const {solidityFunction, rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, key } = data;
  const dataToTransfer = { rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, key }
  // Carica le chiavi
  //const privateKey = await loadKey(privateKeyPath);
  //const publicKey = await loadKey(publicKeyPath);



  const payload = {
    iss: publicKey,
    bodyHash: createHash('sha256').update(JSON.stringify(dataToTransfer)).digest('hex'),
  };

  console.log("bodyhash",JSON.stringify(dataToTransfer))
  // Crea access token
  const accessToken = jsonwebtoken.sign(payload, privateKey, {
    algorithm: 'ES256',
    expiresIn: '5m', // Token valid for 15s
  });

  // Configura il corpo della richiesta per endMission
  const requestBody = JSON.stringify({
    rykerTokenId,
    lunaTokenId,
    ariaTokenId,
    thaddeusTokenId,
    key,
  });
  console.log("requestBody",requestBody)

  try {
    // Effettua la richiesta all'engine
    const response = await axios.post(
      `${engineBaseUrl}/contract/${chain}/${managerContractAddress}/${solidityFunction}`,
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
