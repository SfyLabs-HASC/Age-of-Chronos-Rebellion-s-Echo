// readTransactions.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { createThirdwebClient, defineChain, getContract, readContract } from 'thirdweb';

const client = createThirdwebClient({
    clientId: '258f6a7e272e3b6e74b8ad1d24ad1343'
});

const myChain = defineChain({
    id: 1287,
    rpc: 'https://moonbase-alpha.public.blastapi.io'
});

const contractParentAddresses = {
    "Aria": "0x28E6bB44976A8CbdF32a826bf2b0F3C83827fBB4",
    "Luna": "0x713bDF77C02342c975ad16fcA41d923dea3D03B7",
    "Ryker": "0xa9f2E818A524b51900bc517A6EC97b27C7167F79",
    "Thaddeus": "0x44700E473182dC3ff512b98424fCd397634BE4EF"
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
