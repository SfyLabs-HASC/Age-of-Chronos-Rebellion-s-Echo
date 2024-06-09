'use client';

import React, { useState, useEffect } from 'react';
import { ThirdwebProvider, TransactionButton, useActiveWallet, useActiveAccount } from "thirdweb/react";
import { createThirdwebClient, defineChain, getContract, prepareContractCall } from 'thirdweb';

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

function MintButton({ player, contractAddress }) {
    const [contract, setContract] = useState(null);
    const account = useActiveAccount();

    useEffect(() => {
        async function fetchContract() {
            const contractInstance = await getContract({
                client,
                chain: myChain,
                address: contractAddress,
                abi: [],
            });
            setContract(contractInstance);
        }
        fetchContract();
    }, []);

    return (
        <ThirdwebProvider>
            {contract && account && (
                <TransactionButton
                    transaction={async () => {
                        const tx = prepareContractCall({
                            contract,
                            method: "function mint(address to)",
                            params: [account.address],
                        });
                        return tx;
                    }}
                    onTransactionSent={(result) => {
                        console.log("Transaction submitted", result.transactionHash);
                    }}
                    onTransactionConfirmed={(receipt) => {
                        console.log("Transaction confirmed", receipt.transactionHash);
                    }}
                    onError={(error) => {
                        console.error("Transaction error", error);
                    }}
                >
                    <button className={`hex_button turret-road-bold mint-button ${player.toLowerCase()}`}>
                        Mint {player}
                    </button>
                </TransactionButton>
            )}
        </ThirdwebProvider>
    );
}

function MintAria() {
    return <MintButton player="Aria" contractAddress={contractParentAddresses.Aria} />;
}

function MintLuna() {
    return <MintButton player="Luna" contractAddress={contractParentAddresses.Luna} />;
}

function MintRyker() {
    return <MintButton player="Ryker" contractAddress={contractParentAddresses.Ryker} />;
}

function MintThaddeus() {
    return <MintButton player="Thaddeus" contractAddress={contractParentAddresses.Thaddeus} />;
}

export { MintAria, MintLuna, MintRyker, MintThaddeus };
