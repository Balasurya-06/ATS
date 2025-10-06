import React, { useState } from 'react';
import apiService from '../services/api.js';

const logoPath = '/src/images/logo.png';

function PinPage({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Remove auto-login effect

  const handleChange = (e) => {
    setPin(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Only allow PIN 2552
    if (pin === '2552') {
      // Optionally, call backend for logging or session
      // await apiService.login('2552');
      onSuccess();
    } else {
      setError('Wrong pass. Please try again.');
    }
    setIsLoading(false);
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
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            fontSize: 18, 
            padding: '8px 24px', 
            borderRadius: 8, 
            background: isLoading ? '#666' : '#333', 
            color: '#fff', 
            border: 'none', 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Authenticating...' : 'Unlock'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 8, maxWidth: '300px', textAlign: 'center' }}>{error}</div>}
      </form>
    </div>
  );
}

export default PinPage;
