import React from 'react';

/**
 * ViewProfileModal Component
 * Modal for displaying detailed profile information
 */
function ViewProfileModal({ profile, onClose, onEdit }) {
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
                maxWidth: '900px', 
                width: '100%', 
                maxHeight: '90vh', 
                overflow: 'auto', 
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)' 
            }}>
                {/* Modal Header */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', 
                    color: '#ffffff', 
                    padding: '24px', 
                    borderRadius: '16px 16px 0 0', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                            Profile Details
                        </h2>
                        <div style={{ fontSize: '14px', opacity: '0.9' }}>
                            Classified: {profile.fileClassification}
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
                <div style={{ padding: '32px' }}>
                    {/* Basic Information */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            color: '#1e3a8a', 
                            marginBottom: '16px', 
                            borderBottom: '2px solid #e5e7eb', 
                            paddingBottom: '8px' 
                        }}>
                            📋 Basic Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Profile ID:</strong> 
                                <span style={{ color: '#1e3a8a', fontWeight: '600' }}> {profile.profileId}</span>
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Full Name:</strong> {profile.name}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Age:</strong> {profile.age} years
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Gender:</strong> {profile.gender}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Nationality:</strong> {profile.nationality || 'N/A'}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Religion:</strong> {profile.religion || 'N/A'}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Caste:</strong> {profile.caste || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Risk Assessment */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            color: '#1e3a8a', 
                            marginBottom: '16px', 
                            borderBottom: '2px solid #e5e7eb', 
                            paddingBottom: '8px' 
                        }}>
                            ⚠️ Risk Assessment
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Radicalization Level:</strong>
                                <div style={{ marginTop: '8px' }}>
                                    <span style={{ 
                                        padding: '6px 16px', 
                                        borderRadius: '12px', 
                                        fontSize: '14px', 
                                        fontWeight: '600', 
                                        backgroundColor: profile.radicalizationLevel === 'High' ? '#fecaca' : 
                                                        profile.radicalizationLevel === 'Medium' ? '#fef3c7' : '#d1fae5', 
                                        color: profile.radicalizationLevel === 'High' ? '#991b1b' : 
                                               profile.radicalizationLevel === 'Medium' ? '#92400e' : '#166534' 
                                    }}>
                                        {profile.radicalizationLevel}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Monitoring Status:</strong>
                                <div style={{ marginTop: '8px', fontSize: '14px', color: '#374151' }}>
                                    {profile.monitoringStatus}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            color: '#1e3a8a', 
                            marginBottom: '16px', 
                            borderBottom: '2px solid #e5e7eb', 
                            paddingBottom: '8px' 
                        }}>
                            📞 Contact Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Mobile:</strong> {profile.mobile || 'N/A'}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Email:</strong> {profile.email || 'N/A'}
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <strong style={{ color: '#6b7280' }}>Address:</strong> {profile.address || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* System Information */}
                    <div style={{ marginBottom: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px' }}>
                            🖥️ System Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '14px' }}>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Created:</strong> {new Date(profile.createdAt).toLocaleString()}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Last Updated:</strong> {new Date(profile.updatedAt || profile.createdAt).toLocaleString()}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Updated By:</strong> {profile.lastUpdatedBy || 'system'}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Classification:</strong> 
                                <span style={{ 
                                    padding: '4px 12px', 
                                    borderRadius: '12px', 
                                    fontSize: '12px', 
                                    fontWeight: '500', 
                                    backgroundColor: '#6b7280', 
                                    color: '#ffffff',
                                    marginLeft: '8px'
                                }}>
                                    {profile.fileClassification}
                                </span>
                            </div>
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
                        onClick={() => { onClose(); onEdit(profile._id); }} 
                        style={{ 
                            background: '#f59e0b', 
                            color: '#ffffff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            padding: '10px 24px', 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            cursor: 'pointer' 
                        }}
                    >
                        ✏ Edit Profile
                    </button>
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

export default ViewProfileModal;
