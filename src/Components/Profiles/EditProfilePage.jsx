import React, { useState, useEffect } from 'react';

/**
 * EditProfilePage Component
 * Full page for editing profile information
 */
function EditProfilePage({ profile, onBack, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        age: '',
        gender: '',
        nationality: '',
        religion: '',
        caste: '',
        mobile: '',
        email: '',
        address: '',
        radicalizationLevel: '',
        monitoringStatus: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                dob: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '',
                age: profile.age || '',
                gender: profile.gender || '',
                nationality: profile.nationality || '',
                religion: profile.religion || '',
                caste: profile.caste || '',
                mobile: profile.mobile || '',
                email: profile.email || '',
                address: profile.address || '',
                radicalizationLevel: profile.radicalizationLevel || '',
                monitoringStatus: profile.monitoringStatus || ''
            });
        }
    }, [profile]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            await onSave(profile._id, formData);
        } catch (err) {
            setError('Failed to save profile. Please try again.');
            setIsSaving(false);
        }
    };

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
                    marginBottom: '32px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                    padding: '24px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                    color: '#ffffff'
                }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                        ✏️ Edit Profile
                    </h1>
                    <div style={{ fontSize: '14px', opacity: '0.9' }}>
                        Profile ID: {profile.profileId} | Classification: {profile.fileClassification}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{ 
                        marginBottom: '24px', 
                        padding: '16px', 
                        backgroundColor: '#fef2f2', 
                        border: '2px solid #fecaca', 
                        borderRadius: '12px',
                        color: '#991b1b',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '32px', marginBottom: '24px' }}>
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
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    required
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Date of Birth
                                </label>
                                <input 
                                    type="date" 
                                    value={formData.dob}
                                    onChange={(e) => handleInputChange('dob', e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Age
                                </label>
                                <input 
                                    type="number" 
                                    value={formData.age}
                                    onChange={(e) => handleInputChange('age', e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Gender
                                </label>
                                <select 
                                    value={formData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Nationality
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.nationality}
                                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Religion
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.religion}
                                    onChange={(e) => handleInputChange('religion', e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Caste
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.caste}
                                    onChange={(e) => handleInputChange('caste', e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Risk Assessment */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '32px', marginBottom: '24px' }}>
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
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Radicalization Level
                                </label>
                                <select 
                                    value={formData.radicalizationLevel}
                                    onChange={(e) => handleInputChange('radicalizationLevel', e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="">Select Level</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Monitoring Status
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.monitoringStatus}
                                    onChange={(e) => handleInputChange('monitoringStatus', e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '32px', marginBottom: '24px' }}>
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
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Mobile Number
                                </label>
                                <input 
                                    type="tel" 
                                    value={formData.mobile}
                                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                                    Address
                                </label>
                                <textarea 
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    rows="3"
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        border: '2px solid #e5e7eb', 
                                        borderRadius: '8px', 
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ 
                        padding: '24px', 
                        backgroundColor: '#ffffff', 
                        borderRadius: '16px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px'
                    }}>
                        <button 
                            type="button"
                            onClick={onBack}
                            disabled={isSaving}
                            style={{ 
                                background: '#6b7280', 
                                color: '#ffffff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                padding: '12px 32px', 
                                fontSize: '14px', 
                                fontWeight: '500', 
                                cursor: isSaving ? 'not-allowed' : 'pointer',
                                opacity: isSaving ? 0.6 : 1
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSaving}
                            style={{ 
                                background: isSaving ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                                color: '#ffffff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                padding: '12px 32px', 
                                fontSize: '14px', 
                                fontWeight: '500', 
                                cursor: isSaving ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {isSaving ? (
                                <>
                                    <span style={{ 
                                        width: '14px', 
                                        height: '14px', 
                                        border: '2px solid #ffffff', 
                                        borderTopColor: 'transparent', 
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite',
                                        display: 'inline-block'
                                    }} />
                                    Saving...
                                </>
                            ) : (
                                <>💾 Save Changes</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default EditProfilePage;
