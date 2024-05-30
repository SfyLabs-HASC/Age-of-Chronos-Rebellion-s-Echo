'use client'

import React from 'react';
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
        }
    ]
});

const GetTotalSupply = () => {
    const  data = readContract({
        contract,
        method: "totalSupply",
        params: [],
    });

    return (
        <div>
            <h3>Total Supply of Aria: {data}</h3>
        </div>
    );
}

export default GetTotalSupply;
