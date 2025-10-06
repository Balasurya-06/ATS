import React, { useState, useEffect } from 'react';
import apiService from '../services/api.js';

// Import Dashboard Components
import SystemBanner from './Dashboard/SystemBanner';
import DashboardHeader from './Dashboard/DashboardHeader';
import StatCard from './Dashboard/StatCard';
import OperationsCenter from './Dashboard/OperationsCenter';

// Import Profile Components
import ProfilesPage from './Profiles/ProfilesPage';
import AddProfile from './addProfile.jsx';
import ViewProfilePage from './Profiles/ViewProfilePage';
import EditProfilePage from './Profiles/EditProfilePage';

// Import Modal Components (only for delete confirmation)
import DeleteConfirmModal from './Modals/DeleteConfirmModal';

const logoPath = '/src/images/logo.png';

/**
 * Main Dashboard Component
 * Manages the entire application state and navigation
 */
function Dashboard() {
    // Navigation State
    const [page, setPage] = useState('dashboard'); // 'dashboard' | 'add' | 'profiles' | 'viewProfile' | 'editProfile'
    
    // Data State
    const [stats, setStats] = useState([
        { label: 'Total Profiles', value: '0', color: '#1e40af', bgColor: '#dbeafe', change: '+0' },
        { label: 'High-Risk Subjects', value: '0', color: '#dc2626', bgColor: '#fecaca', change: '+0' },
        { label: 'Under Surveillance', value: '0', color: '#f59e0b', bgColor: '#fef3c7', change: '+0' },
        { label: 'Recent Updates', value: '0', color: '#059669', bgColor: '#d1fae5', change: '+0' },
    ]);
    const [profiles, setProfiles] = useState([]);
    
    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Selected Profile State
    const [selectedProfile, setSelectedProfile] = useState(null);
    
    // Delete Modal State (only modal we keep)
    const [showPinModal, setShowPinModal] = useState(false);
    const [deleteProfileData, setDeleteProfileData] = useState(null);
    const [pin, setPin] = useState('');

    // Load dashboard statistics on mount
    useEffect(() => {
        loadDashboardStats();
    }, []);

    // Load profiles when navigating to profiles page
    useEffect(() => {
        if (page === 'profiles') {
            loadProfiles();
        }
    }, [page]);

    /**
     * Load dashboard statistics from backend
     */
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

    /**
     * Load all profiles from backend
     */
    const loadProfiles = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await apiService.getProfiles({ page: 1, limit: 50 });
            console.log('📦 Profiles response:', response);
            if (response.success && response.data) {
                const profilesList = response.data.profiles || [];
                console.log('✅ Loaded profiles:', profilesList.length);
                setProfiles(profilesList);
            } else {
                setProfiles([]);
            }
        } catch (error) {
            console.error('❌ Failed to load profiles:', error);
            setError('Failed to load profiles: ' + error.message);
            setProfiles([]);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle viewing a profile - Navigate to view page
     */
    const handleViewProfile = async (profileId) => {
        try {
            setIsLoading(true);
            const response = await apiService.getProfile(profileId);
            if (response.success && response.data) {
                setSelectedProfile(response.data.profile);
                setPage('viewProfile');
            } else {
                setError('Failed to load profile details.');
            }
        } catch (error) {
            console.error('❌ Failed to view profile:', error);
            setError('Error loading profile details: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle editing a profile - Navigate to edit page
     */
    const handleEditProfile = async (profileId) => {
        try {
            setIsLoading(true);
            const response = await apiService.getProfile(profileId);
            if (response.success && response.data) {
                setSelectedProfile(response.data.profile);
                setPage('editProfile');
            } else {
                setError('Failed to load profile for editing.');
            }
        } catch (error) {
            console.error('❌ Failed to load profile:', error);
            setError('Error loading profile for editing: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle deleting a profile (opens PIN modal)
     */
    const handleDeleteProfile = (profileId, profileName) => {
        setDeleteProfileData({ id: profileId, name: profileName });
        setShowPinModal(true);
        setPin('');
    };

    /**
     * Confirm profile deletion after PIN verification
     */
    const confirmDeleteProfile = async () => {
        const correctPin = localStorage.getItem('userPin') || '1234';
        
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

    /**
     * Handle saving profile changes
     */
    const handleSaveProfile = async (profileId, updatedData) => {
        try {
            setIsLoading(true);
            const response = await apiService.updateProfile(profileId, updatedData);
            if (response.success) {
                alert('✅ Profile updated successfully.');
                await loadProfiles();
                await loadDashboardStats();
                setPage('profiles');
                setSelectedProfile(null);
            } else {
                throw new Error(response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('❌ Failed to update profile:', error);
            alert('❌ Error updating profile: ' + error.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Render Add Profile Page
    if (page === 'add') {
        return (
            <AddProfile 
                onBack={() => {
                    setPage('dashboard');
                    loadDashboardStats();
                }} 
            />
        );
    }

    // Render View Profile Page
    if (page === 'viewProfile') {
        return (
            <ViewProfilePage 
                profile={selectedProfile}
                onBack={() => {
                    setPage('profiles');
                    setSelectedProfile(null);
                }}
                onEdit={handleEditProfile}
            />
        );
    }

    // Render Edit Profile Page
    if (page === 'editProfile') {
        return (
            <EditProfilePage 
                profile={selectedProfile}
                onBack={() => {
                    setPage('profiles');
                    setSelectedProfile(null);
                }}
                onSave={handleSaveProfile}
            />
        );
    }

    // Render Profiles Page
    if (page === 'profiles') {
        return (
            <>
                <ProfilesPage
                    logoPath={logoPath}
                    profiles={profiles}
                    isLoading={isLoading}
                    error={error}
                    onBack={() => setPage('dashboard')}
                    onRefresh={loadProfiles}
                    onAddNew={() => setPage('add')}
                    onViewProfile={handleViewProfile}
                    onEditProfile={handleEditProfile}
                    onDeleteProfile={handleDeleteProfile}
                />
                
                {/* Delete Confirmation Modal */}
                {showPinModal && (
                    <DeleteConfirmModal 
                        profileData={deleteProfileData}
                        pin={pin}
                        setPin={setPin}
                        onConfirm={confirmDeleteProfile}
                        onCancel={() => {
                            setShowPinModal(false);
                            setDeleteProfileData(null);
                            setPin('');
                        }}
                    />
                )}
            </>
        );
    }

    // Render Main Dashboard
    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <SystemBanner />

            <div style={{ padding: '48px 32px', maxWidth: '1200px', margin: '0 auto' }}>
                <DashboardHeader logoPath={logoPath} />

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
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>

                <OperationsCenter 
                    onAddProfile={() => setPage('add')}
                    onViewProfiles={() => setPage('profiles')}
                />

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
        </div>
    );
}

export default Dashboard;
