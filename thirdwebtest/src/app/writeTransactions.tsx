'use client';

import React, { useState, useEffect } from 'react';
import { ThirdwebProvider, TransactionButton, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient, defineChain, getContract, prepareContractCall, readContract } from 'thirdweb';
import { GetBalanceOfAria, GetBalanceOfLuna, GetBalanceOfRyker, GetBalanceOfThaddeus } from './readTransactions';

const client = createThirdwebClient({
    clientId: '258f6a7e272e3b6e74b8ad1d24ad1343'
});

const myChain = defineChain({
    id: 84532,
    rpc: 'https://sepolia.base.org'
});

const contractParentAddresses = {
    "Aria": "0x28a147ebE82a64D294D0b2a92c51A487015773B1",
    "Luna": "0x5F0e041A5c039c2A83a00d85e487E6Cf066f4CEF",
    "Ryker": "0xAe6Ab9Bb9704ec017cb28F990f6a76a54D3104ce",
    "Thaddeus": "0x2472Ea2ddC078661b2f8b24A3468c65617d43530"
};

function MintButton({ player, contractAddress, GetBalanceOfComponent }) {
    const [contract, setContract] = useState(null);
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
                    // ABI with balanceOf method
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
                setMinted(balance > 0);
            }
        }
        checkMinted();
    }, [contract, account]);

    return (
        <ThirdwebProvider>
            <TransactionButton
                transaction={async () => {
                    const tx = prepareContractCall({
                        contract,
                        method: "function mint(address to)",
                        params: [account ? account.address : '0x0'],
                    });
                    return tx;
                }}
                onTransactionSent={(result) => {
                    console.log("Transaction submitted", result.transactionHash);
                }}
                onTransactionConfirmed={(receipt) => {
                    console.log("Transaction confirmed", receipt.transactionHash);
                    setMinted(true); // Update state to minted once confirmed
                }}
                onError={(error) => {
                    console.error("Transaction error", error);
                }}
                className={`hex_button turret-road-bold mint-button ${player.toLowerCase()} ${minted ? 'claimed' : ''}`}
                disabled={!account || minted}
            >
                {({ isLoading }) => (
                    <span>
                        {isLoading ? 'Processing...' : minted ? 'Claimed' : 'Mint'}
                    </span>
                )}
            </TransactionButton>
            {account && <GetBalanceOfComponent address={account.address} />}
        </ThirdwebProvider>
    );
}

function MintAria() {
    return <MintButton player="Aria" contractAddress={contractParentAddresses.Aria} GetBalanceOfComponent={GetBalanceOfAria} />;
}

function MintLuna() {
    return <MintButton player="Luna" contractAddress={contractParentAddresses.Luna} GetBalanceOfComponent={GetBalanceOfLuna} />;
}

function MintRyker() {
    return <MintButton player="Ryker" contractAddress={contractParentAddresses.Ryker} GetBalanceOfComponent={GetBalanceOfRyker} />;
}

function MintThaddeus() {
    return <MintButton player="Thaddeus" contractAddress={contractParentAddresses.Thaddeus} GetBalanceOfComponent={GetBalanceOfThaddeus} />;
}

export { MintAria, MintLuna, MintRyker, MintThaddeus };
