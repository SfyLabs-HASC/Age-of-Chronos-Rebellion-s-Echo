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
            "name": "getCollectionAddresses",
            "outputs": [{ "name": "", "type": "address[]" }],
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




interface TokenExistProps {
    collection: string;
    tokenId: bigint;
}

const IsTokenExists: React.FC<TokenExistProps> = ({ collection, tokenId }) => {
    const [exists, setExists] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract('ADDRESS_OF_YOUR_MANAGER_CONTRACT');

    useEffect(() => {
        const checkTokenExists = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "isTokenExists",
                    params: [collection, tokenId],
                });
                setExists(data);
            } catch (error) {
                console.error('Error checking if token exists:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkTokenExists();
    }, [collection, tokenId]);

    return <div>Does Token {tokenId} Exist in Collection {collection}: {isLoading ? 'Loading...' : exists?.toString()}</div>;
};


interface TokenProps {
    tokenId: bigint;
}

const HasTokenPaidFee: React.FC<TokenProps> = ({ tokenId }) => {
    const [hasPaid, setHasPaid] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract('ADDRESS_OF_YOUR_MANAGER_CONTRACT');

    useEffect(() => {
        const checkFeeStatus = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "hasTokenPaidFee",
                    params: [tokenId],
                });
                setHasPaid(data);
            } catch (error) {
                console.error('Error checking fee status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkFeeStatus();
    }, [tokenId]);

    return <div>Has Token {tokenId} Paid Fee: {isLoading ? 'Loading...' : hasPaid?.toString()}</div>;
};


const GetFee: React.FC = () => {
    const [fee, setFee] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract('ADDRESS_OF_YOUR_MANAGER_CONTRACT');

    useEffect(() => {
        const fetchFee = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "getFee",
                    params: [],
                });
                setFee(data);
            } catch (error) {
                console.error('Error fetching fee:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFee();
    }, []);

    return <div>Fee: {isLoading ? 'Loading...' : fee?.toString()}</div>;
};

const IsTokenInMission: React.FC<TokenProps> = ({ tokenId }) => {
    const [inMission, setInMission] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract('ADDRESS_OF_YOUR_MANAGER_CONTRACT');

    useEffect(() => {
        const checkMissionStatus = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "isTokenInMission",
                    params: [tokenId],
                });
                setInMission(data);
            } catch (error) {
                console.error('Error checking mission status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkMissionStatus();
    }, [tokenId]);

    return <div>Is Token {tokenId} in Mission: {isLoading ? 'Loading...' : inMission?.toString()}</div>;
};

const GetCollectionAddresses: React.FC = () => {
    const [addresses, setAddresses] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract('ADDRESS_OF_YOUR_MANAGER_CONTRACT');

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const data: readonly string[] = await readContract({
                    contract,
                    method: "getCollectionAddresses",
                    params: [],
                });
                setAddresses([...data]); // Create a mutable copy of the readonly array
            } catch (error) {
                console.error('Error fetching addresses:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    return (
        <div>
            Collection Addresses: {isLoading ? 'Loading...' : addresses?.join(', ')}
        </div>
    );
};


interface ContributorProps {
    account: string;
}

const IsContributor: React.FC<ContributorProps> = ({ account }) => {
    const [isContributor, setIsContributor] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const contract = createContract('ADDRESS_OF_YOUR_MANAGER_CONTRACT');

    useEffect(() => {
        const checkContributor = async () => {
            try {
                const data = await readContract({
                    contract,
                    method: "isContributor",
                    params: [account],
                });
                setIsContributor(data);
            } catch (error) {
                console.error('Error checking contributor status:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkContributor();
    }, [account]);

    return <div>Is {account} a Contributor: {isLoading ? 'Loading...' : isContributor?.toString()}</div>;
};


export {
    GetFee, HasTokenPaidFee, IsTokenInMission, GetCollectionAddresses,
    IsTokenExists, IsContributor
};

