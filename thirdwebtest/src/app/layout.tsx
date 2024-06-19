import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThirdWeb from './thirdweb'

import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Web-based dungeon crawler that utilizes NFT 2.0 technology to provide an immersive gaming experience.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="connect-wallet"><ThirdWeb /></div>
        {children}
      </body>
    </html>
  )
}
