import React from 'react';

/**
 * EditProfileModal Component
 * Modal for editing profile (currently placeholder)
 */
function EditProfileModal({ profile, onClose }) {
    if (!profile) return null;

    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1000, 
            padding: '24px' 
        }}>
            <div style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '16px', 
                maxWidth: '600px', 
                width: '100%', 
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)' 
            }}>
                {/* Modal Header */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', 
                    color: '#ffffff', 
                    padding: '24px', 
                    borderRadius: '16px 16px 0 0', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                            Edit Profile
                        </h2>
                        <div style={{ fontSize: '14px', opacity: '0.9' }}>
                            Profile ID: {profile.profileId}
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            background: 'rgba(255,255,255,0.2)', 
                            color: '#ffffff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            padding: '8px 16px', 
                            fontSize: '16px', 
                            cursor: 'pointer', 
                            fontWeight: 'bold' 
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '32px', textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚧</div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '12px' }}>
                        Edit Functionality Coming Soon
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                        The profile editing feature is currently under development. For now, you can view profile details and create new profiles.
                        <br /><br />
                        To modify this profile, please contact your system administrator or use the database management tools.
                    </p>
                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', marginTop: '24px' }}>
                        <div style={{ fontSize: '14px', color: '#374151', textAlign: 'left' }}>
                            <strong>Current Profile:</strong> {profile.name}<br />
                            <strong>ID:</strong> {profile.profileId}<br />
                            <strong>Status:</strong> {profile.monitoringStatus}
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
                        onClick={onClose} 
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
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfileModal;
