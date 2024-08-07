// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import ClientWrapper from './ClientWrapper';  // Importa ClientWrapper

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Play and craft NFTs 2.0!',
  description: 'Web-based dungeon crawler that utilizes NFT 2.0 technology to provide an immersive gaming experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientWrapper>{children}</ClientWrapper>  {/* Utilizza ClientWrapper */}
      </body>
    </html>
  );
}
