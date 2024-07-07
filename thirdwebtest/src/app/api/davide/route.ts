// src/app/api/davide/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Ciao Davide!' });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  return NextResponse.json({ message: 'Dati ricevuti', data }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  return NextResponse.json({ message: 'Dati aggiornati', data }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ message: 'Risorsa eliminata' }, { status: 200 });
}
