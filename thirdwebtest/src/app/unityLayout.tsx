// src/app/UnityLayout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Unity Page',
  description: 'Unity WebGL Page',
};

export default function UnityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
