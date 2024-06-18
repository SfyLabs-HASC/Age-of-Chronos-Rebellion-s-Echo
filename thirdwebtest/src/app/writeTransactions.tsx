'use client';

import React, { useState, useEffect } from 'react';
import { ThirdwebProvider, TransactionButton, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient, defineChain, getContract, prepareContractCall, readContract } from 'thirdweb';
import { GetBalanceOfAria, GetBalanceOfLuna, GetBalanceOfRyker, GetBalanceOfThaddeus } from './readTransactions';

const client = createThirdwebClient({
    clientId: process.env.THIRDWEB_CLIENT_ID!
});

const myChain = defineChain({
    id: 1287,
    name: 'Moonbase Alpha',
    rpc: 'https://moonbase-alpha.public.blastapi.io',
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
    ],
    testnet: true
});

const contractParentAddresses = {
    "Aria": "0x28E6bB44976A8CbdF32a826bf2b0F3C83827fBB4",
    "Luna": "0x713bDF77C02342c975ad16fcA41d923dea3D03B7",
    "Ryker": "0xa9f2E818A524b51900bc517A6EC97b27C7167F79",
    "Thaddeus": "0x44700E473182dC3ff512b98424fCd397634BE4EF"
};

interface MintButtonProps {
    player: string;
    contractAddress: string;
    GetBalanceOfComponent: React.FC<{ address: string }>;
    onMinted: (status: boolean) => void; // Aggiunta prop onMinted
}

const MintButton: React.FC<MintButtonProps> = ({ player, contractAddress, GetBalanceOfComponent, onMinted }) => {
    const [contract, setContract] = useState<any>(null);
    const [minted, setMinted] = useState(false);
    const [loading, setLoading] = useState(true);
    const account = useActiveAccount();

    useEffect(() => {
        async function fetchContract() {
            const contractInstance = await getContract({
                client,
                chain: myChain,
                address: contractAddress,
                abi: [
                    {
                        "constant": true,
                        "inputs": [{ "name": "owner", "type": "address" }],
                        "name": "balanceOf",
                        "outputs": [{ "name": "", "type": "uint256" }],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                    }
                ],
            });
            setContract(contractInstance);
            setLoading(false);
        }
        fetchContract();
    }, []);

    useEffect(() => {
        async function checkMinted() {
            if (contract && account) {
                const balance = await readContract({
                    contract,
                    method: "function balanceOf(address) view returns (uint256)",
                    params: [account.address],
                });
                const isMinted = balance > 0;
                setMinted(isMinted);
                onMinted(isMinted); // Chiamata alla prop onMinted
            }
        }
        checkMinted();
    }, [contract, account]);

    const handleTransaction = async () => {
        setLoading(true);
        const tx = prepareContractCall({
            contract,
            method: "function mint(address to)",
            params: [account ? account.address : '0x0'],
        });
        return tx;
    };

    const handleTransactionSent = (result: any) => {
        console.log("Transaction submitted", result.transactionHash);
    };

    const handleTransactionConfirmed = (receipt: any) => {
        console.log("Transaction confirmed", receipt.transactionHash);
        setMinted(true); // Update state to minted once confirmed
        onMinted(true); // Chiamata alla prop onMinted
        setLoading(false);
    };

    const handleError = (error: any) => {
        console.error("Transaction error", error);
        setLoading(false);
    };

    const buttonClassName = `hex_button ${player.toLowerCase()} ${minted ? 'claimed' : ''}`;

    return (
        <ThirdwebProvider>
            {account && <GetBalanceOfComponent address={account.address} />}
            <TransactionButton
                transaction={handleTransaction}
                onTransactionSent={handleTransactionSent}
                onTransactionConfirmed={handleTransactionConfirmed}
                onError={handleError}
                disabled={!account || minted || loading}
                unstyled
                className={buttonClassName}
            >
                <span>{loading ? 'Loading...' : (minted ? 'Claimed' : 'Mint')}</span>
            </TransactionButton>
        </ThirdwebProvider>
    );
};

const MintAria = ({ onMinted }: { onMinted: (status: boolean) => void }) => {
    return <MintButton player="Aria" contractAddress={contractParentAddresses.Aria} GetBalanceOfComponent={GetBalanceOfAria} onMinted={onMinted} />;
};

const MintLuna = ({ onMinted }: { onMinted: (status: boolean) => void }) => {
    return <MintButton player="Luna" contractAddress={contractParentAddresses.Luna} GetBalanceOfComponent={GetBalanceOfLuna} onMinted={onMinted} />;
};

const MintRyker = ({ onMinted }: { onMinted: (status: boolean) => void }) => {
    return <MintButton player="Ryker" contractAddress={contractParentAddresses.Ryker} GetBalanceOfComponent={GetBalanceOfRyker} onMinted={onMinted} />;
};

const MintThaddeus = ({ onMinted }: { onMinted: (status: boolean) => void }) => {
    return <MintButton player="Thaddeus" contractAddress={contractParentAddresses.Thaddeus} GetBalanceOfComponent={GetBalanceOfThaddeus} onMinted={onMinted} />;
};

export { MintAria, MintLuna, MintRyker, MintThaddeus };
