'use client'
import { useEffect } from 'react';

import { createThirdwebClient, defineChain } from "thirdweb";
import {
    ThirdwebProvider,
    ConnectButton,
    useActiveWalletChain,
    useSwitchActiveWalletChain,
    useActiveWallet
} from "thirdweb/react";
import {
    createWallet,
    walletConnect,
    inAppWallet,
} from "thirdweb/wallets";

const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!
});


//ATTENZIONE TESTING
/*
const myChain = defineChain({
    id: 1287,
    name: 'MoonbaseAlpha',
    rpc: 'https://rpc.testnet.moonbeam.network',
    nativeCurrency: {
      name: 'DEV',
      symbol: 'DEV',
      decimals: 18,
    },
    blockExplorers: [
      {
        name: 'Moonscan',
        url: 'https://moonbase.moonscan.io'
      }
    ]
  });
  */
  
const myChain = defineChain({
    id: 1284,
    name: 'Moonbeam',
    rpc: 'https://rpc.api.moonbeam.network',
    nativeCurrency: {
        name: 'GLMR',
        symbol: 'GLMR',
        decimals: 18,
    },
    blockExplorers: [
        {
            name: 'Moonscan',
            url: 'https://moonbeam.moonscan.io'
        }
    ]
});

const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    walletConnect(),
    inAppWallet({
        auth: {
            options: [
                "email",
                "google",
                "apple",
                "facebook",
                "phone",
            ],
        },
    }),
];

export default function ThirdWeb() {
    const activeWallet = useActiveWallet();
    const activeChain = useActiveWalletChain();
    const switchActiveWalletChain = useSwitchActiveWalletChain();

    useEffect(() => {
        if (activeWallet && activeChain?.id !== myChain.id) {
            switchActiveWalletChain(myChain);
        }
    }, [activeWallet, activeChain, switchActiveWalletChain]);

    return (
        <ThirdwebProvider>
            <ConnectButton
                client={client}
                wallets={wallets}
                theme={"dark"}
                connectModal={{
                    size: "wide",
                    welcomeScreen: {
                        img: {
                            src: "https://www.ageofchronos.com/_next/image?url=%2Fimg%2Flogo-main-aoc.webp&w=256&q=75",
                            width: 320,
                            height: 150,
                        },
                    },
                    termsOfServiceUrl:
                        "https://www.ageofchronos.com/termsofservice",
                    privacyPolicyUrl:
                        "https://www.ageofchronos.com/privacypolicy",
                }}
            />
        </ThirdwebProvider>
    );
}
