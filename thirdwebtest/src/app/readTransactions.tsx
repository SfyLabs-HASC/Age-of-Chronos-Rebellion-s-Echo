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

const contractAddress = '0x28a147ebE82a64D294D0b2a92c51A487015773B1'; // Indirizzo di Aria

const contract = getContract({
    client,
    chain: myChain,
    address: contractAddress,
    abi: [
        // ABI del contratto con il metodo totalSupply
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        // ABI del contratto con il metodo balanceOf
        {
            "constant": true,
            "inputs": [{ "name": "owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "", "type": "uint256" }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
});

const GetTotalSupply = () => {
    const [totalSupply, setTotalSupply] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTotalSupply = async () => {
            try {
                const data: bigint = await readContract({
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

    return (
        <div>
            <h3>Total Supply of Aria: {isLoading ? 'Loading...' : totalSupply?.toString()}</h3>
        </div>
    );
}

const GetBalanceOf = ({ address }) => {
    const [balance, setBalance] = useState<bigint | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data: bigint = await readContract({
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

    return (
        <div>
            <h3>{isLoading ? 'Loading...' : balance?.toString()}</h3>
        </div>
    );
}

export { GetTotalSupply, GetBalanceOf };
