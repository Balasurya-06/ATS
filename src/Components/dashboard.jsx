import React, { useState, useEffect } from 'react';
import apiService from '../services/api.js';

const logoPath = '/src/images/logo.png';

import AddProfile from './addProfile.jsx';

function Dashboard() {
    const [page, setPage] = useState('dashboard');
    const [stats, setStats] = useState([
        { label: 'Total Profiles', value: '0', color: '#1e40af', bgColor: '#dbeafe', change: '+0' },
        { label: 'High-Risk Subjects', value: '0', color: '#dc2626', bgColor: '#fecaca', change: '+0' },
        { label: 'Under Surveillance', value: '0', color: '#f59e0b', bgColor: '#fef3c7', change: '+0' },
        { label: 'Recent Updates', value: '0', color: '#059669', bgColor: '#d1fae5', change: '+0' },
    ]);
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [viewProfile, setViewProfile] = useState(null);
    const [editProfile, setEditProfile] = useState(null);
    const [showPinModal, setShowPinModal] = useState(false);
    const [deleteProfileData, setDeleteProfileData] = useState(null);
    const [pin, setPin] = useState('');

    // Load dashboard statistics from backend
    useEffect(() => {
        loadDashboardStats();
    }, []);

    // Load profiles when navigating to profiles page
    useEffect(() => {
        if (page === 'profiles') {
            loadProfiles();
        }
    }, [page]);

    const loadDashboardStats = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await apiService.getStats();
            
            if (response.success) {
                const statsData = response.data;
                setStats([
                    { 
                        label: 'Total Profiles', 
                        value: statsData.totalProfiles.toString(),
                        color: '#1e40af', 
                        bgColor: '#dbeafe', 
                        change: `+${statsData.recentChanges?.newProfiles || 0}` 
                    },
                    { 
                        label: 'High-Risk Subjects', 
                        value: statsData.highRiskCount.toString(),
                        color: '#dc2626', 
                        bgColor: '#fecaca', 
                        change: `+${statsData.recentChanges?.highRisk || 0}` 
                    },
                    { 
                        label: 'Under Surveillance', 
                        value: statsData.activeMonitoring.toString(),
                        color: '#f59e0b', 
                        bgColor: '#fef3c7', 
                        change: `${statsData.recentChanges?.surveillance >= 0 ? '+' : ''}${statsData.recentChanges?.surveillance || 0}` 
                    },
                    { 
                        label: 'Recent Updates', 
                        value: statsData.recentUpdates.toString(),
                        color: '#059669', 
                        bgColor: '#d1fae5', 
                        change: `+${statsData.recentChanges?.updates || 0}` 
                    },
                ]);
            }
        } catch (error) {
            console.error('❌ Failed to load dashboard stats:', error);
            setError('Failed to load dashboard statistics. Using offline mode.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadProfiles = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await apiService.getProfiles({ page: 1, limit: 50 });
            console.log('📦 Profiles response:', response);
            if (response.success && response.data) {
                // Backend returns profiles in response.data.profiles
                const profilesList = response.data.profiles || [];
                console.log('✅ Loaded profiles:', profilesList.length);
                setProfiles(profilesList);
            } else {
                setProfiles([]);
            }
        } catch (error) {
            console.error('❌ Failed to load profiles:', error);
            setError('Failed to load profiles.');
            setProfiles([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Profile action handlers
    const handleViewProfile = async (profileId) => {
        try {
            setIsLoading(true);
            const response = await apiService.getProfile(profileId);
            if (response.success && response.data) {
                setViewProfile(response.data.profile);
            } else {
                setError('Failed to load profile details.');
            }
        } catch (error) {
            console.error('❌ Failed to view profile:', error);
            setError('Error loading profile details.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProfile = async (profileId) => {
        try {
            setIsLoading(true);
            const response = await apiService.getProfile(profileId);
            if (response.success && response.data) {
                setEditProfile(response.data.profile);
            } else {
                setError('Failed to load profile for editing.');
            }
        } catch (error) {
            console.error('❌ Failed to load profile:', error);
            setError('Error loading profile for editing.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProfile = (profileId, profileName) => {
        setDeleteProfileData({ id: profileId, name: profileName });
        setShowPinModal(true);
        setPin('');
    };

    const confirmDeleteProfile = async () => {
        // Verify PIN (using simple PIN check - you can enhance this)
        const correctPin = localStorage.getItem('userPin') || '1234'; // Default PIN
        
        if (pin !== correctPin) {
            alert('❌ Invalid PIN! Access denied.');
            setPin('');
            return;
        }

        try {
            setIsLoading(true);
            setShowPinModal(false);
            const response = await apiService.deleteProfile(deleteProfileData.id);
            if (response.success) {
                alert('✅ Profile deleted successfully.');
                // Reload profiles and stats after deletion
                loadProfiles();
                loadDashboardStats();
            } else {
                alert('❌ Failed to delete profile: ' + (response.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('❌ Failed to delete profile:', error);
            alert('❌ Error deleting profile: ' + error.message);
        } finally {
            setIsLoading(false);
            setDeleteProfileData(null);
            setPin('');
        }
    };

    if (page === 'add') {
        return <AddProfile onBack={() => {
            setPage('dashboard');
            // Reload stats after adding profile
            loadDashboardStats();
        }} />;
    }

    if (page === 'profiles') {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={logoPath} alt="Logo" style={{ width: '64px', height: '64px', marginRight: '24px' }} />
                            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>Database Access</h1>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button onClick={() => setPage('dashboard')} style={{ background: '#6b7280', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                                ← Back to Dashboard
                            </button>
                            <button 
                                onClick={() => loadProfiles()} 
                                disabled={isLoading}
                                style={{ 
                                    background: isLoading ? '#9ca3af' : '#059669', 
                                    color: '#ffffff', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    padding: '12px 24px', 
                                    fontSize: '14px', 
                                    fontWeight: '500', 
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {isLoading ? '⏳' : '🔄'} {isLoading ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px 24px', marginBottom: '24px', color: '#991b1b', fontSize: '14px' }}>
                            ❌ {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: '18px', color: '#6b7280', marginBottom: '12px' }}>⏳ Loading profiles...</div>
                            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Please wait while we fetch the data</div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && profiles.length === 0 && !error && (
                        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                            <div style={{ fontSize: '20px', fontWeight: '600', color: '#1e3a8a', marginBottom: '8px' }}>No Profiles Found</div>
                            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Start by adding your first profile to the database</div>
                            <button onClick={() => setPage('add')} style={{ background: '#1e40af', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                                + Add New Profile
                            </button>
                        </div>
                    )}

                    {/* Profiles List */}
                    {profiles.length > 0 && (
                        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px' }}>Registered Profiles ({profiles.length})</h2>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Profile ID</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Name</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Age</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Gender</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>DOB</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Risk Level</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Status</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Classification</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Last Updated</th>
                                            <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {profiles.map((profile, index) => (
                                            <tr key={profile._id || index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '12px', fontSize: '14px', color: '#1e3a8a', fontWeight: '500' }}>{profile.profileId || 'N/A'}</td>
                                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>{profile.name || 'N/A'}</td>
                                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{profile.age || 'N/A'}</td>
                                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{profile.gender || 'N/A'}</td>
                                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}</td>
                                                <td style={{ padding: '12px', fontSize: '14px' }}>
                                                    <span style={{ 
                                                        padding: '4px 12px', 
                                                        borderRadius: '12px', 
                                                        fontSize: '12px', 
                                                        fontWeight: '500',
                                                        backgroundColor: profile.radicalizationLevel === 'High' ? '#fecaca' : profile.radicalizationLevel === 'Medium' ? '#fef3c7' : '#d1fae5',
                                                        color: profile.radicalizationLevel === 'High' ? '#991b1b' : profile.radicalizationLevel === 'Medium' ? '#92400e' : '#166534'
                                                    }}>
                                                        {profile.radicalizationLevel || 'Low'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>{profile.monitoringStatus || 'N/A'}</td>
                                                <td style={{ padding: '12px', fontSize: '14px' }}>
                                                    <span style={{ 
                                                        padding: '4px 12px', 
                                                        borderRadius: '12px', 
                                                        fontSize: '12px', 
                                                        fontWeight: '500',
                                                        backgroundColor: profile.fileClassification === 'Top Secret' ? '#7f1d1d' : profile.fileClassification === 'Secret' ? '#dc2626' : '#6b7280',
                                                        color: '#ffffff'
                                                    }}>
                                                        {profile.fileClassification || 'Unclassified'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                                                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                                    <br />
                                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>by {profile.lastUpdatedBy || 'system'}</span>
                                                </td>
                                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                        <button 
                                                            onClick={() => handleViewProfile(profile._id)}
                                                            style={{ 
                                                                background: '#3b82f6', 
                                                                color: '#ffffff', 
                                                                border: 'none', 
                                                                borderRadius: '6px', 
                                                                padding: '6px 12px', 
                                                                fontSize: '12px', 
                                                                fontWeight: '500', 
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.2s'
                                                            }}
                                                            onMouseOver={(e) => e.target.style.background = '#2563eb'}
                                                            onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                                                        >
                                                            👁 View
                                                        </button>
                                                        <button 
                                                            onClick={() => handleEditProfile(profile._id)}
                                                            style={{ 
                                                                background: '#f59e0b', 
                                                                color: '#ffffff', 
                                                                border: 'none', 
                                                                borderRadius: '6px', 
                                                                padding: '6px 12px', 
                                                                fontSize: '12px', 
                                                                fontWeight: '500', 
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.2s'
                                                            }}
                                                            onMouseOver={(e) => e.target.style.background = '#d97706'}
                                                            onMouseOut={(e) => e.target.style.background = '#f59e0b'}
                                                        >
                                                            ✏ Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteProfile(profile._id, profile.name)}
                                                            style={{ 
                                                                background: '#dc2626', 
                                                                color: '#ffffff', 
                                                                border: 'none', 
                                                                borderRadius: '6px', 
                                                                padding: '6px 12px', 
                                                                fontSize: '12px', 
                                                                fontWeight: '500', 
                                                                cursor: 'pointer',
                                                                transition: 'background-color 0.2s'
                                                            }}
                                                            onMouseOver={(e) => e.target.style.background = '#b91c1c'}
                                                            onMouseOut={(e) => e.target.style.background = '#dc2626'}
                                                        >
                                                            🗑 Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            {/* System Notice Banner */}
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

            {/* Main Container */}
            <div style={{ 
                padding: '48px 32px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Header Section */}
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

                {/* Error Display */}
                {error && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '24px',
                        color: '#991b1b',
                        fontSize: '14px'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Statistics Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {stats.map((stat, idx) => (
                        <div key={stat.label} style={{ 
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
                                color: stat.change.startsWith('+') ? '#059669' : '#dc2626',
                                fontWeight: '600'
                            }}>
                                {stat.change.startsWith('+') ? '↗' : '↘'} {stat.change}
                            </div>
                            
                            <div style={{ 
                                width: '40px',
                                height: '40px',
                                backgroundColor: stat.bgColor,
                                borderRadius: '8px',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: stat.color,
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
                                {stat.value}
                            </div>
                            <div style={{ 
                                fontSize: '14px', 
                                fontWeight: '500', 
                                color: '#64748b'
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Center */}
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
                            onClick={() => setPage('add')} 
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
                            onClick={() => setPage('profiles')}
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

                        {/* <button style={{ 
                            background: '#7c2d12',
                            color: '#ffffff', 
                            border: 'none', 
                            borderRadius: '10px', 
                            padding: '20px', 
                            fontSize: '15px', 
                            fontWeight: '500', 
                            cursor: 'pointer', 
                            boxShadow: '0 2px 8px rgba(124, 45, 18, 0.2)',
                            transition: 'all 0.2s ease',
                            textAlign: 'left'
                        }}
                            onMouseOver={e => {
                                e.target.style.backgroundColor = '#6c2d0f';
                                e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={e => {
                                e.target.style.backgroundColor = '#7c2d12';
                                e.target.style.transform = 'translateY(0px)';
                            }}
                        >
                            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                                Threat Assessment
                            </div>
                            <div style={{ fontSize: '13px', opacity: '0.9' }}>
                                Generate risk analysis and intelligence reports
                            </div>
                        </button> */}

                        {/* <button style={{ 
                            background: '#374151',
                            color: '#ffffff', 
                            border: 'none', 
                            borderRadius: '10px', 
                            padding: '20px', 
                            fontSize: '15px', 
                            fontWeight: '500', 
                            cursor: 'pointer', 
                            boxShadow: '0 2px 8px rgba(55, 65, 81, 0.2)',
                            transition: 'all 0.2s ease',
                            textAlign: 'left'
                        }}
                            onMouseOver={e => {
                                e.target.style.backgroundColor = '#1f2937';
                                e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={e => {
                                e.target.style.backgroundColor = '#374151';
                                e.target.style.transform = 'translateY(0px)';
                            }}
                        >
                            <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                                System Administration
                            </div>
                            <div style={{ fontSize: '13px', opacity: '0.9' }}>
                                User management and system configuration
                            </div>
                        </button> */}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ 
                    textAlign: 'center',
                    marginTop: '40px',
                    padding: '20px',
                    color: '#94a3b8',
                    fontSize: '13px'
                }}>
                    <div style={{ marginBottom: '8px' }}>
                        ACCUST Management System v2.1.0 | Classified Database Access
                    </div>
                    <div>
                        Last system update: January 2025 | Server status: Online
                    </div>
                </div>
            </div>

            {/* View Profile Modal */}
            {viewProfile && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        {/* Modal Header */}
                        <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: '#ffffff', padding: '24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Profile Details</h2>
                                <div style={{ fontSize: '14px', opacity: '0.9' }}>Classified: {viewProfile.fileClassification}</div>
                            </div>
                            <button onClick={() => setViewProfile(null)} style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '32px' }}>
                            {/* Basic Information */}
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>📋 Basic Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    <div><strong style={{ color: '#6b7280' }}>Profile ID:</strong> <span style={{ color: '#1e3a8a', fontWeight: '600' }}>{viewProfile.profileId}</span></div>
                                    <div><strong style={{ color: '#6b7280' }}>Full Name:</strong> {viewProfile.name}</div>
                                    <div><strong style={{ color: '#6b7280' }}>Date of Birth:</strong> {new Date(viewProfile.dob).toLocaleDateString()}</div>
                                    <div><strong style={{ color: '#6b7280' }}>Age:</strong> {viewProfile.age} years</div>
                                    <div><strong style={{ color: '#6b7280' }}>Gender:</strong> {viewProfile.gender}</div>
                                    <div><strong style={{ color: '#6b7280' }}>Nationality:</strong> {viewProfile.nationality || 'N/A'}</div>
                                    <div><strong style={{ color: '#6b7280' }}>Religion:</strong> {viewProfile.religion || 'N/A'}</div>
                                    <div><strong style={{ color: '#6b7280' }}>Caste:</strong> {viewProfile.caste || 'N/A'}</div>
                                </div>
                            </div>

                            {/* Risk Assessment */}
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>⚠️ Risk Assessment</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    <div>
                                        <strong style={{ color: '#6b7280' }}>Radicalization Level:</strong>
                                        <div style={{ marginTop: '8px' }}>
                                            <span style={{ padding: '6px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: viewProfile.radicalizationLevel === 'High' ? '#fecaca' : viewProfile.radicalizationLevel === 'Medium' ? '#fef3c7' : '#d1fae5', color: viewProfile.radicalizationLevel === 'High' ? '#991b1b' : viewProfile.radicalizationLevel === 'Medium' ? '#92400e' : '#166534' }}>
                                                {viewProfile.radicalizationLevel}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#6b7280' }}>Monitoring Status:</strong>
                                        <div style={{ marginTop: '8px', fontSize: '14px', color: '#374151' }}>{viewProfile.monitoringStatus}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>📞 Contact Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                    <div><strong style={{ color: '#6b7280' }}>Mobile:</strong> {viewProfile.mobile || 'N/A'}</div>
                                    <div><strong style={{ color: '#6b7280' }}>Email:</strong> {viewProfile.email || 'N/A'}</div>
                                    <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Address:</strong> {viewProfile.address || 'N/A'}</div>
                                </div>
                            </div>

                            {/* System Information */}
                            <div style={{ marginBottom: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px' }}>🖥️ System Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '14px' }}>
                                    <div><strong style={{ color: '#6b7280' }}>Created:</strong> {new Date(viewProfile.createdAt).toLocaleString()}</div>
                                    <div><strong style={{ color: '#6b7280' }}>Last Updated:</strong> {new Date(viewProfile.updatedAt || viewProfile.createdAt).toLocaleString()}</div>
                                    <div><strong style={{ color: '#6b7280' }}>Updated By:</strong> {viewProfile.lastUpdatedBy || 'system'}</div>
                                    <div><strong style={{ color: '#6b7280' }}>Classification:</strong> <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: '#6b7280', color: '#ffffff' }}>{viewProfile.fileClassification}</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '16px 32px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => { setViewProfile(null); handleEditProfile(viewProfile._id); }} style={{ background: '#f59e0b', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>✏ Edit Profile</button>
                            <button onClick={() => setViewProfile(null)} style={{ background: '#6b7280', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {editProfile && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '600px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        {/* Modal Header */}
                        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', color: '#ffffff', padding: '24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Edit Profile</h2>
                                <div style={{ fontSize: '14px', opacity: '0.9' }}>Profile ID: {editProfile.profileId}</div>
                            </div>
                            <button onClick={() => setEditProfile(null)} style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '32px', textAlign: 'center' }}>
                            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚧</div>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '12px' }}>Edit Functionality Coming Soon</h3>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                                The profile editing feature is currently under development. For now, you can view profile details and create new profiles.
                                <br /><br />
                                To modify this profile, please contact your system administrator or use the database management tools.
                            </p>
                            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', marginTop: '24px' }}>
                                <div style={{ fontSize: '14px', color: '#374151', textAlign: 'left' }}>
                                    <strong>Current Profile:</strong> {editProfile.name}<br />
                                    <strong>ID:</strong> {editProfile.profileId}<br />
                                    <strong>Status:</strong> {editProfile.monitoringStatus}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '16px 32px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button onClick={() => setEditProfile(null)} style={{ background: '#6b7280', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* PIN Verification Modal for Delete */}
            {showPinModal && deleteProfileData && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '450px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                        {/* Modal Header */}
                        <div style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', color: '#ffffff', padding: '24px', borderRadius: '16px 16px 0 0' }}>
                            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '12px' }}>🔒</div>
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>Security Verification</h2>
                            <div style={{ fontSize: '14px', opacity: '0.9', textAlign: 'center' }}>High clearance operation requires PIN</div>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '32px' }}>
                            <div style={{ backgroundColor: '#fef2f2', border: '2px solid #fecaca', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                                <div style={{ fontSize: '14px', color: '#991b1b', fontWeight: '600', marginBottom: '8px' }}>⚠️ WARNING: Profile Deletion</div>
                                <div style={{ fontSize: '13px', color: '#7f1d1d' }}>
                                    You are about to permanently delete the profile for:<br />
                                    <strong style={{ fontSize: '14px', marginTop: '8px', display: 'block' }}>{deleteProfileData.name}</strong>
                                    <br />
                                    This action cannot be undone and will remove all associated data.
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Enter Security PIN:</label>
                                <input 
                                    type="password" 
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && confirmDeleteProfile()}
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
                                        fontWeight: 'bold'
                                    }}
                                    autoFocus
                                />
                                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', textAlign: 'center' }}>
                                    Default PIN: 1234 (if not set)
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{ padding: '16px 32px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                onClick={() => { setShowPinModal(false); setDeleteProfileData(null); setPin(''); }} 
                                style={{ background: '#6b7280', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDeleteProfile}
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
            )}
        </div>
    );
}

export default Dashboard;