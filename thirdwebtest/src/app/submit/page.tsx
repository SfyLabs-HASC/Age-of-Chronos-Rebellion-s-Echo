// src/app/SubmitData.tsx
'use client';
import React, { useState } from 'react';

const SubmitData: React.FC = () => {
  const [solidityFunction, setsolidityFunction] = useState('');
  const [rykerTokenId, setRykerTokenId] = useState('');
  const [lunaTokenId, setLunaTokenId] = useState('');
  const [ariaTokenId, setAriaTokenId] = useState('');
  const [thaddeusTokenId, setThaddeusTokenId] = useState('');
  const [key, setKey] = useState('');
  const [response, setResponse] = useState(null);

  async function sendData() {
    const response = await fetch('/api/davide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ solidityFunction, rykerTokenId, lunaTokenId, ariaTokenId, thaddeusTokenId, key })
    });

    const result = await response.json();
    setResponse(result);
  }

  return (
    <div>
      <h1>Invia Dati a Davide</h1>
      <input
        type="text"
        placeholder="solidityFunction Nome"
        value={solidityFunction}
        onChange={(e) => setsolidityFunction(e.target.value)}
      />
      <input
        type="text"
        placeholder="Ryker Token ID"
        value={rykerTokenId}
        onChange={(e) => setRykerTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Luna Token ID"
        value={lunaTokenId}
        onChange={(e) => setLunaTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Aria Token ID"
        value={ariaTokenId}
        onChange={(e) => setAriaTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Thaddeus Token ID"
        value={thaddeusTokenId}
        onChange={(e) => setThaddeusTokenId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <button onClick={sendData}>Invia</button>
      {response && (
        <div>
          <h2>Risposta del server:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SubmitData;
