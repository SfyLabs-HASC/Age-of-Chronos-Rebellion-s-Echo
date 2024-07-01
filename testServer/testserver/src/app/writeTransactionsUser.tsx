/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { ThirdwebProvider, TransactionButton, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient, defineChain, getContract, prepareContractCall, readContract } from 'thirdweb';
import { GetBalanceOfAria, GetBalanceOfLuna, GetBalanceOfRyker, GetBalanceOfThaddeus } from './readTransactions';

const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!
});

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

const contractManagerAddress = "YOUR_MANAGER_CONTRACT_ADDRESS"; // Replace with your manager contract address

interface MintButtonProps {
    player: string;
    contractAddress: string;
    GetBalanceOfComponent: React.FC<{ address: string }>;
    onMinted: (status: boolean) => void;
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
                address: contractManagerAddress,
                abi: [
                    {
                        "constant": true,
                        "inputs": [{ "name": "tokenId", "type": "uint256" }],
                        "name": "hasTokenPaidFee",
                        "outputs": [{ "name": "", "type": "bool" }],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [{ "name": "tokenId", "type": "uint256" }],
                        "name": "isTokenInMission",
                        "outputs": [{ "name": "", "type": "bool" }],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [],
                        "name": "getFee",
                        "outputs": [{ "name": "", "type": "uint256" }],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [{ "name": "collection", "type": "address" }, { "name": "tokenId", "type": "uint256" }],
                        "name": "isTokenExists",
                        "outputs": [{ "name": "", "type": "bool" }],
                        "payable": false,
                        "stateMutability": "view",
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [{ "name": "account", "type": "address" }],
                        "name": "isContributor",
                        "outputs": [{ "name": "", "type": "bool" }],
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
                onMinted(isMinted);
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
        setMinted(true);
        onMinted(true);
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
                <span>{loading ? 'Loading' : (minted ? 'Claimed' : 'Mint')}</span>
            </TransactionButton>
        </ThirdwebProvider>
    );
};


export { MintAria, MintLuna, MintRyker, MintThaddeus };
