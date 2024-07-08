import { createHash } from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import axios from 'axios';

// Define the private and public keys directly as strings
const privateKey = `-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIPlHJu4HHl9jFqV9BtaIuWafAUT7S0bYNz6KA3kRG7cdoAoGCCqGSM49
AwEHoUQUOJ8F7uzvgHMYqfcMwF4HPDQ
/5ahf48xtb895/9wQp3JQFkyyClZcEAjpQ==
-----END EC PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQc
UOJ8F7uzvgHMYqfcMwF4HPDQ/5ahf48xtb895/9wQp3JQFkyyClZcEAjpQ==
-----END PUBLIC KEY-----`;

// Verify keys
console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);

// Define the engine URL and wallet addresses
const engineBaseUrl = 'https://c33fdf82.engine-usw2.thirdweb.com';
const backendWalletAddress = '0x93e7b1f3fA8f57425B8a80337D94Ae3992879911';
const recipientAddress = '0xe204E95cD77Fa95FE669aeCCD8d51A59bFa25A52'; // Wallet to send funds to
const chain = '1284'; // Assuming '1284' is the correct chain ID for Moonbeam

// Prepare the payload for the JWT
const createAccessToken = (body: any) => {
  const payload = {
    iss: publicKey,
    bodyHash: createHash('sha256').update(body).digest('hex'),
  };

  // Sign the payload to create the access token with a longer expiration for testing
  return jsonwebtoken.sign(payload, {
    algorithm: 'ES256',
    expiresIn: '15s', // Token valid for 15s
  });
};

// Function to get the balance
const getBalance = async () => {
  try {
    const response = await axios.get(
      `${engineBaseUrl}/backend-wallet/${chain}/${backendWalletAddress}/get-balance`,
      {
        headers: {
          Authorization: `Bearer ${createAccessToken('')}`,
        },
      }
    );

    const { result } = response.data;
    console.log('Balance:', result.value);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error fetching balance:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error fetching balance, no response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
    }
  }
};

// Function to transfer funds
const transferFunds = async (to: string, amount: string) => {
  const body = JSON.stringify({
    to,
    currencyAddress: '0x0000000000000000000000000000000000000000', // Assuming Moonbeam uses 0x00 for native currency
    amount,
  });

  const accessToken = createAccessToken(body);

console.log(accessToken)

const newBody = JSON.stringify({
    to,
    currencyAddress: '0x0000000000000000000000000000000000000000', // Assuming Moonbeam uses 0x00 for native currency
    amount: "0.05"
  });

  try {
    const response = await axios.post(
      `${engineBaseUrl}/backend-wallet/${chain}/transfer`,
      newBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-backend-wallet-address': backendWalletAddress,
        },
      }
    );

    console.log('Transfer successful:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error transferring funds:', error.response.data);
    } else if (error.request) {
      console.error('Error transferring funds, no response received:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
  }
};

// Execute the function to get the balance and then transfer funds
const execute = async () => {
  await getBalance();
  await transferFunds(recipientAddress, '0.1'); // Transfer 0.1 units of the currency
};

execute();
