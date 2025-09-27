import React, { useState } from 'react';
import apiService from '../services/api.js';

const logoPath = '/src/images/logo.png';

function AddProfile({ onBack }) {
    const [form, setForm] = useState({});
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        setError(''); // Clear error on input change
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate required fields
            const requiredFields = ['fullName', 'dob', 'age', 'gender', 'radicalizationLevel'];
            const missingFields = requiredFields.filter(field => !form[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Please fill in required fields: ${missingFields.join(', ')}`);
            }

            // Create profile with backend API
            const response = await apiService.createProfile(form, files);
            
            if (response.success) {
                setSuccess(`Profile created successfully! Profile ID: ${response.data.profileId}`);
                
                // Auto-redirect after success
                setTimeout(() => {
                    if (onBack) onBack();
                }, 2000);
            } else {
                throw new Error(response.message || 'Failed to create profile');
            }
        } catch (error) {
            console.error('❌ Profile creation error:', error);
            setError(error.message || 'Failed to create profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        [
            { section: '1. Basic Identification', fields: [
                { label: 'Full Name / Aliases', name: 'fullName', type: 'text', required: true },
                { label: 'Date of Birth', name: 'dob', type: 'date', required: true },
                { label: 'Age', name: 'age', type: 'number', required: true },
                { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
                { label: 'Photograph(s)', name: 'photos', type: 'file', multiple: true },
                { label: 'Physical Description', name: 'physicalDesc', type: 'textarea', placeholder: 'Height, build, scars, tattoos, marks' },
                { label: 'Nationality & Passport Details', name: 'nationality', type: 'text' },
                { label: 'Government IDs', name: 'govtIds', type: 'textarea', placeholder: 'Aadhaar / PAN / Driving License / Govt IDs' },
            ]},
            { section: '2. Contact & Address History', fields: [
                { label: 'Current Address', name: 'currentAddress', type: 'textarea' },
                { label: 'Permanent Address', name: 'permanentAddress', type: 'textarea' },
                { label: 'Past Known Addresses', name: 'pastAddresses', type: 'textarea' },
                { label: 'Known Safe Houses / Hideouts', name: 'safeHouses', type: 'textarea' },
                { label: 'Contact Information', name: 'contacts', type: 'textarea', placeholder: 'Phone numbers, emails, social media handles' },
            ]},
            { section: '3. Criminal / Legal Background', fields: [
                { label: 'FIR Numbers / Case References', name: 'firNumbers', type: 'textarea' },
                { label: 'Arrest History', name: 'arrestHistory', type: 'textarea', placeholder: 'Dates, charges, outcome' },
                { label: 'Bail / Custody Status', name: 'bailStatus', type: 'text' },
                { label: 'Court Proceedings & Case Status', name: 'courtStatus', type: 'textarea' },
                { label: 'Associated Sections & Case Codes', name: 'caseCodes', type: 'textarea', placeholder: 'IPC/UA(P)A Sections, NIA/ATS case codes' },
            ]},
            { section: '4. Affiliations & Networks', fields: [
                { label: 'Known Associates', name: 'knownAssociates', type: 'textarea', placeholder: 'Known individuals' },
                { label: 'Organizational Links', name: 'orgLinks', type: 'textarea', placeholder: 'Groups, cells, NGOs, front organizations' },
                { label: 'Foreign Links', name: 'foreignLinks', type: 'textarea', placeholder: 'Contacts abroad, handlers, funding sources' },
                { label: 'Family / Relatives of Interest', name: 'familyInterest', type: 'textarea' },
            ]},
        ],
        [
            { section: '5. Activities & Operations', fields: [
                { label: 'Recruitment / Propaganda Role', name: 'recruitmentRole', type: 'textarea' },
                { label: 'Financing Channels', name: 'financingChannels', type: 'textarea', placeholder: 'Money laundering methods' },
                { label: 'Arms/Explosives Procurement', name: 'procurementMethods', type: 'textarea' },
                { label: 'Communication Patterns', name: 'communicationPatterns', type: 'textarea', placeholder: 'Apps, codes, VPN usage' },
                { label: 'Past Attacks or Attempts', name: 'pastAttacks', type: 'textarea' },
            ]},
            { section: '6. Digital & Technical Footprint', fields: [
                { label: 'Social Media Accounts', name: 'socialMedia', type: 'textarea', placeholder: 'Facebook, Instagram, Twitter/X, Telegram, etc.' },
                { label: 'Encrypted Messaging IDs', name: 'messagingIDs', type: 'textarea', placeholder: 'Signal, WhatsApp, Threema, etc.' },
                { label: 'Email & Cloud Storage', name: 'emailCloud', type: 'textarea' },
                { label: 'Device Information', name: 'deviceIMEI', type: 'textarea', placeholder: 'IMEIs, SIM numbers, IP logs' },
                { label: 'Online Handles / Forums', name: 'onlineHandles', type: 'textarea' },
            ]},
            { section: '7. Travel & Movement', fields: [
                { label: 'Travel History', name: 'travelHistory', type: 'textarea', placeholder: 'Domestic & international' },
                { label: 'Border Crossings / Visas', name: 'borderCrossings', type: 'textarea' },
                { label: 'Known Routes', name: 'knownRoutes', type: 'textarea', placeholder: 'Land, air, sea' },
                { label: 'Vehicle Details', name: 'vehicleDetails', type: 'textarea', placeholder: 'Ownership, number plates, fake IDs' },
            ]},
            { section: '8. Financial Details', fields: [
                { label: 'Bank Accounts & IFSC Codes', name: 'bankAccounts', type: 'textarea' },
                { label: 'UPI / Digital Wallet IDs', name: 'upiWallets', type: 'textarea' },
                { label: 'Hawala Channels', name: 'hawalaChannels', type: 'textarea', placeholder: 'Informal transfers' },
                { label: 'Seized Assets / Properties', name: 'seizedAssets', type: 'textarea' },
                { label: 'Funding Sources', name: 'fundingSources', type: 'textarea', placeholder: 'Local & foreign' },
            ]},
        ],
        [
            { section: '9. Risk & Threat Assessment', fields: [
                { label: 'Level of Radicalization', name: 'radicalizationLevel', type: 'select', options: ['Low', 'Medium', 'High'], required: true },
                { label: 'Threat Category', name: 'threatCategory', type: 'select', options: ['Recruiter', 'Financier', 'Attacker', 'Propagandist', 'Other'] },
                { label: 'Intelligence Inputs', name: 'intelligenceInputs', type: 'textarea', placeholder: 'IB, RAW, State Police, etc.' },
                { label: 'Potential Targets', name: 'potentialTargets', type: 'textarea', placeholder: 'Areas of concern' },
            ]},
            { section: '10. Evidence & Seizures', fields: [
                { label: 'Weapons / Explosives Seized', name: 'weaponsSeized', type: 'textarea' },
                { label: 'Electronic Devices', name: 'electronicDevices', type: 'textarea', placeholder: 'Phones, laptops, storage media' },
                { label: 'Documents', name: 'documents', type: 'textarea', placeholder: 'Pamphlets, fake IDs, passports, maps' },
                { label: 'Forensic Reports', name: 'forensicReports', type: 'textarea', placeholder: 'Cyber, chemical, biological' },
            ]},
            { section: '11. Surveillance & Monitoring', fields: [
                { label: 'Past Surveillance Logs', name: 'surveillanceLogs', type: 'textarea', placeholder: 'Physical & technical' },
                { label: 'Current Monitoring Status', name: 'monitoringStatus', type: 'select', options: ['Active Monitoring', 'Closed', 'Dormant'] },
                { label: 'Informant Reports', name: 'informantReports', type: 'textarea' },
                { label: 'Technical Intelligence Records', name: 'intelRecords', type: 'textarea', placeholder: 'CCTV/Drone/Technical records' },
            ]},
            { section: '12. Operational Notes', fields: [
                { label: 'Lead Investigating Officer & Unit', name: 'leadOfficer', type: 'text' },
                { label: 'Field Reports', name: 'fieldReports', type: 'textarea', placeholder: 'Interrogation notes' },
                { label: 'Cross-Agency Inputs', name: 'crossAgencyInputs', type: 'textarea', placeholder: 'NIA, IB, CBI, Military Intelligence' },
                { label: 'Status Updates', name: 'statusUpdates', type: 'select', options: ['Under Trial', 'Absconding', 'Convicted', 'Acquitted'] },
            ]},
            { section: '13. Classification & Access', fields: [
                { label: 'File Classification', name: 'fileClassification', type: 'select', options: ['Top Secret', 'Confidential', 'Restricted'], required: true },
                { label: 'Last Updated By', name: 'lastUpdatedBy', type: 'text', placeholder: 'Officer ID, unit' },
                { label: 'Access Log', name: 'accessLog', type: 'textarea', placeholder: 'Who viewed/modified file' },
            ]},
        ],
    ];

    const inputStyles = {
        base: {
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease',
        },
        focus: {
            outline: 'none',
            borderColor: '#4f46e5',
            boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e0f2fe 0%, #f3e5f5 100%)',
            padding: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '32px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '24px',
                maxWidth: '1400px',
                margin: '0 auto 32px auto'
            }}>
                <img src={logoPath} alt="Logo" style={{ width: '64px', height: '64px', marginRight: '24px' }} />
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#1e3a8a',
                    margin: 0,
                    letterSpacing: '0.5px'
                }}>
                    Add New Accused Profile
                </h1>
            </div>

            {/* Success Message */}
            {success && (
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto 24px auto',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    color: '#166534',
                    fontSize: '14px',
                    fontWeight: '500'
                }}>
                    ✅ {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto 24px auto',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    color: '#991b1b',
                    fontSize: '14px',
                    fontWeight: '500'
                }}>
                    ❌ {error}
                </div>
            )}

            {/* Main Form Container */}
            <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                padding: '32px',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {/* Three Column Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '32px',
                    marginBottom: '40px'
                }}>
                    {columns.map((col, colIdx) => (
                        <div key={colIdx} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px'
                        }}>
                            {col.map(section => (
                                <div key={section.section} style={{
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}>
                                    <h2 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#1e40af',
                                        marginBottom: '20px',
                                        paddingBottom: '12px',
                                        borderBottom: '2px solid #e0e7ff',
                                        margin: '0 0 20px 0'
                                    }}>
                                        {section.section}
                                    </h2>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {section.fields.map(field => (
                                            <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <label style={{
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: '#374151',
                                                    marginBottom: '4px'
                                                }}>
                                                    {field.label}
                                                    {field.required && <span style={{ color: '#dc2626', marginLeft: '4px' }}>*</span>}
                                                </label>
                                                
                                                {field.type === 'select' ? (
                                                    <select
                                                        value={form[field.name] || ''}
                                                        onChange={e => handleChange(field.name, e.target.value)}
                                                        style={{
                                                            ...inputStyles.base,
                                                            cursor: 'pointer'
                                                        }}
                                                        onFocus={e => Object.assign(e.target.style, inputStyles.focus)}
                                                        onBlur={e => Object.assign(e.target.style, inputStyles.base)}
                                                        required={field.required}
                                                    >
                                                        <option value="">Select...</option>
                                                        {field.options.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : field.type === 'file' ? (
                                                    <input
                                                        type="file"
                                                        multiple={field.multiple}
                                                        accept="image/*"
                                                        onChange={field.name === 'photos' ? handleFileChange : e => handleChange(field.name, e.target.files)}
                                                        style={{
                                                            ...inputStyles.base,
                                                            padding: '8px 12px'
                                                        }}
                                                    />
                                                ) : field.type === 'textarea' ? (
                                                    <textarea
                                                        value={form[field.name] || ''}
                                                        onChange={e => handleChange(field.name, e.target.value)}
                                                        placeholder={field.placeholder}
                                                        rows={3}
                                                        style={{
                                                            ...inputStyles.base,
                                                            resize: 'vertical',
                                                            minHeight: '80px'
                                                        }}
                                                        onFocus={e => Object.assign(e.target.style, inputStyles.focus)}
                                                        onBlur={e => Object.assign(e.target.style, inputStyles.base)}
                                                        required={field.required}
                                                    />
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        value={form[field.name] || ''}
                                                        onChange={e => handleChange(field.name, e.target.value)}
                                                        placeholder={field.placeholder}
                                                        style={inputStyles.base}
                                                        onFocus={e => Object.assign(e.target.style, inputStyles.focus)}
                                                        onBlur={e => Object.assign(e.target.style, inputStyles.base)}
                                                        required={field.required}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '24px',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <button
                        type="button"
                        onClick={onBack}
                        style={{
                            padding: '12px 32px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={e => e.target.style.backgroundColor = '#e5e7eb'}
                        onMouseOut={e => e.target.style.backgroundColor = '#f3f4f6'}
                    >
                        ← Back
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        style={{
                            padding: '12px 32px',
                            background: isLoading ? '#9ca3af' : 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: isLoading ? 'none' : '0 4px 12px rgba(79, 70, 229, 0.3)',
                            opacity: isLoading ? 0.7 : 1
                        }}
                        onMouseOver={e => !isLoading && (e.target.style.transform = 'translateY(-2px)')}
                        onMouseOut={e => !isLoading && (e.target.style.transform = 'translateY(0px)')}
                    >
                        {isLoading ? 'Creating Profile...' : 'Add Profile →'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddProfile;