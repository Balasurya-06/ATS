import React from 'react';

/**
 * ProfilesTable Component
 * Displays a table of all registered profiles with action buttons
 */
function ProfilesTable({ profiles, onView, onEdit, onDelete }) {
    return (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px' }}>
                Registered Profiles ({profiles.length})
            </h2>
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
                                <td style={{ padding: '12px', fontSize: '14px', color: '#1e3a8a', fontWeight: '500' }}>
                                    {profile.profileId || 'N/A'}
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                                    {profile.name || 'N/A'}
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                                    {profile.age || 'N/A'}
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                                    {profile.gender || 'N/A'}
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                                    {profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px' }}>
                                    <span style={{ 
                                        padding: '4px 12px', 
                                        borderRadius: '12px', 
                                        fontSize: '12px', 
                                        fontWeight: '500',
                                        backgroundColor: profile.radicalizationLevel === 'High' ? '#fecaca' : 
                                                        profile.radicalizationLevel === 'Medium' ? '#fef3c7' : '#d1fae5',
                                        color: profile.radicalizationLevel === 'High' ? '#991b1b' : 
                                               profile.radicalizationLevel === 'Medium' ? '#92400e' : '#166534'
                                    }}>
                                        {profile.radicalizationLevel || 'Low'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                                    {profile.monitoringStatus || 'N/A'}
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px' }}>
                                    <span style={{ 
                                        padding: '4px 12px', 
                                        borderRadius: '12px', 
                                        fontSize: '12px', 
                                        fontWeight: '500',
                                        backgroundColor: profile.fileClassification === 'Top Secret' ? '#7f1d1d' : 
                                                        profile.fileClassification === 'Secret' ? '#dc2626' : '#6b7280',
                                        color: '#ffffff'
                                    }}>
                                        {profile.fileClassification || 'Unclassified'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontSize: '14px', color: '#374151' }}>
                                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                    <br />
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                        by {profile.lastUpdatedBy || 'system'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                        <button 
                                            onClick={() => onView(profile._id)}
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
                                            onClick={() => onEdit(profile._id)}
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
                                            onClick={() => onDelete(profile._id, profile.name)}
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
    );
}

export default ProfilesTable;
