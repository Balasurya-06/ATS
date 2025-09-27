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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Load dashboard statistics from backend
    useEffect(() => {
        loadDashboardStats();
    }, []);

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

    if (page === 'add') {
        return <AddProfile onBack={() => setPage('dashboard')} />;
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

                        <button style={{ 
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

                        <button style={{ 
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
                        </button>

                        <button style={{ 
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
                        </button>
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
        </div>
    );
}

export default Dashboard;