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
const managerContractAddress = '0xd50248022D8b254De8923109664918f707e4D074';
const chain = '1284';  //moonbeam

const allowedDomains = ['localhost:3000', 'ageofchronos.com', 'https://www.ageofchronos.com', 'https://ageofchronos.com'];

export async function GET(req: NextRequest) {
  try {
    const forwardedHost = req.headers.get('x-forwarded-host');

    if (!allowedDomains.includes(forwardedHost || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const privateKey = await loadKey(privateKeyPath);
    const publicKey = await loadKey(publicKeyPath);

    const payload = {
      iss: publicKey
    };

    const accessToken = jsonwebtoken.sign(payload, privateKey, {
      algorithm: 'ES256',
      expiresIn: '15s',
    });

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error generating access token:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  return NextResponse.json({ message: 'Pappagallo', data }, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  return NextResponse.json({ message: 'Dati aggiornati', data }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: 'Risorsa eliminata' }, { status: 200 });
}
