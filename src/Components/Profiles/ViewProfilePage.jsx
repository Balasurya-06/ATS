import React from 'react';

/**
 * ViewProfilePage Component
 * Full page view for displaying detailed profile information
 */
function ViewProfilePage({ profile, onBack, onEdit }) {
    if (!profile) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                padding: '24px',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                    <h2 style={{ fontSize: '24px', color: '#1e3a8a', marginBottom: '16px' }}>Profile Not Found</h2>
                    <button 
                        onClick={onBack}
                        style={{ 
                            background: '#6b7280', 
                            color: '#ffffff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            padding: '12px 24px', 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            cursor: 'pointer' 
                        }}
                    >
                        ← Back to Profiles
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
            padding: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginBottom: '32px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                    padding: '24px',
                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                    color: '#ffffff'
                }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                            Profile Details
                        </h1>
                        <div style={{ fontSize: '14px', opacity: '0.9' }}>
                            Classification: {profile.fileClassification} | ID: {profile.profileId}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            onClick={onBack}
                            style={{ 
                                background: 'rgba(255,255,255,0.2)', 
                                color: '#ffffff', 
                                border: '1px solid rgba(255,255,255,0.3)', 
                                borderRadius: '8px', 
                                padding: '12px 24px', 
                                fontSize: '14px', 
                                fontWeight: '500', 
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                        >
                            ← Back to Profiles
                        </button>
                        <button 
                            onClick={() => onEdit(profile._id)}
                            style={{ 
                                background: '#f59e0b', 
                                color: '#ffffff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                padding: '12px 24px', 
                                fontSize: '14px', 
                                fontWeight: '500', 
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#d97706'}
                            onMouseOut={(e) => e.target.style.background = '#f59e0b'}
                        >
                            ✏ Edit Profile
                        </button>
                    </div>
                </div>

                {/* Content Cards */}
                <div style={{ display: 'grid', gap: '24px' }}>
                    {/* Basic Information */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '32px' }}>
                        <h3 style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold', 
                            color: '#1e3a8a', 
                            marginBottom: '20px', 
                            borderBottom: '3px solid #3b82f6', 
                            paddingBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span style={{ fontSize: '24px' }}>📋</span> Basic Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Profile ID</strong>
                                <div style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '18px', marginTop: '8px' }}>{profile.profileId}</div>
                            </div>
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</strong>
                                <div style={{ color: '#374151', fontWeight: '600', fontSize: '18px', marginTop: '8px' }}>{profile.name}</div>
                            </div>
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date of Birth</strong>
                                <div style={{ color: '#374151', fontWeight: '600', fontSize: '18px', marginTop: '8px' }}>{new Date(profile.dob).toLocaleDateString()}</div>
                            </div>
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Age</strong>
                                <div style={{ color: '#374151', fontWeight: '600', fontSize: '18px', marginTop: '8px' }}>{profile.age} years</div>
                            </div>
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gender</strong>
                                <div style={{ color: '#374151', fontWeight: '600', fontSize: '18px', marginTop: '8px' }}>{profile.gender}</div>
                            </div>
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nationality</strong>
                                <div style={{ color: '#374151', fontWeight: '600', fontSize: '18px', marginTop: '8px' }}>{profile.nationality || 'N/A'}</div>
                            </div>
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Religion</strong>
                                <div style={{ color: '#374151', fontWeight: '600', fontSize: '18px', marginTop: '8px' }}>{profile.religion || 'N/A'}</div>
                            </div>
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Caste</strong>
                                <div style={{ color: '#374151', fontWeight: '600', fontSize: '18px', marginTop: '8px' }}>{profile.caste || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Risk Assessment */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '32px' }}>
                        <h3 style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold', 
                            color: '#1e3a8a', 
                            marginBottom: '20px', 
                            borderBottom: '3px solid #ef4444', 
                            paddingBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span style={{ fontSize: '24px' }}>⚠️</span> Risk Assessment
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            <div style={{ padding: '20px', backgroundColor: '#fef2f2', borderRadius: '12px', border: '2px solid #fecaca' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Radicalization Level</strong>
                                <div style={{ marginTop: '12px' }}>
                                    <span style={{ 
                                        padding: '8px 20px', 
                                        borderRadius: '20px', 
                                        fontSize: '16px', 
                                        fontWeight: '700', 
                                        backgroundColor: profile.radicalizationLevel === 'High' ? '#fecaca' : 
                                                        profile.radicalizationLevel === 'Medium' ? '#fef3c7' : '#d1fae5', 
                                        color: profile.radicalizationLevel === 'High' ? '#991b1b' : 
                                               profile.radicalizationLevel === 'Medium' ? '#92400e' : '#166534',
                                        display: 'inline-block'
                                    }}>
                                        {profile.radicalizationLevel}
                                    </span>
                                </div>
                            </div>
                            <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monitoring Status</strong>
                                <div style={{ color: '#374151', fontWeight: '600', fontSize: '18px', marginTop: '12px' }}>{profile.monitoringStatus}</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '32px' }}>
                        <h3 style={{ 
                            fontSize: '20px', 
                            fontWeight: 'bold', 
                            color: '#1e3a8a', 
                            marginBottom: '20px', 
                            borderBottom: '3px solid #059669', 
                            paddingBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <span style={{ fontSize: '24px' }}>📞</span> Contact Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mobile</strong>
                                <div style={{ color: '#374151', fontWeight: '600', fontSize: '18px', marginTop: '8px' }}>{profile.mobile || 'N/A'}</div>
                            </div>
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</strong>
                                <div style={{ color: '#374151', fontWeight: '600', fontSize: '18px', marginTop: '8px', wordBreak: 'break-word' }}>{profile.email || 'N/A'}</div>
                            </div>
                            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', gridColumn: '1 / -1' }}>
                                <strong style={{ color: '#6b7280', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address</strong>
                                <div style={{ color: '#374151', fontWeight: '600', fontSize: '16px', marginTop: '8px', lineHeight: '1.6' }}>{profile.address || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* System Information */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '32px', border: '2px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '24px' }}>🖥️</span> System Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '14px' }}>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Created:</strong>
                                <div style={{ color: '#374151', marginTop: '4px' }}>{new Date(profile.createdAt).toLocaleString()}</div>
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Last Updated:</strong>
                                <div style={{ color: '#374151', marginTop: '4px' }}>{new Date(profile.updatedAt || profile.createdAt).toLocaleString()}</div>
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Updated By:</strong>
                                <div style={{ color: '#374151', marginTop: '4px' }}>{profile.lastUpdatedBy || 'system'}</div>
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Classification:</strong>
                                <div style={{ marginTop: '4px' }}>
                                    <span style={{ 
                                        padding: '4px 12px', 
                                        borderRadius: '12px', 
                                        fontSize: '12px', 
                                        fontWeight: '600', 
                                        backgroundColor: '#6b7280', 
                                        color: '#ffffff'
                                    }}>
                                        {profile.fileClassification}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{ 
                    marginTop: '32px', 
                    padding: '24px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                        <strong>Profile ID:</strong> {profile.profileId} | <strong>Status:</strong> Active
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            onClick={() => onEdit(profile._id)}
                            style={{ 
                                background: '#f59e0b', 
                                color: '#ffffff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                padding: '12px 32px', 
                                fontSize: '14px', 
                                fontWeight: '500', 
                                cursor: 'pointer' 
                            }}
                        >
                            ✏ Edit Profile
                        </button>
                        <button 
                            onClick={onBack}
                            style={{ 
                                background: '#6b7280', 
                                color: '#ffffff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                padding: '12px 32px', 
                                fontSize: '14px', 
                                fontWeight: '500', 
                                cursor: 'pointer' 
                            }}
                        >
                            Back to List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProfilePage;
