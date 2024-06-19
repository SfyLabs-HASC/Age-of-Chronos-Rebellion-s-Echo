// readTransactions.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { createThirdwebClient, defineChain, getContract, readContract } from 'thirdweb';

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

const contractParentAddresses = {
    "Aria": "0xf6F0130799de29cf1A402290766a1C9c95B6d017",
    "Luna": "0xe429fb9fD5dcFe9B148f0E6FF922C8A6d12B4f53",
    "Ryker": "0x972009B42a51CaCd43e059a2C56e92541EF2Bc2f",
    "Thaddeus": "0xE7AeB43Ed1dE5D357F190847830b2a9f31E0C032"
};

// Helper function to create contract
const createContract = (address: string) => getContract({
    client,
    chain: myChain,
    address,
    abi: [
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{ "name": "", "type": "uint256" }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
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

// Define the type for the address prop
interface AddressProps {
    address: string;
}

// Component for Aria
const GetTotalSupplyAria: React.FC = () => {
    const [totalSupply, setTotalSupply] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract(contractParentAddresses.Aria);

    useEffect(() => {
        const fetchTotalSupply = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "totalSupply",
                    params: [],
                });
                setTotalSupply(data);
            } catch (error) {
                console.error('Error fetching total supply:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTotalSupply();
    }, []);

    return <div>Total Supply of Aria: {isLoading ? 'Loading...' : totalSupply?.toString()}</div>;
};

const GetBalanceOfAria: React.FC<AddressProps> = ({ address }) => {
    const [balance, setBalance] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract(contractParentAddresses.Aria);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "balanceOf",
                    params: [address],
                });
                setBalance(data);
            } catch (error) {
                console.error('Error fetching balance:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalance();
    }, [address]);

    return balance;
};

// Component for Luna
const GetTotalSupplyLuna: React.FC = () => {
    const [totalSupply, setTotalSupply] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract(contractParentAddresses.Luna);

    useEffect(() => {
        const fetchTotalSupply = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "totalSupply",
                    params: [],
                });
                setTotalSupply(data);
            } catch (error) {
                console.error('Error fetching total supply:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTotalSupply();
    }, []);

    return <div>Total Supply of Luna: {isLoading ? 'Loading...' : totalSupply?.toString()}</div>;
};

const GetBalanceOfLuna: React.FC<AddressProps> = ({ address }) => {
    const [balance, setBalance] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract(contractParentAddresses.Luna);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "balanceOf",
                    params: [address],
                });
                setBalance(data);
            } catch (error) {
                console.error('Error fetching balance:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalance();
    }, [address]);

    return balance;
};

// Component for Ryker
const GetTotalSupplyRyker: React.FC = () => {
    const [totalSupply, setTotalSupply] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract(contractParentAddresses.Ryker);

    useEffect(() => {
        const fetchTotalSupply = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "totalSupply",
                    params: [],
                });
                setTotalSupply(data);
            } catch (error) {
                console.error('Error fetching total supply:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTotalSupply();
    }, []);

    return <div>Total Supply of Ryker: {isLoading ? 'Loading...' : totalSupply?.toString()}</div>;
};

const GetBalanceOfRyker: React.FC<AddressProps> = ({ address }) => {
    const [balance, setBalance] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract(contractParentAddresses.Ryker);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "balanceOf",
                    params: [address],
                });
                setBalance(data);
            } catch (error) {
                console.error('Error fetching balance:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalance();
    }, [address]);

    return balance;
};

// Component for Thaddeus
const GetTotalSupplyThaddeus: React.FC = () => {
    const [totalSupply, setTotalSupply] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract(contractParentAddresses.Thaddeus);

    useEffect(() => {
        const fetchTotalSupply = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "totalSupply",
                    params: [],
                });
                setTotalSupply(data);
            } catch (error) {
                console.error('Error fetching total supply:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTotalSupply();
    }, []);

    return <div>Total Supply of Thaddeus: {isLoading ? 'Loading...' : totalSupply?.toString()}</div>;
};

const GetBalanceOfThaddeus: React.FC<AddressProps> = ({ address }) => {
    const [balance, setBalance] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract(contractParentAddresses.Thaddeus);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "balanceOf",
                    params: [address],
                });
                setBalance(data);
            } catch (error) {
                console.error('Error fetching balance:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalance();
    }, [address]);

    return balance;
};

export {
    GetTotalSupplyAria, GetBalanceOfAria,
    GetTotalSupplyLuna, GetBalanceOfLuna,
    GetTotalSupplyRyker, GetBalanceOfRyker,
    GetTotalSupplyThaddeus, GetBalanceOfThaddeus
};
