import React, { useState, useEffect } from 'react';
import apiService from '../services/api.js';
import AddProfile from './addProfile.jsx';
import LLMChat from './LLMChat.jsx';
import NetworkGraph from './NetworkGraph.jsx';
import logo from '../images/logo.png';

// Icons
const Icons = {
    Dashboard: () => <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Records: () => <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    Add: () => <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>,
    Chat: () => <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    Search: () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Bell: () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    User: () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    ArrowRight: () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
    Filter: () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
    Link: () => <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
};

const ActivityChart = ({ profiles }) => {
    // Process profiles to get activity data (last 12 profiles or dummy data if empty)
    const dataPoints = profiles && profiles.length > 0 
        ? profiles.slice(0, 12).map((p, i) => ({ name: p.name, value: 40 + (i * 5) % 50 + Math.random() * 20 })) // Mock value for visual trend
        : Array(12).fill(0).map((_, i) => ({ name: `User ${i}`, value: 30 + Math.random() * 50 }));

    const width = 800;
    const height = 200;
    const padding = 40;
    
    const points = dataPoints.map((point, i) => {
        const x = (i / (dataPoints.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((point.value / 100) * (height - padding * 2)) - padding;
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e293b" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Grid Lines */}
                {[0, 1, 2, 3, 4].map(i => (
                    <line 
                        key={i} 
                        x1={padding} 
                        y1={padding + (i * (height - padding * 2) / 4)} 
                        x2={width - padding} 
                        y2={padding + (i * (height - padding * 2) / 4)} 
                        stroke="#e2e8f0" 
                        strokeWidth="1" 
                        strokeDasharray="4 4"
                    />
                ))}
                {/* Area */}
                <polygon points={areaPoints} fill="url(#chartGradient)" />
                {/* Line */}
                <polyline points={points} fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Points */}
                {dataPoints.map((point, i) => {
                    const x = (i / (dataPoints.length - 1)) * (width - padding * 2) + padding;
                    const y = height - ((point.value / 100) * (height - padding * 2)) - padding;
                    return (
                        <g key={i} className="chart-point">
                            <circle cx={x} cy={y} r="4" fill="white" stroke="#1e293b" strokeWidth="2" />
                            {/* Show name for the last point or if it's a real profile */}
                            {(i === dataPoints.length - 1 || (profiles && profiles.length > 0)) && (
                                <text x={x} y={y - 15} textAnchor="middle" fontSize="10" fill="#475569" fontWeight="600" style={{ textTransform: 'capitalize' }}>
                                    {point.name.split(' ')[0]}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

function Dashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalProfiles: 0,
        highRiskCount: 0,
        activeMonitoring: 0,
        recentUpdates: 0
    });
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [viewProfile, setViewProfile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [networkProfileId, setNetworkProfileId] = useState(null);
    const [caseFilter, setCaseFilter] = useState('all');

    // Refresh stats whenever we switch to the dashboard tab
    useEffect(() => {
        if (activeTab === 'dashboard') {
            loadStats();
            // Also load profiles for the graph
            loadProfiles(true); 
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'records') {
            loadProfiles();
        }
    }, [activeTab]);

    const loadStats = async () => {
        try {
            const response = await apiService.getStats();
            if (response.success) setStats(response.data);
        } catch (e) { console.error(e); }
    };

    const loadProfiles = async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const response = await apiService.getProfiles({ page: 1, limit: 50 });
            if (response.success) setProfiles(response.data.profiles || []);
        } catch (e) { console.error(e); }
        finally { if (!silent) setIsLoading(false); }
    };

    const handleViewProfile = async (id) => {
        try {
            const response = await apiService.getProfile(id);
            if (response.success) setViewProfile(response.data.profile);
        } catch (e) { console.error(e); }
    };

    // Layout Components
    const Sidebar = () => (
        <div style={{
            width: '260px',
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            borderRight: '1px solid #334155',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1000,
            boxShadow: '4px 0 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Logo Section */}
            <div style={{
                padding: '24px 20px',
                borderBottom: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
            }} onClick={() => setActiveTab('dashboard')}>
                <img src={logo} alt="ACCUST Logo" style={{ width: '40px', height: '40px' }} />
                <div>
                    <div style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>ACCUST</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>Intelligence System</div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav style={{ padding: '20px 0', flex: 1 }}>
                {[
                    { id: 'dashboard', icon: <Icons.Dashboard />, label: 'Dashboard', desc: 'Overview & Stats' },
                    { id: 'records', icon: <Icons.Records />, label: 'All Profiles', desc: 'View all records' },
                    { id: 'add', icon: <Icons.Add />, label: 'Add Profile', desc: 'Create new record' },
                    { id: 'linkages', icon: <Icons.Link />, label: 'Analysis', desc: 'View connections' },
                    { id: 'chat', icon: <Icons.Chat />, label: 'AI Chat', desc: 'Network analysis' },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            width: '100%',
                            padding: '14px 20px',
                            background: activeTab === item.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                            border: 'none',
                            borderLeft: activeTab === item.id ? '3px solid #3b82f6' : '3px solid transparent',
                            color: activeTab === item.id ? '#fff' : '#cbd5e1',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s',
                            fontSize: '14px',
                            fontWeight: activeTab === item.id ? '600' : '500',
                            textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== item.id) {
                                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== item.id) {
                                e.target.style.background = 'transparent';
                            }
                        }}
                    >
                        <span style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div>{item.label}</div>
                            <div style={{ 
                                fontSize: '11px', 
                                color: '#64748b',
                                marginTop: '2px'
                            }}>{item.desc}</div>
                        </div>
                    </button>
                ))}
            </nav>

            {/* System Status */}
            <div style={{
                margin: '20px',
                padding: '16px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(34, 197, 94, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        background: '#22c55e',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                    }}></div>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>System Operational</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                    Server: Online<br/>
                    Last backup: 2 hours ago
                </div>
            </div>
        </div>
    );

    const NavIcon = ({ icon, active, onClick, tooltip }) => (
        <div 
            onClick={onClick}
            title={tooltip}
            style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: active ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
            }}
            onMouseOver={e => {
                if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#e2e8f0';
                }
            }}
            onMouseOut={e => {
                if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                }
            }}
        >
            {icon}
            {active && <div style={{ position: 'absolute', left: '-12px', width: '4px', height: '24px', background: '#8b5cf6', borderRadius: '0 4px 4px 0' }} />}
        </div>
    );

    const StatCard = ({ title, value, color, subtext }) => (
        <div 
            className="stat-card"
            style={{ 
                '--fill-color': color,
                background: '#ffffff', 
                borderRadius: '24px', 
                padding: '24px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '160px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="stat-title" style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>{title}</span>
                <div className="stat-icon" style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
                    <Icons.ArrowRight />
                </div>
            </div>
            
            <div>
                <div className="stat-value" style={{ fontSize: '36px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>{value}</div>
                <div className="stat-subtext" style={{ fontSize: '12px', color: '#94a3b8' }}>{subtext}</div>
            </div>
        </div>
    );

    // Main Views
    const LinkagesView = () => {
        const [linkages, setLinkages] = useState([]);
        const [loading, setLoading] = useState(true);
        const [expandedIdx, setExpandedIdx] = useState(null);

        useEffect(() => {
            const fetchLinkages = async () => {
                try {
                    const response = await apiService.getAllLinkages(100);
                    if (response.success) {
                        setLinkages(response.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch linkages:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchLinkages();
        }, []);

        const typeColor = {
            Associate: '#dc2626', Contact: '#7c3aed', Location: '#2563eb',
            Family: '#16a34a', Identity: '#d97706', Activity: '#0891b2',
        };

        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Network Analysis</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
                        {linkages.length > 0 ? `${linkages.length} connections found` : 'Click "Analyze Network" in Profiles tab to detect connections'}
                    </p>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', background: '#fff', borderRadius: '16px' }}>
                            <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }}></div>
                            Loading...
                        </div>
                    ) : linkages.length === 0 ? (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', background: '#fff', borderRadius: '16px' }}>
                            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔍</div>
                            <div style={{ fontWeight: '600', color: '#1e293b' }}>No linkages detected yet</div>
                        </div>
                    ) : (
                        linkages.map((link, idx) => {
                            const isOpen = expandedIdx === idx;
                            const color = typeColor[link.connectionType] || '#475569';
                            const p1 = link.profile1?.name || 'Unknown';
                            const p2 = link.profile2?.name || 'Unknown';
                            const fields = link.matchedFields || [];

                            return (
                                <div key={idx} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                    {/* Summary row */}
                                    <div
                                        onClick={() => setExpandedIdx(isOpen ? null : idx)}
                                        style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                                    >
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                                            🔗
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '14px', color: '#1e293b' }}>
                                                <strong>{p1}</strong>
                                                <span style={{ color: '#94a3b8', margin: '0 8px' }}>↔</span>
                                                <strong>{p2}</strong>
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                                                {fields.length} matching field{fields.length !== 1 ? 's' : ''} found
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: '700',
                                            background: color + '12', color: color, border: `1px solid ${color}30`
                                        }}>
                                            {link.connectionType}
                                        </span>
                                        <span style={{ fontSize: '16px', color: '#94a3b8', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s' }}>▾</span>
                                    </div>

                                    {/* Detail section */}
                                    {isOpen && (
                                        <div style={{ borderTop: '1px solid #f1f5f9', padding: '0' }}>
                                            {/* Column header */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr 100px', background: '#f8fafc', padding: '10px 20px', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f1f5f9' }}>
                                                <div>Field</div>
                                                <div>{p1}'s Data</div>
                                                <div>{p2}'s Data</div>
                                                <div style={{ textAlign: 'center' }}>Match %</div>
                                            </div>
                                            {/* Rows */}
                                            {fields.map((m, i) => {
                                                const pct = Math.round(m.similarity * 100);
                                                const isCritical = m.field.toLowerCase().includes('critical');
                                                return (
                                                    <div key={i} style={{
                                                        display: 'grid', gridTemplateColumns: '200px 1fr 1fr 100px',
                                                        padding: '10px 20px', borderBottom: '1px solid #f8fafc',
                                                        background: isCritical ? '#fef2f2' : (i % 2 === 0 ? '#fff' : '#fafbfc'),
                                                        fontSize: '13px', alignItems: 'start'
                                                    }}>
                                                        <div style={{ fontWeight: '600', color: isCritical ? '#dc2626' : '#334155', paddingRight: '8px' }}>
                                                            {m.field}
                                                        </div>
                                                        <div style={{ color: '#1e293b', paddingRight: '12px', wordBreak: 'break-word', lineHeight: '1.4' }}>
                                                            {m.value1}
                                                        </div>
                                                        <div style={{ color: '#1e293b', paddingRight: '12px', wordBreak: 'break-word', lineHeight: '1.4' }}>
                                                            {m.value2}
                                                        </div>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <span style={{
                                                                padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700',
                                                                background: pct >= 95 ? '#fef2f2' : pct >= 70 ? '#fff7ed' : '#ecfeff',
                                                                color: pct >= 95 ? '#dc2626' : pct >= 70 ? '#ea580c' : '#0891b2'
                                                            }}>
                                                                {pct}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    };

    const DashboardView = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', padding: '8px' }}>
            {/* Header */}
            <div style={{ gridColumn: 'span 12', marginBottom: '16px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Dashboard</h1>
                <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>System Overview & Analytics</p>
            </div>

            {/* Stats Row */}
            <div style={{ gridColumn: 'span 3' }}>
                <StatCard title="Total Profiles" value={stats.totalProfiles} color="#6366f1" subtext="+12% from last month" />
            </div>
            <div style={{ gridColumn: 'span 3' }}>
                <StatCard title="High Risk" value={stats.highRiskCount} color="#ef4444" subtext="Requires immediate attention" />
            </div>
            <div style={{ gridColumn: 'span 3' }}>
                <StatCard title="Surveillance" value={stats.activeMonitoring} color="#f59e0b" subtext="Active monitoring targets" />
            </div>
            <div style={{ gridColumn: 'span 3' }}>
                <StatCard title="New Records" value={stats.recentUpdates} color="#10b981" subtext="Added in last 7 days" />
            </div>

            {/* Main Content Area (Bento Grid) */}
            <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)', minHeight: '400px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Recent Activity</h3>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ActivityChart profiles={profiles} />
                    </div>
                </div>
            </div>

            <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: '#ffffff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 20px 0' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button onClick={() => setActiveTab('add')} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: '#f8fafc', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}><Icons.Add /></div>
                            <div>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>Add Profile</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>Create new record</div>
                            </div>
                        </button>
                        <button onClick={() => setActiveTab('records')} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: '#f8fafc', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><Icons.Search /></div>
                            <div>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>Search Records</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>Find in database</div>
                            </div>
                        </button>
                        <button onClick={() => setActiveTab('linkages')} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: '#f8fafc', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}><Icons.Link /></div>
                            <div>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>Analysis</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>View all connections</div>
                            </div>
                        </button>
                    </div>
                </div>

                <div style={{ background: '#1e293b', borderRadius: '24px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: '#6366f1', borderRadius: '50%', opacity: 0.2 }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>System Status</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                        <span style={{ fontSize: '14px', opacity: 0.8 }}>Operational</span>
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>Last backup: 2 hours ago</div>
                </div>
            </div>
        </div>
    );

    const RecordsView = () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Records</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Manage and search intelligence profiles</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            placeholder="Search records..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '12px 16px 12px 44px',
                                borderRadius: '12px',
                                border: 'none',
                                background: '#ffffff',
                                width: '300px',
                                fontSize: '14px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                                outline: 'none'
                            }}
                        />
                        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                            <Icons.Search />
                        </div>
                    </div>
                    <select style={{ 
                        padding: '12px 16px', 
                        borderRadius: '12px', 
                        border: 'none', 
                        background: '#ffffff', 
                        color: '#64748b', 
                        cursor: 'pointer', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                        fontSize: '14px',
                        fontWeight: '500',
                        outline: 'none'
                    }} onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'suspicious') {
                            setProfiles(profiles.filter(p => p.isSuspicious));
                        } else if (val === 'high-risk') {
                            setProfiles(profiles.filter(p => p.suspicionScore >= 70));
                        } else {
                            loadProfiles();
                        }
                    }}>
                        <option value="all">📋 All Profiles</option>
                        <option value="suspicious">🚨 Suspicious Only</option>
                        <option value="high-risk">🔴 High Risk Only</option>
                    </select>
                    <select style={{ 
                        padding: '12px 16px', 
                        borderRadius: '12px', 
                        border: 'none', 
                        background: '#ffffff', 
                        color: '#64748b', 
                        cursor: 'pointer', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                        fontSize: '14px',
                        fontWeight: '500',
                        outline: 'none',
                        maxWidth: '250px'
                    }} value={caseFilter} onChange={(e) => setCaseFilter(e.target.value)}>
                        <option value="all">⚖️ All Cases</option>
                        {[...new Set(profiles.map(p => p.case).filter(Boolean))].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <button 
                        onClick={async () => {
                            if (confirm('Start AI network analysis? This will scan all profiles for connections.')) {
                                try {
                                    const response = await fetch('http://localhost:3001/api/analysis/detect-linkages', { method: 'POST' });
                                    const data = await response.json();
                                    if (data.success) {
                                        alert(`✅ Analysis complete! Found ${data.data.totalLinkages} linkages.`);
                                        loadProfiles(); // Refresh to show updated suspicion scores
                                    }
                                } catch (err) {
                                    alert('❌ Analysis failed: ' + err.message);
                                }
                            }
                        }}
                        style={{ 
                            padding: '12px 20px', 
                            borderRadius: '12px', 
                            border: 'none', 
                            background: '#6366f1', 
                            color: 'white', 
                            cursor: 'pointer', 
                            boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#4f46e5'}
                        onMouseOut={(e) => e.target.style.background = '#6366f1'}
                    >
                        🧠 Analyze Network
                    </button>
                </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '24px', flex: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ overflowX: 'auto', flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Profile Details</th>
                                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                                <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Updated</th>
                                <th style={{ padding: '20px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        <span>Loading profiles...</span>
                                    </div>
                                </td></tr>
                            ) : profiles.filter(p => (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())) && (caseFilter === 'all' || p.case === caseFilter)).length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '48px' }}>📋</span>
                                        <span style={{ fontWeight: '600', color: '#1e293b' }}>No profiles found</span>
                                        <span>{profiles.length > 0 ? 'Try a different search term or case filter.' : 'Click "Add Profile" to create your first record.'}</span>
                                    </div>
                                </td></tr>
                            ) : profiles.filter(p => (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())) && (caseFilter === 'all' || p.case === caseFilter)).map((profile, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'} onClick={() => handleViewProfile(profile._id)}>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ 
                                                width: '48px', 
                                                height: '48px', 
                                                borderRadius: '12px', 
                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                fontSize: '18px', 
                                                fontWeight: '700', 
                                                color: 'white',
                                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                            }}>
                                                {profile.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>{profile.name}</div>
                                                    {profile.isSuspicious && (
                                                        <span style={{
                                                            padding: '3px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '10px',
                                                            fontWeight: '700',
                                                            background: profile.suspicionScore >= 70 ? '#fee2e2' : (profile.suspicionScore >= 40 ? '#fef3c7' : '#dcfce7'),
                                                            color: profile.suspicionScore >= 70 ? '#991b1b' : (profile.suspicionScore >= 40 ? '#92400e' : '#166534'),
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.5px'
                                                        }}>
                                                            {profile.suspicionScore >= 70 ? '🔴 HIGH RISK' : (profile.suspicionScore >= 40 ? '🟡 MEDIUM' : '🟢 WATCH')}
                                                        </span>
                                                    )}
                                                    {profile.linkageCount > 0 && (
                                                        <span style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '10px',
                                                            fontWeight: '600',
                                                            background: '#e0e7ff',
                                                            color: '#3730a3'
                                                        }} title={`${profile.linkageCount} connection(s) detected`}>
                                                            🔗 {profile.linkageCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {profile.profileId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontSize: '14px', color: '#475569' }}>{profile.monitoringStatus}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px' }}>
                                        <div style={{ fontSize: '14px', color: '#64748b' }}>{new Date(profile.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button 
                                                onClick={() => handleViewProfile(profile._id)}
                                                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#475569', transition: 'all 0.2s' }}
                                                onMouseOver={e => { e.target.style.background = '#f1f5f9'; }}
                                                onMouseOut={e => { e.target.style.background = 'white'; }}
                                            >
                                                View
                                            </button>
                                            {profile.linkageCount > 0 && (
                                                <button 
                                                    onClick={() => setNetworkProfileId(profile._id)}
                                                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #6366f1', background: '#6366f1', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: 'white', transition: 'all 0.2s' }}
                                                    onMouseOver={e => { e.target.style.background = '#4f46e5'; }}
                                                    onMouseOut={e => { e.target.style.background = '#6366f1'; }}
                                                    title="View network connections"
                                                >
                                                    🕸️ Network
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const ProfileDetailModal = () => {
        if (!viewProfile) return null;

        const DetailSection = ({ title, children, icon }) => (
            <div style={{ marginBottom: '32px' }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    marginBottom: '20px',
                    paddingBottom: '12px',
                    borderBottom: '2px solid #e2e8f0'
                }}>
                    <span style={{ fontSize: '18px' }}>{icon}</span>
                    <h4 style={{ 
                        fontSize: '14px', 
                        fontWeight: '700', 
                        textTransform: 'uppercase', 
                        letterSpacing: '1.5px',
                        color: '#1e293b',
                        margin: 0
                    }}>
                        {title}
                    </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {children}
                </div>
            </div>
        );

        const DetailItem = ({ label, value, highlight }) => (
            <div style={{
                background: highlight ? '#fef3c7' : '#f8fafc',
                padding: '16px',
                borderRadius: '10px',
                border: highlight ? '1px solid #fcd34d' : '1px solid #e2e8f0'
            }}>
                <label style={{ 
                    display: 'block', 
                    marginBottom: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>{label}</label>
                <div style={{ 
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1e293b',
                    lineHeight: '1.6',
                    wordBreak: 'break-word'
                }}>
                    {value || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Available</span>}
                </div>
            </div>
        );

        const renderList = (items, keyName = 'name') => {
            if (!items || items.length === 0) return null;
            if (typeof items[0] === 'string') return items.join(', ');
            return items.map(i => i[keyName] || i.level || i.name || JSON.stringify(i)).join(', ');
        };

        const getAddressString = (addr) => {
            if (!addr) return null;
            return [addr.doorNo, addr.streetName, addr.villageWard, addr.district, addr.statePinCode].filter(Boolean).join(', ');
        };

        return (
            <div style={{ 
                position: 'fixed', 
                inset: 0, 
                background: 'rgba(15, 23, 42, 0.7)', 
                backdropFilter: 'blur(12px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                zIndex: 2000, 
                padding: '20px' 
            }}>
                <div style={{ 
                    background: 'white', 
                    borderRadius: '16px', 
                    width: '100%', 
                    maxWidth: '1100px', 
                    maxHeight: '95vh', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', 
                    overflow: 'hidden'
                }}>
                    
                    {/* Header */}
                    <div style={{ 
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
                        padding: '28px 32px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ 
                                width: '80px', 
                                height: '80px', 
                                borderRadius: '12px', 
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
                                color: 'white', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '32px', 
                                fontWeight: '700',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                            }}>
                                {viewProfile.name?.charAt(0)}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '26px', fontWeight: '800', margin: 0, color: 'white' }}>
                                    {viewProfile.name}
                                </h2>
                                <p style={{ color: '#94a3b8', margin: '4px 0 12px 0', fontSize: '14px' }}>
                                    {viewProfile.guardian || viewProfile.family?.father ? `S/o ${viewProfile.family?.father || viewProfile.guardian}` : ''}
                                </p>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <span style={{ 
                                        fontSize: '11px', 
                                        color: '#e2e8f0', 
                                        background: 'rgba(255,255,255,0.1)', 
                                        padding: '6px 12px', 
                                        borderRadius: '6px',
                                        fontWeight: '600'
                                    }}>
                                        🆔 {viewProfile.profileId}
                                    </span>
                                    <span style={{ 
                                        fontSize: '11px', 
                                        color: viewProfile.radicalizationLevel === 'High' ? '#fecaca' : '#bbf7d0', 
                                        background: viewProfile.radicalizationLevel === 'High' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)', 
                                        padding: '6px 12px', 
                                        borderRadius: '6px', 
                                        fontWeight: '700'
                                    }}>
                                        {viewProfile.radicalizationLevel === 'High' ? '🔴' : '🟢'} {viewProfile.radicalizationLevel || 'Low'} Risk
                                    </span>
                                    {viewProfile.case && (
                                        <span style={{ 
                                            fontSize: '11px', 
                                            color: '#fef08a', 
                                            background: 'rgba(234, 179, 8, 0.3)', 
                                            padding: '6px 12px', 
                                            borderRadius: '6px',
                                            fontWeight: '600'
                                        }}>
                                            ⚠️ {viewProfile.case}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setViewProfile(null)} 
                            style={{ 
                                border: 'none', 
                                background: 'rgba(255,255,255,0.1)', 
                                width: '44px', 
                                height: '44px', 
                                borderRadius: '10px', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                color: 'white',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#ffffff' }}>
                        
                        <DetailSection title="Personal Information" icon="👤">
                            <DetailItem label="Full Name" value={viewProfile.name} />
                            <DetailItem label="Date of Birth" value={viewProfile.dob ? new Date(viewProfile.dob).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null} />
                            <DetailItem label="Age" value={viewProfile.dob ? `${Math.floor((new Date() - new Date(viewProfile.dob)) / (365.25 * 24 * 60 * 60 * 1000))} Years` : null} />
                            <DetailItem label="Gender" value={viewProfile.gender} />
                            <DetailItem label="Marital Status" value={viewProfile.maritalStatus} />
                            <DetailItem label="Place of Birth" value={viewProfile.placeOfBirth} />
                            <DetailItem label="Nationality" value={viewProfile.nationality} />
                            <DetailItem label="Religion" value={viewProfile.religion} />
                            <DetailItem label="Phone Number" value={viewProfile.phone} highlight={true} />
                            <DetailItem label="IMEI Numbers" value={viewProfile.imeiNumbers?.join(', ')} />
                        </DetailSection>

                        <DetailSection title="Education & Profession" icon="🎓">
                            {viewProfile.education?.map((edu, idx) => (
                                <DetailItem key={idx} label={edu.level || `Education ${idx + 1}`} value={`${edu.schoolCollege || ''} (${edu.year || ''})`} />
                            ))}
                            <DetailItem label="Profession" value={viewProfile.profession} />
                            <DetailItem label="Annual Income" value={viewProfile.annualIncome} />
                        </DetailSection>

                        <DetailSection title="Address Information" icon="🏠">
                            <DetailItem label="Present Address" value={getAddressString(viewProfile.address?.present)} />
                            <DetailItem label="Permanent Address" value={getAddressString(viewProfile.address?.permanent)} />
                            <DetailItem label="Police Station" value={viewProfile.address?.present?.policeStation} />
                            <div style={{
                                background: '#fef3c7',
                                padding: '16px',
                                borderRadius: '10px',
                                border: '1px solid #fcd34d'
                            }}>
                                <label style={{ 
                                    display: 'block', 
                                    marginBottom: '12px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>House GPS</label>
                                <div style={{ 
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#1e293b',
                                    lineHeight: '1.6',
                                    wordBreak: 'break-word',
                                    marginBottom: '12px'
                                }}>
                                    {viewProfile.houseGPS?.gpsLocation || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not Available</span>}
                                </div>
                                {viewProfile.houseGPS?.gpsLocation && (
                                    <button 
                                        onClick={() => {
                                            const [lat, lng] = viewProfile.houseGPS.gpsLocation.split(',').map(s => s.trim());
                                            if (lat && lng) {
                                                window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`, '_blank');
                                            }
                                        }}
                                        style={{
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                                    >
                                        📍 Open in Street View
                                    </button>
                                )}
                            </div>
                            <DetailItem label="Hideouts" value={viewProfile.hideouts} />
                        </DetailSection>

                        <DetailSection title="Family Details" icon="👨‍👩‍👧‍👦">
                            <DetailItem label="Father's Name" value={viewProfile.family?.father} />
                            <DetailItem label="Mother's Name" value={viewProfile.family?.mother} />
                            <DetailItem label="Spouse" value={viewProfile.family?.wives} />
                            <DetailItem label="Children" value={viewProfile.family?.children?.map(c => `${c.name} (${c.type})`).join(', ')} />
                            <DetailItem label="Brothers" value={viewProfile.family?.brothers} />
                            <DetailItem label="Sisters" value={viewProfile.family?.sisters} />
                        </DetailSection>

                        <DetailSection title="Identity Documents" icon="📄">
                            <DetailItem label="Aadhar Number" value={viewProfile.identityCards?.aadhar} highlight={true} />
                            <DetailItem label="PAN Card" value={viewProfile.identityCards?.pan} highlight={true} />
                            <DetailItem label="Driving License" value={viewProfile.identityCards?.drivingLicense} />
                            <DetailItem label="Passport" value={viewProfile.identityCards?.passport} />
                            <DetailItem label="Voter ID" value={viewProfile.identityCards?.voterId} />
                            <DetailItem label="Ration Card" value={viewProfile.identityCards?.rationCard} />
                        </DetailSection>

                        <DetailSection title="Physical Description" icon="🧍">
                            <DetailItem label="Height" value={viewProfile.physicalDescription?.height} />
                            <DetailItem label="Weight" value={viewProfile.physicalDescription?.weight} />
                            <DetailItem label="Body Build" value={viewProfile.physicalDescription?.bodyBuild} />
                            <DetailItem label="Complexion" value={viewProfile.physicalDescription?.complexion} />
                            <DetailItem label="Hair Color" value={viewProfile.physicalDescription?.hairColor} />
                            <DetailItem label="Eye Color" value={viewProfile.physicalDescription?.eyeColor} />
                            <DetailItem label="Moustache" value={viewProfile.physicalDescription?.moustache} />
                            <DetailItem label="Beard" value={viewProfile.physicalDescription?.beard} />
                            <DetailItem label="Identification Mark" value={viewProfile.identificationMark} highlight={true} />
                        </DetailSection>

                        <DetailSection title="Social Media" icon="📱">
                            <DetailItem label="Email" value={viewProfile.socialMedia?.email} />
                            <DetailItem label="WhatsApp" value={viewProfile.socialMedia?.whatsapp} />
                            <DetailItem label="Facebook" value={viewProfile.socialMedia?.facebook} />
                            <DetailItem label="Instagram" value={viewProfile.socialMedia?.instagram} />
                            <DetailItem label="Telegram" value={viewProfile.socialMedia?.telegram} />
                            <DetailItem label="UPI ID" value={viewProfile.socialMedia?.upi} />
                        </DetailSection>

                        <DetailSection title="Bank Details" icon="🏦">
                            <DetailItem label="Bank Name" value={viewProfile.bankDetails?.bankName} />
                            <DetailItem label="Account Number" value={viewProfile.bankDetails?.accountNo} highlight={true} />
                            <DetailItem label="Branch" value={viewProfile.bankDetails?.branch} />
                        </DetailSection>

                        <DetailSection title="Organization & Activities" icon="⚠️">
                            <DetailItem label="Current Whereabouts" value={viewProfile.whereabouts} />
                            <DetailItem label="Type of Activities" value={viewProfile.activitiesType} highlight={true} />
                            <DetailItem label="Previous Organization" value={viewProfile.prevOrganization} />
                            <DetailItem label="Present Organization" value={viewProfile.presentOrganization} />
                            <DetailItem label="Religious Activities" value={viewProfile.religiousActivities} />
                            <DetailItem label="Radicalization Potential" value={viewProfile.radicalizationPotential} highlight={true} />
                        </DetailSection>

                        <DetailSection title="Case & Legal Details" icon="⚖️">
                            <DetailItem label="Case" value={viewProfile.case} highlight={true} />
                            <DetailItem label="Police Station" value={viewProfile.arrestDetails?.policeStation} />
                            <DetailItem label="Crime No & Section" value={viewProfile.arrestDetails?.crimeNoAndSec} highlight={true} />
                            <DetailItem label="Date & Place of Arrest" value={viewProfile.arrestDetails?.datePlace} />
                            <DetailItem label="Bail Order" value={viewProfile.arrestDetails?.bailOrder} />
                            <DetailItem label="Co-Accused" value={viewProfile.arrestDetails?.coAccused} />
                            <DetailItem label="Prison Status" value={viewProfile.prisonStatus} />
                            <DetailItem label="Interrogated By" value={viewProfile.interrogatedBy} />
                            <DetailItem label="Advocate" value={viewProfile.advocate ? `${viewProfile.advocate.name} (${viewProfile.advocate.phone})` : null} />
                        </DetailSection>

                        <DetailSection title="Properties & Vehicles" icon="🚗">
                            <DetailItem label="Movable Property" value={viewProfile.properties?.movable} />
                            <DetailItem label="Immovable Property" value={viewProfile.properties?.immovable} />
                            <DetailItem label="Vehicles" value={viewProfile.properties?.vehicles} highlight={true} />
                        </DetailSection>

                        {viewProfile.caseParticulars && viewProfile.caseParticulars.length > 0 && (
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px',
                                    marginBottom: '20px',
                                    paddingBottom: '12px',
                                    borderBottom: '2px solid #e2e8f0'
                                }}>
                                    <span style={{ fontSize: '18px' }}>📋</span>
                                    <h4 style={{ 
                                        fontSize: '14px', 
                                        fontWeight: '700', 
                                        textTransform: 'uppercase', 
                                        letterSpacing: '1.5px',
                                        color: '#1e293b',
                                        margin: 0
                                    }}>
                                        Case Particulars ({viewProfile.caseParticulars.length})
                                    </h4>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {viewProfile.caseParticulars.map((cp, idx) => (
                                        <div key={idx} style={{
                                            background: 'linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%)',
                                            borderRadius: '12px',
                                            padding: '20px',
                                            border: '1px solid #fecaca'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                                <span style={{
                                                    background: '#dc2626',
                                                    color: 'white',
                                                    padding: '4px 12px',
                                                    borderRadius: '20px',
                                                    fontSize: '11px',
                                                    fontWeight: '700'
                                                }}>
                                                    Case #{idx + 1}
                                                </span>
                                                <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: '600' }}>
                                                    {cp.crimeNoSection}
                                                </span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                                <div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Police Station</div>
                                                    <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{cp.policeStation || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Arresting Agency</div>
                                                    <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{cp.arrestingAgency || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Court</div>
                                                    <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{cp.court || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Status</div>
                                                    <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>{cp.status || 'N/A'}</div>
                                                </div>
                                            </div>
                                            {cp.briefFacts && (
                                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #fecaca' }}>
                                                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>Brief Facts</div>
                                                    <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>{cp.briefFacts}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <DetailSection title="Close Associates" icon="🔗">
                            {viewProfile.closeAssociates?.map((assoc, idx) => (
                                <DetailItem 
                                    key={idx} 
                                    label={assoc.name} 
                                    value={`📍 ${assoc.address || 'N/A'}\n📞 ${assoc.phone || 'N/A'}`} 
                                    highlight={true}
                                />
                            ))}
                        </DetailSection>

                        <DetailSection title="Verification" icon="✅">
                            <DetailItem label="Verified By" value={viewProfile.verifiedBy} />
                            <DetailItem label="Date of Creation" value={viewProfile.dateOfCreation ? new Date(viewProfile.dateOfCreation).toLocaleDateString('en-IN') : null} />
                            <DetailItem label="Last Updated" value={viewProfile.updatedAt ? new Date(viewProfile.updatedAt).toLocaleDateString('en-IN') : null} />
                        </DetailSection>

                    </div>

                    {/* Footer Actions */}
                    <div style={{
                        padding: '20px 32px',
                        background: '#f8fafc',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px'
                    }}>
                        <button 
                            onClick={() => setViewProfile(null)}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                background: 'white',
                                color: '#64748b',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                        <button 
                            onClick={() => {
                                setViewProfile(null);
                                setNetworkProfileId(viewProfile._id);
                            }}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#6366f1',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            🕸️ View Network
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
            <Sidebar />
            <div style={{ marginLeft: '260px', flex: 1, padding: '32px', overflowY: 'auto', minHeight: '100vh' }}>
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'records' && <RecordsView />}
                {activeTab === 'linkages' && <LinkagesView />}
                {activeTab === 'add' && <AddProfile onBack={() => setActiveTab('dashboard')} />}
                {activeTab === 'chat' && <LLMChat />}
            </div>
            <ProfileDetailModal />
            {networkProfileId && (
                <NetworkGraph 
                    profileId={networkProfileId} 
                    onClose={() => setNetworkProfileId(null)} 
                />
            )}
        </div>
    );
}

export default Dashboard;