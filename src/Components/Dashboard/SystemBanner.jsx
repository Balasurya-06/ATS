import React from 'react';

/**
 * SystemBanner Component
 * Displays system-wide notices at the top of the page
 */
function SystemBanner() {
    return (
        <div style={{ 
            background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
            color: '#ffffff', 
            padding: '12px 32px', 
            fontWeight: '500', 
            fontSize: '14px',
            boxShadow: '0 2px 8px rgba(30, 64, 175, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <span>
                <strong>System Notice:</strong> Daily backup scheduled for 03:00 hrs. New threat assessment module available.
            </span>
        </div>
    );
}

export default SystemBanner;
