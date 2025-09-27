import React, { useState } from 'react';

const logoPath = '/src/images/logo.png';
const CORRECT_PIN = '1425';

function PinPage({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setPin(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      onSuccess();
    } else {
      setError('Incorrect PIN. Try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8f8f8' }}>
      <img src={logoPath} alt="Logo" style={{ width: 100, height: 'auto', marginBottom: 24 }} />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <input
          type="password"
          value={pin}
          onChange={handleChange}
          maxLength={4}
          placeholder="Enter PIN"
          style={{ fontSize: 24, padding: '8px 16px', borderRadius: 8, border: '1px solid #ccc', textAlign: 'center', width: 120 }}
        />
        <button type="submit" style={{ fontSize: 18, padding: '8px 24px', borderRadius: 8, background: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Unlock
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}

export default PinPage;
