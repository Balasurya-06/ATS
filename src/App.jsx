import React, { useState, useEffect } from 'react';
import Preload from './Components/preload.jsx';
import PinPage from './Components/pin.jsx';
import Dashboard from './Components/dashboard.jsx';

function App() {
  const [step, setStep] = useState('preload');

  useEffect(() => {
    if (step === 'preload') {
      const timer = setTimeout(() => setStep('pin'), 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (step === 'preload') {
    return <Preload />;
  }
  if (step === 'pin') {
    return <PinPage onSuccess={() => setStep('dashboard')} />;
  }
  if (step === 'dashboard') {
    return <Dashboard />;
  }
  return null;
}

export default App;
