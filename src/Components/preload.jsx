
import React, { useEffect, useState } from 'react';

const logoPath = '/src/images/logo.png';

function DotLoader() {
	return (
		<div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
			<span className="dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#333', display: 'inline-block', animation: 'dot-blink 1s infinite' }}></span>
			<span className="dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#333', display: 'inline-block', animation: 'dot-blink 1s infinite 0.2s' }}></span>
			<span className="dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#333', display: 'inline-block', animation: 'dot-blink 1s infinite 0.4s' }}></span>
			<style>{`
				@keyframes dot-blink {
					0%, 80%, 100% { opacity: 0.3; }
					40% { opacity: 1; }
				}
			`}</style>
		</div>
	);
}

function Preload() {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setVisible(false), 5000);
		return () => clearTimeout(timer);
	}, []);

	if (!visible) return null;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#fff' }}>
			<img src={logoPath} alt="Logo" style={{ width: 120, height: 'auto', marginBottom: 24 }} />
			<DotLoader />
		</div>
	);
}

export default Preload;
