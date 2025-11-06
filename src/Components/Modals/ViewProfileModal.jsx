import React from 'react';

/**
 * ViewProfileModal Component
 * Modal for displaying detailed profile information
 */
function ViewProfileModal({ profile, onClose, onEdit }) {
    if (!profile) return null;

    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999, 
            padding: '24px' 
        }}>
            <div style={{ 
                backgroundColor: '#ffffff', 
                borderRadius: '16px', 
                maxWidth: '1200px', 
                width: '100%', 
                maxHeight: '90vh', 
                overflow: 'auto', 
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)' 
            }}>
                {/* Modal Header */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', 
                    color: '#ffffff', 
                    padding: '24px', 
                    borderRadius: '16px 16px 0 0', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                            Profile Details
                        </h2>
                        <div style={{ fontSize: '14px', opacity: '0.9' }}>
                            {profile.profileId} | Classification: {profile.fileClassification}
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            background: 'rgba(255,255,255,0.2)', 
                            color: '#ffffff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            padding: '8px 16px', 
                            fontSize: '16px', 
                            cursor: 'pointer', 
                            fontWeight: 'bold' 
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '32px', maxHeight: '70vh', overflow: 'auto' }}>
                    
                    {/* Basic Information */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                            📋 Basic Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <div><strong style={{ color: '#6b7280' }}>Profile ID:</strong> <span style={{ color: '#1e3a8a', fontWeight: '600' }}>{profile.profileId}</span></div>
                            <div><strong style={{ color: '#6b7280' }}>Full Name:</strong> {profile.name}</div>
                            <div><strong style={{ color: '#6b7280' }}>Case:</strong> {profile.case || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Guardian:</strong> {profile.guardian || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Date of Birth:</strong> {profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Age:</strong> {profile.age} years</div>
                            <div><strong style={{ color: '#6b7280' }}>Gender:</strong> {profile.gender}</div>
                            <div><strong style={{ color: '#6b7280' }}>Place of Birth:</strong> {profile.placeOfBirth || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Marital Status:</strong> {profile.maritalStatus || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Nationality:</strong> {profile.nationality || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Religion:</strong> {profile.religion || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Blood Group:</strong> {profile.bloodGroup || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Family Information */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                            👨‍👩‍👧‍👦 Family Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <div><strong style={{ color: '#6b7280' }}>Father:</strong> {profile.father || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Mother:</strong> {profile.mother || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Brothers:</strong> {profile.brothers || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Sisters:</strong> {profile.sisters || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Uncles:</strong> {profile.uncles || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Aunts:</strong> {profile.aunts || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Wives:</strong> {profile.wives || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <strong style={{ color: '#6b7280' }}>Children:</strong>
                                {profile.children && profile.children.length > 0 ? (
                                    <div style={{ marginTop: '8px' }}>
                                        {profile.children.map((child, index) => (
                                            <div key={index} style={{ marginLeft: '16px', fontSize: '14px' }}>
                                                • {child.name} ({child.gender})
                                            </div>
                                        ))}
                                    </div>
                                ) : ' N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                            📞 Contact Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <div><strong style={{ color: '#6b7280' }}>Phone:</strong> {profile.phone || profile.mobile || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Email:</strong> {profile.email || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>WhatsApp:</strong> {profile.whatsapp || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Telegram:</strong> {profile.telegram || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Facebook:</strong> {profile.facebook || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Instagram:</strong> {profile.instagram || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>YouTube:</strong> {profile.youtube || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>UPI:</strong> {profile.upi || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Present Address:</strong> {profile.presentAddress || profile.address || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Permanent Address:</strong> {profile.permanentAddress || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <strong style={{ color: '#6b7280' }}>IMEI Numbers:</strong>
                                {profile.imeiNumbers && profile.imeiNumbers.length > 0 ? 
                                    profile.imeiNumbers.join(', ') : 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Physical Description */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                            👤 Physical Description
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <div><strong style={{ color: '#6b7280' }}>Height:</strong> {profile.height || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Weight:</strong> {profile.weight || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Body Build:</strong> {profile.bodyBuild || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Complexion:</strong> {profile.complexion || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Hair:</strong> {profile.hair || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Eyes:</strong> {profile.eye || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Moustache:</strong> {profile.moustache || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Beard:</strong> {profile.beard || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Handed:</strong> {profile.handed || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Identification Mark:</strong> {profile.identificationMark || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Dress Style:</strong> {profile.dress || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Physical Peculiarity:</strong> {profile.physicalPeculiarity || profile.peculiarity || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Education & Professional Info */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                            🎓 Education & Professional Information
                        </h3>
                        <div style={{ marginBottom: '16px' }}>
                            <strong style={{ color: '#6b7280' }}>Education:</strong>
                            {profile.education && profile.education.length > 0 ? (
                                <div style={{ marginTop: '8px' }}>
                                    {profile.education.map((edu, index) => (
                                        <div key={index} style={{ marginLeft: '16px', fontSize: '14px', marginBottom: '4px' }}>
                                            • {edu.level} - {edu.school} ({edu.year})
                                        </div>
                                    ))}
                                </div>
                            ) : ' N/A'}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <div><strong style={{ color: '#6b7280' }}>Expertise:</strong> {profile.expertise || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Occupation Before:</strong> {profile.occupationBefore || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Previous Organization:</strong> {profile.prevOrg || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Present Organization:</strong> {profile.presentOrg || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Profession:</strong> {profile.profession || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Annual Income:</strong> {profile.annualIncome || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Languages Known:</strong> {profile.languagesKnown || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Documents & IDs */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                            📄 Documents & IDs
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <div><strong style={{ color: '#6b7280' }}>Aadhar:</strong> {profile.aadhar || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>PAN:</strong> {profile.pan || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Driving License:</strong> {profile.dl || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Passport:</strong> {profile.passport || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Voter ID:</strong> {profile.voter || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Ration Card:</strong> {profile.ration || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Credit Card:</strong> {profile.creditCard || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Bank Details:</strong> {profile.bankDetails || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Risk Assessment */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                            ⚠️ Risk Assessment & Activities
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Radicalization Level:</strong>
                                <div style={{ marginTop: '8px' }}>
                                    <span style={{ 
                                        padding: '6px 16px', 
                                        borderRadius: '12px', 
                                        fontSize: '14px', 
                                        fontWeight: '600', 
                                        backgroundColor: profile.radicalizationLevel === 'High' ? '#fecaca' : 
                                                        profile.radicalizationLevel === 'Medium' ? '#fef3c7' : '#d1fae5', 
                                        color: profile.radicalizationLevel === 'High' ? '#991b1b' : 
                                               profile.radicalizationLevel === 'Medium' ? '#92400e' : '#166534' 
                                    }}>
                                        {profile.radicalizationLevel}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Monitoring Status:</strong>
                                <div style={{ marginTop: '8px', fontSize: '14px', color: '#374151' }}>
                                    {profile.monitoringStatus}
                                </div>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Radicalization Potential:</strong> {profile.radicalizationPotential || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Illegal Activities:</strong> {profile.illegalActivities || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Activities Type:</strong> {profile.activitiesType || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Whereabouts:</strong> {profile.whereabouts || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Hideouts:</strong> {profile.hideouts || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Legal & Case Information */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                            ⚖️ Legal & Case Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <div><strong style={{ color: '#6b7280' }}>Cases Involved:</strong> {profile.casesInvolved || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Prison Status:</strong> {profile.prisonStatus || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Advocate:</strong> {profile.advocate || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Interrogated By:</strong> {profile.interrogatedBy || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Security Proceedings:</strong> {profile.securityProceedings || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Jail Activities:</strong> {profile.jailActivities || 'N/A'}</div>
                            <div style={{ gridColumn: '1 / -1' }}><strong style={{ color: '#6b7280' }}>Associates in Jail:</strong> {profile.associatesJail || 'N/A'}</div>
                            {profile.arrestDetails && (
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <strong style={{ color: '#6b7280' }}>Arrest Details:</strong>
                                    <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '14px' }}>
                                        {(() => {
                                            try {
                                                const arrestData = typeof profile.arrestDetails === 'string' ? JSON.parse(profile.arrestDetails) : profile.arrestDetails;
                                                return (
                                                    <div>
                                                        <div><strong>Police Station:</strong> {arrestData.policeStation}</div>
                                                        <div><strong>Crime No/Section Law:</strong> {arrestData.crimeNoSecLaw}</div>
                                                        <div><strong>Date & Place of Arrest:</strong> {arrestData.datePlaceOfArrest}</div>
                                                        <div><strong>Co-accused:</strong> {arrestData.coAccused}</div>
                                                        <div><strong>Recoveries:</strong> {arrestData.recoveries}</div>
                                                    </div>
                                                );
                                            } catch (e) {
                                                return profile.arrestDetails;
                                            }
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Associates & Relations */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                            👥 Associates & Relations
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px' }}>
                            <div><strong style={{ color: '#6b7280' }}>Close Friends:</strong> {profile.closeFriends || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Relations Abroad:</strong> {profile.relationsAbroad || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Relations in India:</strong> {profile.relationsIndia || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Associates Abroad:</strong> {profile.associatesAbroad || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Relatives (Wife's Side):</strong> {profile.relativesWifeSide || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Relatives in Security:</strong> {profile.relativesSecurity || 'N/A'}</div>
                            {profile.closeAssociates && profile.closeAssociates.length > 0 && (
                                <div>
                                    <strong style={{ color: '#6b7280' }}>Close Associates:</strong>
                                    <div style={{ marginTop: '8px' }}>
                                        {profile.closeAssociates.map((associate, index) => (
                                            <div key={index} style={{ marginLeft: '16px', fontSize: '14px', marginBottom: '4px' }}>
                                                • {associate.name} - {associate.address} ({associate.phone})
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GPS & Location Information */}
                    {(profile.houseGPS || profile.workGPS) && (
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                                📍 GPS & Location Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                <div><strong style={{ color: '#6b7280' }}>House GPS:</strong> {profile.houseGPS || 'N/A'}</div>
                                <div><strong style={{ color: '#6b7280' }}>Work GPS:</strong> {profile.workGPS || 'N/A'}</div>
                                <div><strong style={{ color: '#6b7280' }}>Countries Visited:</strong> {profile.countriesVisited || 'N/A'}</div>
                                <div><strong style={{ color: '#6b7280' }}>Illegal Crossings:</strong> {profile.illegalCrossings || 'N/A'}</div>
                                <div><strong style={{ color: '#6b7280' }}>Properties:</strong> {profile.properties || 'N/A'}</div>
                                <div><strong style={{ color: '#6b7280' }}>Vehicles:</strong> {profile.vehicles || 'N/A'}</div>
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                            ℹ️ Additional Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <div><strong style={{ color: '#6b7280' }}>Speech Style:</strong> {profile.speechStyle || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Mannerism:</strong> {profile.mannerism || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Habits:</strong> {profile.habits || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Economic Status:</strong> {profile.economicStatus || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Main Financier:</strong> {profile.mainFinancier || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Religious Activities:</strong> {profile.religiousActivities || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Video:</strong> {profile.video || 'N/A'}</div>
                            <div><strong style={{ color: '#6b7280' }}>Verified By:</strong> {profile.verifiedBy || 'N/A'}</div>
                        </div>
                        {profile.caseParticulars && (
                            <div style={{ marginTop: '16px' }}>
                                <strong style={{ color: '#6b7280' }}>Case Particulars:</strong>
                                <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '14px' }}>
                                    {profile.caseParticulars}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* System Information */}
                    <div style={{ marginBottom: '16px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '16px' }}>
                            🖥️ System Information
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '14px' }}>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Created:</strong> {new Date(profile.createdAt).toLocaleString()}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Last Updated:</strong> {new Date(profile.updatedAt || profile.createdAt).toLocaleString()}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Created By:</strong> {profile.createdBy || 'system'}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Updated By:</strong> {profile.lastUpdatedBy || 'system'}
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Classification:</strong> 
                                <span style={{ 
                                    padding: '4px 12px', 
                                    borderRadius: '12px', 
                                    fontSize: '12px', 
                                    fontWeight: '500', 
                                    backgroundColor: profile.fileClassification === 'Top Secret' ? '#7f1d1d' : 
                                                    profile.fileClassification === 'Secret' ? '#dc2626' : '#6b7280', 
                                    color: '#ffffff',
                                    marginLeft: '8px'
                                }}>
                                    {profile.fileClassification}
                                </span>
                            </div>
                            <div>
                                <strong style={{ color: '#6b7280' }}>Status:</strong> {profile.isActive ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div style={{ 
                    padding: '16px 32px', 
                    borderTop: '1px solid #e5e7eb', 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '12px' 
                }}>
                    <button 
                        onClick={() => { onClose(); onEdit(profile._id); }} 
                        style={{ 
                            background: '#f59e0b', 
                            color: '#ffffff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            padding: '10px 24px', 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            cursor: 'pointer' 
                        }}
                    >
                        ✏ Edit Profile
                    </button>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            background: '#6b7280', 
                            color: '#ffffff', 
                            border: 'none', 
                            borderRadius: '8px', 
                            padding: '10px 24px', 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            cursor: 'pointer' 
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewProfileModal;
