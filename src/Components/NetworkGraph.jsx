import React, { useState, useEffect } from 'react';

/**
 * Network Graph Visualization Component
 * Shows connections between criminal profiles
 */
function NetworkGraph({ profileId, onClose }) {
    const [networkData, setNetworkData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState(null);

    useEffect(() => {
        loadNetworkData();
    }, [profileId]);

    const loadNetworkData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/analysis/network/${profileId}?depth=2`);
            const data = await response.json();
            if (data.success) {
                setNetworkData(data.data);
            }
        } catch (error) {
            console.error('Failed to load network:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Loading Network...</div>
                    <div style={{ color: '#64748b' }}>Analyzing connections...</div>
                </div>
            </div>
        );
    }

    if (!networkData || networkData.nodes.length === 0) {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '400px' }}>
                    <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>No Connections Found</div>
                    <div style={{ color: '#64748b', marginBottom: '20px' }}>
                        This profile has no detected linkages with other profiles.
                    </div>
                    <button onClick={onClose} style={{
                        padding: '12px 24px',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}>
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const centerNode = networkData.nodes[0];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '40px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '1200px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#1e293b' }}>
                            🕸️ Network Graph
                        </h2>
                        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
                            {networkData.nodes.length} profile(s) • {networkData.links.length} connection(s)
                        </p>
                    </div>
                    <button onClick={onClose} style={{
                        background: '#f1f5f9',
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '18px'
                    }}>×</button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {/* Center Node */}
                    <div style={{
                        background: '#6366f1',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '20px', fontWeight: '700' }}>{centerNode.name}</div>
                        <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>
                            {centerNode.linkageCount} connection(s) • Suspicion: {centerNode.suspicionScore}%
                        </div>
                    </div>

                    {/* Connections List */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>
                            Direct Connections:
                        </h3>
                        {networkData.links.map((link, idx) => {
                            const connectedNode = networkData.nodes.find(n => 
                                n.id === link.target || n.id === link.source && n.id !== centerNode.id
                            );
                            
                            return (
                                <div key={idx} style={{
                                    background: '#f8fafc',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: link.suspicion >= 70 ? '2px solid #ef4444' : '1px solid #e2e8f0'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>
                                            {connectedNode?.name || 'Unknown'}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                                            {link.type} Connection • Strength: {link.strength.toFixed(0)}%
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        background: link.suspicion >= 70 ? '#fee2e2' : (link.suspicion >= 40 ? '#fef3c7' : '#dcfce7'),
                                        color: link.suspicion >= 70 ? '#991b1b' : (link.suspicion >= 40 ? '#92400e' : '#166534')
                                    }}>
                                        {link.suspicion >= 70 ? '🔴 HIGH' : (link.suspicion >= 40 ? '🟡 MED' : '🟢 LOW')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Connected Nodes */}
                    {networkData.nodes.length > 1 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>
                                All Profiles in Network:
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                                {networkData.nodes.slice(1).map((node, idx) => (
                                    <div key={idx} style={{
                                        background: '#f8fafc',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                                            {node.name}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                            Connections: {node.linkageCount} • Risk: {node.suspicionScore}%
                                        </div>
                                        <div style={{
                                            marginTop: '8px',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            background: node.suspicionScore >= 70 ? '#fee2e2' : '#fef3c7',
                                            color: node.suspicionScore >= 70 ? '#991b1b' : '#92400e',
                                            display: 'inline-block'
                                        }}>
                                            {node.radicalizationLevel} Risk
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <button onClick={() => {
                        const dataStr = JSON.stringify(networkData, null, 2);
                        const blob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `network_${centerNode.name.replace(/\s+/g, '_')}.json`;
                        a.click();
                    }} style={{
                        padding: '10px 20px',
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#64748b'
                    }}>
                        📥 Export Data
                    </button>
                    <button onClick={onClose} style={{
                        padding: '10px 20px',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NetworkGraph;
