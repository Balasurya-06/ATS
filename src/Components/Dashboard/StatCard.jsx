import React from 'react';

/**
 * StatCard Component
 * Displays a single statistic card with value, label, and change indicator
 */
function StatCard({ label, value, color, bgColor, change }) {
    return (
        <div style={{ 
            background: '#ffffff',
            borderRadius: '12px', 
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)', 
            padding: '24px',
            border: '1px solid #f1f5f9',
            position: 'relative'
        }}>
            <div style={{ 
                position: 'absolute', 
                top: '16px', 
                right: '16px',
                fontSize: '12px', 
                color: change.startsWith('+') ? '#059669' : '#dc2626',
                fontWeight: '600'
            }}>
                {change.startsWith('+') ? '↗' : '↘'} {change}
            </div>
            
            <div style={{ 
                width: '40px',
                height: '40px',
                backgroundColor: bgColor,
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    borderRadius: '4px'
                }}></div>
            </div>
            
            <div style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#1e293b',
                marginBottom: '4px',
                lineHeight: 1
            }}>
                {value}
            </div>
            <div style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#64748b'
            }}>
                {label}
            </div>
        </div>
    );
}

export default StatCard;
