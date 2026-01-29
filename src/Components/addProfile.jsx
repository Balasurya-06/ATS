import React, { useState } from 'react';
import apiService from '../services/api.js';

function AddProfile({ onBack }) {
    const [activeStep, setActiveStep] = useState(0);
    const [form, setForm] = useState({
        // Basic
        name: '', alias: '', case: '',
        // Personal
        guardian: '', placeOfBirth: '', dob: '', gender: 'Male', maritalStatus: '', phone: '',
        imeiNumbers: [''],
        // Family
        family: {
            father: '', mother: '', brothers: '', sisters: '', uncles: '', aunts: '', wives: '',
            children: [],
            closeFriends: '',
            relativesWifeSide: { fatherInLaw: '', motherInLaw: '', others: '' }
        },
        // Relations
        relationsAbroad: '', relationsIndia: '', associatesAbroad: '', relativesSecurity: '',
        // Background
        occupationBefore: '',
        address: {
            present: { doorNo: '', streetName: '', villageWard: '', district: '', statePinCode: '', policeStation: '' },
            permanent: { doorNo: '', streetName: '', villageWard: '', district: '', statePinCode: '', policeStation: '' }
        },
        hideouts: '', nationality: 'Indian', religion: '', bloodGroup: '',
        education: [],
        expertise: '', profession: '', annualIncome: '',
        bankDetails: { bankName: '', accountNo: '', ifscCode: '', branch: '' },
        // Identity
        identityCards: { drivingLicense: '', pan: '', aadhar: '', passport: '', voterId: '', rationCard: '', creditCard: '' },
        // Social Media
        socialMedia: { email: '', whatsapp: '', facebook: '', instagram: '', telegram: '', upi: '', youtube: '' },
        // Physical
        physicalDescription: { height: '', weight: '', bodyBuild: '', complexion: '', hairColor: '', eyeColor: '', moustache: '', beard: '' },
        languages: [],
        identificationMark: '', dress: '', specificFeatures: '', handed: 'Right handed',
        physicalPeculiarities: '', speechStyle: '', mannerism: '', habits: '',
        // Activities
        whereabouts: '', illegalActivities: '', activitiesType: '', prevOrganization: '', presentOrganization: '',
        religiousActivities: '', radicalizationPotential: '', economicStatus: '', mainFinancier: '',
        countriesVisited: '', illegalCrossings: '', guides: '',
        properties: { movable: '', immovable: '', vehicles: '' },
        hideoutPlace: '',
        // Legal
        fingerPrintAttached: '', advocate: { name: '', phone: '' },
        arrestDetails: { policeStation: '', crimeNoAndSec: '', datePlace: '', arrestedBy: '', bailOrder: '', coAccused: '', recoveries: '', category: '' },
        jailActivities: '', associatesJail: '',
        casesInvolved: { ui: '', pt: '', conviction: '', acquittal: '' },
        securityProceedings: '', prisonStatus: '', interrogatedBy: '',
        houseGPS: { photo: '', gpsLocation: '', remarks: '' },
        workplaceGPS: { photo: '', gpsLocation: '', remarks: '' },
        closeAssociates: [],
        video: '', verifiedBy: '', dateOfCreation: '',
        caseParticulars: []
    });
    const [files, setFiles] = useState({ front: null, back: null, side: null });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const steps = [
        'Basic Info', 'Personal', 'Family', 'Address', 'Education',
        'Identity', 'Social Media', 'Physical', 'Activities', 'Legal', 'Cases'
    ];

    const handleChange = (path, value) => {
        const keys = path.split('.');
        setForm(prev => {
            const updated = { ...prev };
            let current = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await apiService.createProfile(form, files);
            if (response.success) {
                setSuccess('Profile created successfully!');
                setTimeout(() => onBack(), 2000);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const Input = ({ label, value, onChange, type = 'text', required = false }) => (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>
                {label} {required && '*'}
            </label>
            <input 
                type={type} value={value || ''} onChange={e => onChange(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#f8fafc' }}
            />
        </div>
    );

    const Textarea = ({ label, value, onChange, rows = 3 }) => (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>{label}</label>
            <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={rows}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#f8fafc', resize: 'vertical' }}
            />
        </div>
    );

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0 }}>Add Profile - ATS Dossier</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '13px' }}>Complete intelligence record (67 fields)</p>
                </div>
                <button onClick={onBack} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}>Cancel</button>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '220px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '24px 16px', overflowY: 'auto' }}>
                    {steps.map((step, idx) => (
                        <div key={idx} onClick={() => setActiveStep(idx)}
                            style={{ padding: '12px', borderRadius: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                                color: activeStep === idx ? '#6366f1' : '#64748b', background: activeStep === idx ? '#e0e7ff' : 'transparent' }}>
                            {idx + 1}. {step}
                        </div>
                    ))}
                </div>

                <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
                    {success && <div style={{ padding: '12px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px' }}>✅ {success}</div>}
                    {error && <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '16px' }}>⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Step 0: Basic Info */}
                        {activeStep === 0 && (
                            <div>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Basic Information</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <Input label="Name" value={form.name} onChange={v => handleChange('name', v)} required />
                                    <Input label="Alias Name" value={form.alias} onChange={v => handleChange('alias', v)} />
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <Input label="Case Number" value={form.case} onChange={v => handleChange('case', v)} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>PHOTOGRAPHS</label>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {['front', 'back', 'side'].map(view => (
                                                <div key={view} style={{ flex: 1, height: '100px', border: '2px dashed #cbd5e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: '#f8fafc' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'capitalize' }}>{view}</span>
                                                    <input type="file" onChange={e => setFiles(prev => ({ ...prev, [view]: e.target.files[0] }))}
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Personal */}
                        {activeStep === 1 && (
                            <div>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Personal Information (Fields 1-8)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <Input label="Guardian's Name" value={form.guardian} onChange={v => handleChange('guardian', v)} />
                                    <Input label="Place of Birth" value={form.placeOfBirth} onChange={v => handleChange('placeOfBirth', v)} />
                                    <Input label="Date of Birth" type="date" value={form.dob} onChange={v => handleChange('dob', v)} required />
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>GENDER *</label>
                                        <select value={form.gender} onChange={e => handleChange('gender', e.target.value)}  
                                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', background: '#f8fafc' }}>
                                            <option>Male</option><option>Female</option><option>Other</option>
                                        </select>
                                    </div>
                                    <Input label="Marital Status" value={form.maritalStatus} onChange={v => handleChange('maritalStatus', v)} />
                                    <Input label="Phone Number" value={form.phone} onChange={v => handleChange('phone', v)} />
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <Textarea label="IMEI Numbers (comma separated)" value={form.imeiNumbers.join(', ')} onChange={v => handleChange('imeiNumbers', v.split(',').map(s => s.trim()))} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Family */}
                        {activeStep === 2 && (
                            <div>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Family Members (Field 9)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <Input label="Father" value={form.family.father} onChange={v => handleChange('family.father', v)} />
                                    <Input label="Mother" value={form.family.mother} onChange={v => handleChange('family.mother', v)} />
                                    <Input label="Brother(s)" value={form.family.brothers} onChange={v => handleChange('family.brothers', v)} />
                                    <Input label="Sister(s)" value={form.family.sisters} onChange={v => handleChange('family.sisters', v)} />
                                    <Input label="Uncle(s)" value={form.family.uncles} onChange={v => handleChange('family.uncles', v)} />
                                    <Input label="Aunt(s)" value={form.family.aunts} onChange={v => handleChange('family.aunts', v)} />
                                    <Input label="Wife/Wives" value={form.family.wives} onChange={v => handleChange('family.wives', v)} />
                                    <Input label="Close Friends" value={form.family.closeFriends} onChange={v => handleChange('family.closeFriends', v)} />
                                    <Input label="Father-in-Law" value={form.family.relativesWifeSide.fatherInLaw} onChange={v => handleChange('family.relativesWifeSide.fatherInLaw', v)} />
                                    <Input label="Mother-in-Law" value={form.family.relativesWifeSide.motherInLaw} onChange={v => handleChange('family.relativesWifeSide.motherInLaw', v)} />
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <Textarea label="Other Relatives (Wife Side)" value={form.family.relativesWifeSide.others} onChange={v => handleChange('family.relativesWifeSide.others', v)} />
                                        <Textarea label="Relations Abroad (Field 10)" value={form.relationsAbroad} onChange={v => handleChange('relationsAbroad', v)} />
                                        <Textarea label="Relations in India (Field 11)" value={form.relationsIndia} onChange={v => handleChange('relationsIndia', v)} />
                                        <Textarea label="Associates Abroad (Field 12)" value={form.associatesAbroad} onChange={v => handleChange('associatesAbroad', v)} />
                                        <Textarea label="Relatives in Security Forces (Field 13)" value={form.relativesSecurity} onChange={v => handleChange('relativesSecurity', v)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Address */}
                        {activeStep === 3 && (
                            <div>
                                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700' }}>Residential Address (Field 15)</h3>
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: '#6366f1' }}>Present Address</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <Input label="Door No." value={form.address.present.doorNo} onChange={v => handleChange('address.present.doorNo', v)} />
                                        <Input label="Street Name" value={form.address.present.streetName} onChange={v => handleChange('address.present.streetName', v)} />
                                        <Input label="Village/Ward" value={form.address.present.villageWard} onChange={v => handleChange('address.present.villageWard', v)} />
                                        <Input label="District/City" value={form.address.present.district} onChange={v => handleChange('address.present.district', v)} />
                                        <Input label="State & Pin Code" value={form.address.present.statePinCode} onChange={v => handleChange('address.present.statePinCode', v)} />
                                        <Input label="Police Station" value={form.address.present.policeStation} onChange={v => handleChange('address.present.policeStation', v)} />
                                    </div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: '#6366f1' }}>Permanent Address</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <Input label="Door No." value={form.address.permanent.doorNo} onChange={v => handleChange('address.permanent.doorNo', v)} />
                                        <Input label="Street Name" value={form.address.permanent.streetName} onChange={v => handleChange('address.permanent.streetName', v)} />
                                        <Input label="Village/Ward" value={form.address.permanent.villageWard} onChange={v => handleChange('address.permanent.villageWard', v)} />
                                        <Input label="District/City" value={form.address.permanent.district} onChange={v => handleChange('address.permanent.district', v)} />
                                        <Input label="State & Pin Code" value={form.address.permanent.statePinCode} onChange={v => handleChange('address.permanent.statePinCode', v)} />
                                        <Input label="Police Station" value={form.address.permanent.policeStation} onChange={v => handleChange('address.permanent.policeStation', v)} />
                                    </div>
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    <Textarea label="Hideouts Last 10 Years (Field 16)" value={form.hideouts} onChange={v => handleChange('hideouts', v)} />
                                    <Textarea label="Occupation Before Militancy (Field 14)" value={form.occupationBefore} onChange={v => handleChange('occupationBefore', v)} />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Education */}
                        {activeStep === 4 && (
                            <div>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Background & Education (Fields 17-25)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <Input label="Nationality (Field 17)" value={form.nationality} onChange={v => handleChange('nationality', v)} />
                                    <Input label="Religion & Sub-caste (Field 18)" value={form.religion} onChange={v => handleChange('religion', v)} />
                                    <Input label="Blood Group (Field 19)" value={form.bloodGroup} onChange={v => handleChange('bloodGroup', v)} />
                                    <Input label="Expertise (Field 22)" value={form.expertise} onChange={v => handleChange('expertise', v)} />
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <Textarea label="Profession/Occupation (Field 23)" value={form.profession} onChange={v => handleChange('profession', v)} />
                                        <Input label="Annual Income (Field 24)" value={form.annualIncome} onChange={v => handleChange('annualIncome', v)} />
                                    </div>
                                    <Input label="Bank Name (Field 25)" value={form.bankDetails.bankName} onChange={v => handleChange('bankDetails.bankName', v)} />
                                    <Input label="Account No." value={form.bankDetails.accountNo} onChange={v => handleChange('bankDetails.accountNo', v)} />
                                    <Input label="IFSC Code" value={form.bankDetails.ifscCode} onChange={v => handleChange('bankDetails.ifscCode', v)} />
                                    <Input label="Branch" value={form.bankDetails.branch} onChange={v => handleChange('bankDetails.branch', v)} />
                                </div>
                            </div>
                        )}

                        {/* Step 5: Identity */}
                        {activeStep === 5 && (
                            <div>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Identity Cards (Field 26)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <Input label="Driving License" value={form.identityCards.drivingLicense} onChange={v => handleChange('identityCards.drivingLicense', v)} />
                                    <Input label="PAN Number" value={form.identityCards.pan} onChange={v => handleChange('identityCards.pan', v)} />
                                    <Input label="Aadhar Number" value={form.identityCards.aadhar} onChange={v => handleChange('identityCards.aadhar', v)} />
                                    <Input label="Passport Number" value={form.identityCards.passport} onChange={v => handleChange('identityCards.passport', v)} />
                                    <Input label="Voter ID" value={form.identityCards.voterId} onChange={v => handleChange('identityCards.voterId', v)} />
                                    <Input label="Ration Card" value={form.identityCards.rationCard} onChange={v => handleChange('identityCards.rationCard', v)} />
                                    <Input label="Credit Card" value={form.identityCards.creditCard} onChange={v => handleChange('identityCards.creditCard', v)} />
                                </div>
                            </div>
                        )}

                        {/* Step 6: Social Media */}
                        {activeStep === 6 && (
                            <div>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Social Media (Field 27)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <Input label="Email ID" value={form.socialMedia.email} onChange={v => handleChange('socialMedia.email', v)} />
                                    <Input label="WhatsApp No." value={form.socialMedia.whatsapp} onChange={v => handleChange('socialMedia.whatsapp', v)} />
                                    <Input label="Facebook ID" value={form.socialMedia.facebook} onChange={v => handleChange('socialMedia.facebook', v)} />
                                    <Input label="Instagram ID" value={form.socialMedia.instagram} onChange={v => handleChange('socialMedia.instagram', v)} />
                                    <Input label="Telegram ID" value={form.socialMedia.telegram} onChange={v => handleChange('socialMedia.telegram', v)} />
                                    <Input label="UPI ID" value={form.socialMedia.upi} onChange={v => handleChange('socialMedia.upi', v)} />
                                    <Input label="Youtube" value={form.socialMedia.youtube} onChange={v => handleChange('socialMedia.youtube', v)} />
                                </div>
                            </div>
                        )}

                        {/* Step 7: Physical */}
                        {activeStep === 7 && (
                            <div>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Physical Description (Fields 28-37)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <Input label="Height (cm)" value={form.physicalDescription.height} onChange={v => handleChange('physicalDescription.height', v)} />
                                    <Input label="Weight (kg)" value={form.physicalDescription.weight} onChange={v => handleChange('physicalDescription.weight', v)} />
                                    <Input label="Body Build" value={form.physicalDescription.bodyBuild} onChange={v => handleChange('physicalDescription.bodyBuild', v)} />
                                    <Input label="Complexion" value={form.physicalDescription.complexion} onChange={v => handleChange('physicalDescription.complexion', v)} />
                                    <Input label="Hair Color & Length" value={form.physicalDescription.hairColor} onChange={v => handleChange('physicalDescription.hairColor', v)} />
                                    <Input label="Eye Color" value={form.physicalDescription.eyeColor} onChange={v => handleChange('physicalDescription.eyeColor', v)} />
                                    <Input label="Moustache" value={form.physicalDescription.moustache} onChange={v => handleChange('physicalDescription.moustache', v)} />
                                    <Input label="Beard" value={form.physicalDescription.beard} onChange={v => handleChange('physicalDescription.beard', v)} />
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <Textarea label="Identification Marks (Field 30)" value={form.identificationMark} onChange={v => handleChange('identificationMark', v)} />
                                        <Input label="Dress Style (Field 31)" value={form.dress} onChange={v => handleChange('dress', v)} />
                                        <Textarea label="Specific Features (Field 32)" value={form.specificFeatures} onChange={v => handleChange('specificFeatures', v)} />
                                        <Input label="Handed (Field 33)" value={form.handed} onChange={v => handleChange('handed', v)} />
                                        <Input label="Physical Peculiarities (Field 34)" value={form.physicalPeculiarities} onChange={v => handleChange('physicalPeculiarities', v)} />
                                        <Input label="Speech Style (Field 35)" value={form.speechStyle} onChange={v => handleChange('speechStyle', v)} />
                                        <Input label="Mannerism (Field 36)" value={form.mannerism} onChange={v => handleChange('mannerism', v)} />
                                        <Input label="Habits (Field 37)" value={form.habits} onChange={v => handleChange('habits', v)} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 8: Activities */}
                        {activeStep === 8 && (
                            <div>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Activities & Organization (Fields 38-51)</h3>
                                <Textarea label="Current Whereabouts (Field 38)" value={form.whereabouts} onChange={v => handleChange('whereabouts', v)} />
                                <Textarea label="Illegal Activities (Field 39)" value={form.illegalActivities} onChange={v => handleChange('illegalActivities', v)} />
                                <Textarea label="Type of Activities/M.O (Field 40)" value={form.activitiesType} onChange={v => handleChange('activitiesType', v)} />
                                <Input label="Previous Organization (Field 41)" value={form.prevOrganization} onChange={v => handleChange('prevOrganization', v)} />
                                <Input label="Present Organization (Field 42)" value={form.presentOrganization} onChange={v => handleChange('presentOrganization', v)} />
                                <Textarea label="Religious Activities (Field 43)" value={form.religiousActivities} onChange={v => handleChange('religiousActivities', v)} />
                                <Textarea label="Radicalization Potential (Field 44)" value={form.radicalizationPotential} onChange={v => handleChange('radicalizationPotential', v)} />
                                <Input label="Economic Status (Field 45)" value={form.economicStatus} onChange={v => handleChange('economicStatus', v)} />
                                <Input label="Main Financier (Field 46)" value={form.mainFinancier} onChange={v => handleChange('mainFinancier', v)} />
                                <Textarea label="Countries Visited (Field 47)" value={form.countriesVisited} onChange={v => handleChange('countriesVisited', v)} />
                                <Textarea label="Illegal Border Crossings (Field 48)" value={form.illegalCrossings} onChange={v => handleChange('illegalCrossings', v)} />
                                <Textarea label="Guides/Intermediates (Field 49)" value={form.guides} onChange={v => handleChange('guides', v)} />
                                <Input label="Movable Property (Field 50)" value={form.properties.movable} onChange={v => handleChange('properties.movable', v)} />
                                <Input label="Immovable Property" value={form.properties.immovable} onChange={v => handleChange('properties.immovable', v)} />
                                <Input label="Vehicles (Field 50)" value={form.properties.vehicles} onChange={v => handleChange('properties.vehicles', v)} />
                                <Input label="Hideout Place (Field 51)" value={form.hideoutPlace} onChange={v => handleChange('hideoutPlace', v)} />
                            </div>
                        )}

                        {/* Step 9: Legal */}
                        {activeStep === 9 && (
                            <div>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Legal & Arrest (Fields 52-63)</h3>
                                <Input label="Fingerprint Attached (Field 52)" value={form.fingerPrintAttached} onChange={v => handleChange('fingerPrintAttached', v)} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                                    <Input label="Advocate Name (Field 53)" value={form.advocate.name} onChange={v => handleChange('advocate.name', v)} />
                                    <Input label="Advocate Phone" value={form.advocate.phone} onChange={v => handleChange('advocate.phone', v)} />
                                </div>
                                <h4 style={{ margin: '20px 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#6366f1' }}>Arrest Details (Field 54-55)</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <Input label="Police Station" value={form.arrestDetails.policeStation} onChange={v => handleChange('arrestDetails.policeStation', v)} />
                                    <Input label="Crime No. & Section" value={form.arrestDetails.crimeNoAndSec} onChange={v => handleChange('arrestDetails.crimeNoAndSec', v)} />
                                    <Input label="Date & Place" value={form.arrestDetails.datePlace} onChange={v => handleChange('arrestDetails.datePlace', v)} />
                                    <Input label="Arrested By" value={form.arrestDetails.arrestedBy} onChange={v => handleChange('arrestDetails.arrestedBy', v)} />
                                    <Input label="Bail Order" value={form.arrestDetails.bailOrder} onChange={v => handleChange('arrestDetails.bailOrder', v)} />
                                    <Input label="Co-Accused" value={form.arrestDetails.coAccused} onChange={v => handleChange('arrestDetails.coAccused', v)} />
                                    <Input label="Recoveries" value={form.arrestDetails.recoveries} onChange={v => handleChange('arrestDetails.recoveries', v)} />
                                    <Input label="Category" value={form.arrestDetails.category} onChange={v => handleChange('arrestDetails.category', v)} />
                                </div>
                                <Textarea label="Jail Activities (Field 56)" value={form.jailActivities} onChange={v => handleChange('jailActivities', v)} />
                                <Textarea label="Associates in Jail (Field 57)" value={form.associatesJail} onChange={v => handleChange('associatesJail', v)} />
                                <h4 style={{ margin: '16px 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#6366f1' }}>Cases Involved (Field 58)</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                                    <Input label="U.I" value={form.casesInvolved.ui} onChange={v => handleChange('casesInvolved.ui', v)} />
                                    <Input label="P.T" value={form.casesInvolved.pt} onChange={v => handleChange('casesInvolved.pt', v)} />
                                    <Input label="Conviction" value={form.casesInvolved.conviction} onChange={v => handleChange('casesInvolved.conviction', v)} />
                                    <Input label="Acquittal" value={form.casesInvolved.acquittal} onChange={v => handleChange('casesInvolved.acquittal', v)} />
                                </div>
                                <Textarea label="Security Proceedings (Field 59)" value={form.securityProceedings} onChange={v => handleChange('securityProceedings', v)} />
                                <Input label="Prison Status (Field 60)" value={form.prisonStatus} onChange={v => handleChange('prisonStatus', v)} />
                                <Textarea label="Interrogated By (Field 61)" value={form.interrogatedBy} onChange={v => handleChange('interrogatedBy', v)} />
                                <h4 style={{ margin: '16px 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#6366f1' }}>GPS Locations (Fields 62-63)</h4>
                                <Input label="House GPS Location" value={form.houseGPS.gpsLocation} onChange={v => handleChange('houseGPS.gpsLocation', v)} />
                                <Input label="House Remarks" value={form.houseGPS.remarks} onChange={v => handleChange('houseGPS.remarks', v)} />
                                <Input label="Workplace GPS" value={form.workplaceGPS.gpsLocation} onChange={v => handleChange('workplaceGPS.gpsLocation', v)} />
                                <Input label="Workplace Remarks" value={form.workplaceGPS.remarks} onChange={v => handleChange('workplaceGPS.remarks', v)} />
                            </div>
                        )}

                        {/* Step 10: Cases */}
                        {activeStep === 10 && (
                            <div>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700' }}>Final Details (Fields 64-67)</h3>
                                <Textarea label="Video Details (Field 65)" value={form.video} onChange={v => handleChange('video', v)} rows={2} />
                                <Input label="Verified By (Field 66)" value={form.verifiedBy} onChange={v => handleChange('verifiedBy', v)} />
                                <Input label="Date of Creation (Field 67)" type="date" value={form.dateOfCreation} onChange={v => handleChange('dateOfCreation', v)} />
                            </div>
                        )}

                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                            <button type="button" onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)} disabled={activeStep === 0}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: activeStep === 0 ? 'not-allowed' : 'pointer', fontWeight: '600', color: '#64748b', opacity: activeStep === 0 ? 0.5 : 1 }}>
                                ← Previous
                            </button>
                            {activeStep < steps.length - 1 ? (
                                <button type="button" onClick={() => setActiveStep(activeStep + 1)}
                                    style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                                    Next →
                                </button>
                            ) : (
                                <button type="submit" disabled={isLoading}
                                    style={{ padding: '10px 32px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer', fontWeight: '600', opacity: isLoading ? 0.7 : 1 }}>
                                    {isLoading ? 'Creating...' : '✓ Submit Profile'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProfile;