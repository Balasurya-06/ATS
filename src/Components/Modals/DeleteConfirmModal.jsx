import React from 'react';

/**
 * DeleteConfirmModal Component
 * PIN verification modal for deleting profiles
 */
function DeleteConfirmModal({ profileData, pin, setPin, onConfirm, onCancel }) {
    if (!profileData) return null;

    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000 
        }}>
            <div style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '16px', 
                maxWidth: '450px', 
                width: '100%', 
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)' 
            }}>
                {/* Modal Header */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', 
                    color: '#ffffff', 
                    padding: '24px', 
                    borderRadius: '16px 16px 0 0' 
                }}>
                    <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '12px' }}>🔒</div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>
                        Security Verification
                    </h2>
                    <div style={{ fontSize: '14px', opacity: '0.9', textAlign: 'center' }}>
                        High clearance operation requires PIN
                    </div>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '32px' }}>
                    <div style={{ 
                        backgroundColor: '#fef2f2', 
                        border: '2px solid #fecaca', 
                        borderRadius: '12px', 
                        padding: '16px', 
                        marginBottom: '24px' 
                    }}>
                        <div style={{ fontSize: '14px', color: '#991b1b', fontWeight: '600', marginBottom: '8px' }}>
                            ⚠️ WARNING: Profile Deletion
                        </div>
                        <div style={{ fontSize: '13px', color: '#7f1d1d' }}>
                            You are about to permanently delete the profile for:<br />
                            <strong style={{ fontSize: '14px', marginTop: '8px', display: 'block' }}>
                                {profileData.name}
                            </strong>
                            <br />
                            This action cannot be undone and will remove all associated data.
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ 
                            display: 'block', 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            color: '#374151', 
                            marginBottom: '8px' 
                        }}>
                            Enter Security PIN:
                        </label>
                        <input 
                            type="password" 
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && pin.length >= 4 && onConfirm()}
                            placeholder="Enter your 4-digit PIN"
                            maxLength={4}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                fontSize: '18px', 
                                border: '2px solid #e5e7eb', 
                                borderRadius: '8px', 
                                textAlign: 'center',
                                letterSpacing: '8px',
                                fontWeight: 'bold',
                                boxSizing: 'border-box'
                            }}
                            autoFocus
                        />
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', textAlign: 'center' }}>
                            Default PIN: 1234 (if not set)
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div style={{ 
                    padding: '16px 32px', 
                    borderTop: '1px solid #e5e7eb', 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '12px' 
                }}>
                    <button 
                        onClick={onCancel} 
                        style={{ 
                            background: '#6b7280', 
                            color: '#ffffff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            padding: '10px 24px', 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            cursor: 'pointer' 
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={pin.length < 4}
                        style={{ 
                            background: pin.length >= 4 ? '#dc2626' : '#9ca3af', 
                            color: '#ffffff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            padding: '10px 24px', 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            cursor: pin.length >= 4 ? 'pointer' : 'not-allowed' 
                        }}
                    >
                        🗑 Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmModal;
