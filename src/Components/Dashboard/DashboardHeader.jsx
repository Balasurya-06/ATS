import React from 'react';

/**
 * DashboardHeader Component
 * Displays the main header with logo and title
 */
function DashboardHeader({ logoPath }) {
    return (
        <div style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
            padding: '40px',
            marginBottom: '32px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <img src={logoPath} alt="Logo" style={{ width: '48px', height: '48px', marginRight: '16px' }} />
                <h1 style={{ 
                    fontWeight: '600', 
                    fontSize: '28px', 
                    color: '#1e293b',
                    margin: 0,
                    letterSpacing: '-0.25px'
                }}>
                    ACCUST Management Console
                </h1>
            </div>
            <p style={{ 
                color: '#64748b', 
                fontSize: '16px', 
                margin: 0,
                fontWeight: '400'
            }}>
                Secure intelligence database for law enforcement operations
            </p>
        </div>
    );
}

export default DashboardHeader;
