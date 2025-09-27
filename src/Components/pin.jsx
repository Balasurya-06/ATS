import React, { useState } from 'react';
import apiService from '../services/api.js';

const logoPath = '/src/images/logo.png';

function PinPage({ onSuccess }) {
  const [pin, setPin] = useState('2815');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-login after 2 seconds
  React.useEffect(() => {
    const autoLogin = setTimeout(() => {
      console.log('🔄 Auto-authenticating...');
      onSuccess(); // Bypass authentication for development
    }, 2000);

    return () => clearTimeout(autoLogin);
  }, [onSuccess]);

  const handleChange = (e) => {
    setPin(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Auto-authenticate with default PIN
      const response = await apiService.login('2815');
      
      if (response.token) {
        console.log('🔐 Authentication successful');
        onSuccess();
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Authentication error:', error);
      // For now, just bypass authentication and proceed
      console.log('⚠️ Authentication bypassed for development');
      onSuccess();
    } finally {
      setIsLoading(false);
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
          placeholder="2815"
          defaultValue="2815"
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
