import React from 'react';

/**
 * LoadingSpinner Component
 * Reusable loading indicator for various states
 */
function LoadingSpinner({ 
    size = 'medium', 
    text = 'Loading...', 
    overlay = false, 
    color = '#3b82f6',
    fullScreen = false 
}) {
    const sizeConfig = {
        small: { spinner: '20px', text: '12px' },
        medium: { spinner: '40px', text: '14px' },
        large: { spinner: '60px', text: '16px' },
        xlarge: { spinner: '80px', text: '18px' }
    };

    const config = sizeConfig[size] || sizeConfig.medium;

    const spinnerStyle = {
        width: config.spinner,
        height: config.spinner,
        border: `3px solid ${color}20`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        ...(overlay && {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 1000
        }),
        ...(fullScreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            zIndex: 9999
        })
    };

    const textStyle = {
        fontSize: config.text,
        color: '#6b7280',
        fontWeight: '500',
        textAlign: 'center'
    };

    return (
        <>
            {/* CSS Animation */}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            
            <div style={containerStyle}>
                <div style={spinnerStyle}></div>
                {text && <div style={textStyle}>{text}</div>}
            </div>
        </>
    );
}

/**
 * TableLoadingSkeleton Component
 * Loading skeleton for table rows
 */
function TableLoadingSkeleton({ rows = 5, columns = 6 }) {
    return (
        <>
            <style>
                {`
                    @keyframes shimmer {
                        0% { background-position: -200px 0; }
                        100% { background-position: calc(200px + 100%) 0; }
                    }
                    .shimmer {
                        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                        background-size: 200px 100%;
                        animation: shimmer 1.5s infinite;
                    }
                `}
            </style>
            
            <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <tr key={rowIndex} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <td key={colIndex} style={{ padding: '12px' }}>
                                <div
                                    className="shimmer"
                                    style={{
                                        height: '16px',
                                        borderRadius: '4px',
                                        width: colIndex === 0 ? '80px' : colIndex === 1 ? '120px' : '100px'
                                    }}
                                ></div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </>
    );
}

/**
 * CardLoadingSkeleton Component
 * Loading skeleton for profile cards
 */
function CardLoadingSkeleton({ cards = 6 }) {
    return (
        <>
            <style>
                {`
                    @keyframes shimmer {
                        0% { background-position: -200px 0; }
                        100% { background-position: calc(200px + 100%) 0; }
                    }
                    .shimmer {
                        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                        background-size: 200px 100%;
                        animation: shimmer 1.5s infinite;
                    }
                `}
            </style>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '16px' 
            }}>
                {Array.from({ length: cards }).map((_, index) => (
                    <div 
                        key={index}
                        style={{ 
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '20px'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div>
                                <div 
                                    className="shimmer"
                                    style={{ 
                                        height: '20px', 
                                        width: '150px', 
                                        borderRadius: '4px', 
                                        marginBottom: '8px' 
                                    }}
                                ></div>
                                <div 
                                    className="shimmer"
                                    style={{ 
                                        height: '14px', 
                                        width: '80px', 
                                        borderRadius: '4px' 
                                    }}
                                ></div>
                            </div>
                            <div 
                                className="shimmer"
                                style={{ 
                                    height: '24px', 
                                    width: '60px', 
                                    borderRadius: '6px' 
                                }}
                            ></div>
                        </div>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            gap: '8px',
                            marginBottom: '12px'
                        }}>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div 
                                    key={i}
                                    className="shimmer"
                                    style={{ 
                                        height: '14px', 
                                        borderRadius: '4px' 
                                    }}
                                ></div>
                            ))}
                        </div>

                        <div style={{ 
                            paddingTop: '12px',
                            borderTop: '1px solid #e2e8f0',
                            display: 'flex',
                            gap: '8px'
                        }}>
                            <div 
                                className="shimmer"
                                style={{ 
                                    height: '28px', 
                                    width: '60px', 
                                    borderRadius: '6px' 
                                }}
                            ></div>
                            <div 
                                className="shimmer"
                                style={{ 
                                    height: '28px', 
                                    width: '60px', 
                                    borderRadius: '6px' 
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

/**
 * StatCardLoadingSkeleton Component
 * Loading skeleton for statistics cards
 */
function StatCardLoadingSkeleton({ cards = 4 }) {
    return (
        <>
            <style>
                {`
                    @keyframes shimmer {
                        0% { background-position: -200px 0; }
                        100% { background-position: calc(200px + 100%) 0; }
                    }
                    .shimmer {
                        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                        background-size: 200px 100%;
                        animation: shimmer 1.5s infinite;
                    }
                `}
            </style>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                gap: '20px'
            }}>
                {Array.from({ length: cards }).map((_, index) => (
                    <div 
                        key={index}
                        style={{ 
                            background: '#ffffff',
                            borderRadius: '12px',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                            padding: '24px',
                            border: '1px solid #f1f5f9'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div 
                                className="shimmer"
                                style={{ 
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px'
                                }}
                            ></div>
                            <div 
                                className="shimmer"
                                style={{ 
                                    height: '16px', 
                                    width: '40px', 
                                    borderRadius: '4px' 
                                }}
                            ></div>
                        </div>
                        
                        <div 
                            className="shimmer"
                            style={{ 
                                height: '32px', 
                                width: '80px', 
                                borderRadius: '4px', 
                                marginBottom: '8px' 
                            }}
                        ></div>
                        
                        <div 
                            className="shimmer"
                            style={{ 
                                height: '14px', 
                                width: '120px', 
                                borderRadius: '4px' 
                            }}
                        ></div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default LoadingSpinner;
export { TableLoadingSkeleton, CardLoadingSkeleton, StatCardLoadingSkeleton };