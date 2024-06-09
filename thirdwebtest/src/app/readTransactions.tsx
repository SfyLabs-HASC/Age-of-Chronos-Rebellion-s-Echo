// readTransactions.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { createThirdwebClient, defineChain, getContract, readContract } from 'thirdweb';

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

    return <div>Balance of Aria: {isLoading ? 'Loading...' : balance?.toString()}</div>;
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

    return <div>Balance of Luna: {isLoading ? 'Loading...' : balance?.toString()}</div>;
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

    return <div>Balance of Ryker: {isLoading ? 'Loading...' : balance?.toString()}</div>;
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

    return <div>Balance of Thaddeus: {isLoading ? 'Loading...' : balance?.toString()}</div>;
};

export {
    GetTotalSupplyAria, GetBalanceOfAria,
    GetTotalSupplyLuna, GetBalanceOfLuna,
    GetTotalSupplyRyker, GetBalanceOfRyker,
    GetTotalSupplyThaddeus, GetBalanceOfThaddeus
};
