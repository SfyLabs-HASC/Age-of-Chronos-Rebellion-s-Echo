// src/app/ClientWrapper.tsx
'use client';
import { usePathname } from 'next/navigation';
import ThirdWeb from './thirdweb';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {pathname !== '/game' && (
        <div className="connect-wallet">
          <ThirdWeb />
        </div>
      )}
      {children}
    </>
  );
}
