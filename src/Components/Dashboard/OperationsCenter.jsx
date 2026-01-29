import React from 'react';

/**
 * OperationsCenter Component
 * Displays action buttons for main operations
 */
function OperationsCenter({ onAddProfile, onViewProfiles, onAIChat }) {
    return (
        <div style={{ 
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '40px',
            border: '1px solid #e2e8f0'
        }}>
            <h2 style={{ 
                fontSize: '20px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '8px',
                textAlign: 'center'
            }}>
                Operations Center
            </h2>
            <p style={{ 
                color: '#64748b',
                marginBottom: '32px',
                fontSize: '14px',
                textAlign: 'center'
            }}>
                Access primary system functions and database operations
            </p>
            
            <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
            }}>
                <button 
                    onClick={onAddProfile} 
                    style={{ 
                        background: '#1e40af',
                        color: '#ffffff', 
                        border: 'none', 
                        borderRadius: '10px', 
                        padding: '20px', 
                        fontSize: '15px', 
                        fontWeight: '500', 
                        cursor: 'pointer', 
                        boxShadow: '0 2px 8px rgba(30, 64, 175, 0.2)',
                        transition: 'all 0.2s ease',
                        textAlign: 'left'
                    }}
                    onMouseOver={e => {
                        e.target.style.backgroundColor = '#1e3a8a';
                        e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={e => {
                        e.target.style.backgroundColor = '#1e40af';
                        e.target.style.transform = 'translateY(0px)';
                    }}
                >
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                        Add New Profile
                    </div>
                    <div style={{ fontSize: '13px', opacity: '0.9' }}>
                        Register new accused/suspect with complete intelligence data
                    </div>
                </button>

                <button 
                    onClick={onViewProfiles}
                    style={{ 
                        background: '#059669',
                        color: '#ffffff', 
                        border: 'none', 
                        borderRadius: '10px', 
                        padding: '20px', 
                        fontSize: '15px', 
                        fontWeight: '500', 
                        cursor: 'pointer', 
                        boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)',
                        transition: 'all 0.2s ease',
                        textAlign: 'left'
                    }}
                    onMouseOver={e => {
                        e.target.style.backgroundColor = '#047857';
                        e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={e => {
                        e.target.style.backgroundColor = '#059669';
                        e.target.style.transform = 'translateY(0px)';
                    }}
                >
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                        Database Access
                    </div>
                    <div style={{ fontSize: '13px', opacity: '0.9' }}>
                        Search, view and manage all registered profiles
                    </div>
                </button>

                <button 
                    onClick={onAIChat}
                    style={{ 
                        background: '#6366f1',
                        color: '#ffffff', 
                        border: 'none', 
                        borderRadius: '10px', 
                        padding: '20px', 
                        fontSize: '15px', 
                        fontWeight: '500', 
                        cursor: 'pointer', 
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)',
                        transition: 'all 0.2s ease',
                        textAlign: 'left'
                    }}
                    onMouseOver={e => {
                        e.target.style.backgroundColor = '#4f46e5';
                        e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={e => {
                        e.target.style.backgroundColor = '#6366f1';
                        e.target.style.transform = 'translateY(0px)';
                    }}
                >
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                        🤖 AI Assistant
                    </div>
                    <div style={{ fontSize: '13px', opacity: '0.9' }}>
                        Chat with AI for intelligence analysis and insights
                    </div>
                </button>
            </div>
        </div>
    );
}

export default OperationsCenter;
