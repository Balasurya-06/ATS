import React from 'react';
import ProfilesTable from './ProfilesTable';

/**
 * ProfilesPage Component
 * Page for viewing and managing all profiles
 */
function ProfilesPage({ 
    logoPath, 
    profiles, 
    isLoading, 
    error, 
    onBack, 
    onRefresh, 
    onAddNew,
    onViewProfile, 
    onEditProfile, 
    onDeleteProfile 
}) {
    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
            padding: '24px', 
            fontFamily: 'system-ui, -apple-system, sans-serif' 
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    marginBottom: '32px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                    padding: '24px' 
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logoPath} alt="Logo" style={{ width: '64px', height: '64px', marginRight: '24px' }} />
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>
                            Database Access
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                            ← Back to Dashboard
                        </button>
                        <button 
                            onClick={onRefresh} 
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
                    <div style={{ 
                        backgroundColor: '#fef2f2', 
                        border: '1px solid #fecaca', 
                        borderRadius: '12px', 
                        padding: '16px 24px', 
                        marginBottom: '24px', 
                        color: '#991b1b', 
                        fontSize: '14px' 
                    }}>
                        ❌ {error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px', 
                        backgroundColor: '#ffffff', 
                        borderRadius: '16px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }}>
                        <div style={{ fontSize: '18px', color: '#6b7280', marginBottom: '12px' }}>
                            ⏳ Loading profiles...
                        </div>
                        <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                            Please wait while we fetch the data
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && profiles.length === 0 && !error && (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px', 
                        backgroundColor: '#ffffff', 
                        borderRadius: '16px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                        <div style={{ fontSize: '20px', fontWeight: '600', color: '#1e3a8a', marginBottom: '8px' }}>
                            No Profiles Found
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
                            Start by adding your first profile to the database
                        </div>
                        <button 
                            onClick={onAddNew} 
                            style={{ 
                                background: '#1e40af', 
                                color: '#ffffff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                padding: '12px 24px', 
                                fontSize: '14px', 
                                fontWeight: '500', 
                                cursor: 'pointer' 
                            }}
                        >
                            + Add New Profile
                        </button>
                    </div>
                )}

                {/* Profiles List */}
                {!isLoading && profiles.length > 0 && (
                    <ProfilesTable 
                        profiles={profiles}
                        onView={onViewProfile}
                        onEdit={onEditProfile}
                        onDelete={onDeleteProfile}
                    />
                )}
            </div>
        </div>
    );
}

export default ProfilesPage;
