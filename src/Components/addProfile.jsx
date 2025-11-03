import React, { useState } from 'react';
import apiService from '../services/api.js';

const logoPath = '/src/images/logo.png';

function AddProfile({ onBack }) {
    // ...existing code...
    // State for dynamic lists
    const [form, setForm] = useState({
        // Basic Details
        name: 'John Doe @ Johnny',
        case: 'Case #2025-001',
        
        // Personal Information
        guardian: 'Robert Doe (Father)',
        placeOfBirth: 'Mumbai, Maharashtra',
        dob: '1990-05-15',
        gender: 'Male',
        maritalStatus: 'Married',
        phone: '+91-9876543210',
        imeiNumbers: ['123456789012345', '987654321098765'],
        
        // Family Members
        father: 'Robert Doe',
        mother: 'Mary Doe',
        brothers: 'Michael Doe (Elder), David Doe (Younger)',
        sisters: 'Sarah Doe (Elder)',
        uncles: 'Thomas Doe, William Doe',
        aunts: 'Elizabeth Doe, Catherine Doe',
        wives: 'Jane Doe',
        children: [
            { gender: 'Son', name: 'Alex Doe' },
            { gender: 'Daughter', name: 'Emma Doe' }
        ],
        closeFriends: 'Mike Johnson, Steve Wilson',
        relativesWifeSide: 'Peter Smith (Brother-in-law), Anna Smith (Sister-in-law)',
        
        // Relatives & Associates
        relationsAbroad: 'Uncle in Dubai, Cousin in USA',
        relationsIndia: 'Aunt in Delhi, Cousins in Bangalore',
        associatesAbroad: 'Business partners in Pakistan and Bangladesh',
        relativesSecurity: 'Colonel James (Army), Inspector Raj (Police)',
        
        // Background & Address
        occupationBefore: 'Software Engineer',
        presentAddress: '123 MG Road, Bandra West, Mumbai - 400050',
        permanentAddress: '456 Linking Road, Bandra West, Mumbai - 400050',
        hideouts: 'Andheri East (2018-2020), Thane West (2021-2022)',
        nationality: 'Indian',
        religion: 'Christian',
        bloodGroup: 'O+',
        education: [
            { level: '10th Standard', school: 'St. Xavier\'s High School', year: '2006' },
            { level: '12th Standard', school: 'St. Xavier\'s College', year: '2008' },
            { level: 'Bachelor of Engineering', school: 'IIT Bombay', year: '2012' }
        ],
        expertise: 'Cyber Security, Network Hacking',
        profession: 'Software Developer at TechCorp, Mumbai - Phone: +91-9876543211',
        annualIncome: '₹15,00,000',
        bankDetails: 'HDFC Bank, Bandra Branch, Account: 1234567890, IFSC: HDFC0001234',
        
        // Identity Cards
        dl: 'MH01-2020123456, Issued: Andheri RTO',
        pan: 'ABCDE1234F, Name: John Doe',
        aadhar: '1234-5678-9012, Name: John Doe',
        passport: 'P1234567, Issued: 2015, Valid till: 2025',
        voter: 'ABC1234567, Constituency: Bandra West',
        ration: 'MH/123/456789, Family of 4',
        creditCard: 'ICICI Bank, ****-****-****-1234',
        
        // Social Media IDs
        email: 'john.doe@example.com',
        whatsapp: '+91-9876543210',
        facebook: 'facebook.com/johndoe',
        instagram: 'instagram.com/john_doe_official',
        telegram: '@johndoe123',
        upi: 'johndoe@okhdfcbank',
        youtube: 'youtube.com/c/JohnDoeTech',
        
        // Physical & Facial Description
        height: '175 cm',
        weight: '70 kg',
        bodyBuild: 'Athletic',
        complexion: 'Fair',
        hair: 'Black, Short, 5 cm',
        eye: 'Brown',
        moustache: 'Thin black moustache',
        beard: 'Clean shaven',
        
        // Other Details
        languagesKnown: 'English (Read/Write/Speak), Hindi (Read/Write/Speak), Marathi (Speak)',
        identificationMark: 'Scar on left forearm, Tattoo on right shoulder',
        dress: 'Usually wears jeans and t-shirts, sometimes formal shirts',
        peculiarity: 'Walks with slight limp, speaks fast',
        handed: 'Right handed',
        physicalPeculiarity: 'Slight limp in left leg due to old injury',
        speechStyle: 'Fast speaker, uses technical jargon',
        mannerism: 'Fidgets with phone when nervous',
        habits: 'Smokes occasionally, drinks socially',
        whereabouts: 'Currently in Mumbai, frequently travels to Delhi',
        illegalActivities: 'Suspected cyber fraud, money laundering',
        activitiesType: 'MODUS OPERANDI: Uses phishing emails and fake websites',
        prevOrg: 'TechCorp Ltd, Software Developer',
        presentOrg: 'CyberTech Solutions, Senior Developer',
        religiousActivities: 'Regular church goer on Sundays',
        radicalizationPotential: 'Low - No signs of radicalization',
        economicStatus: 'Upper middle class, owns property',
        mainFinancier: 'Self-financed, some support from family',
        countriesVisited: 'USA (2018), Dubai (2019), Singapore (2022)',
        illegalCrossings: 'Crossed into Nepal via Raxaul border (2019)',
        guides: 'Local contacts in border areas',
        properties: '2 BHK apartment in Bandra (owned), Commercial property in Thane (leased)',
        vehicles: 'MH01-AB-1234 (Honda City), MH02-CD-5678 (Royal Enfield Bullet)',
        hideoutPlace: 'Rural areas in Maharashtra, Goa beaches',
        advocate: 'Advocate Ramesh Kumar, Phone: +91-9876543212',
        arrestDetails: {
            policeStation: 'Gandhipuram',
            crimeNoSecLaw: '1/2025 u/s',
            datePlaceOfArrest: 'Coimbatore',
            arrestedBy: '',
            bailOrderDate: '',
            coAccused: 'Vasu, Mani, Ravi',
            recoveries: 'Cell phones',
            category: '',
        },
        jailActivities: 'Was in Arthur Road Jail for 6 months',
        associatesJail: 'Met Raju Sharma and Vijay Patel during incarceration',
        casesInvolved: '5 cases registered',
        securityProceedings: 'Section 66A IT Act, Section 420 IPC',
        prisonStatus: 'Currently out on bail',
        interrogatedBy: 'Mumbai Police Cyber Cell, CBI',
        houseGPS: '19.0759° N, 72.8777° E, Remarks: Residential area',
        workGPS: '19.0760° N, 72.8778° E, Remarks: Commercial complex',
        closeAssociates: [
            { name: 'Mike Johnson', address: 'Andheri East, Mumbai', phone: '+91-9876543213' },
            { name: 'Steve Wilson', address: 'Bandra West, Mumbai', phone: '+91-9876543214' }
        ],
        video: '3-minute video recorded showing face and voice',
        verifiedBy: 'Inspector Rajesh Kumar',
        dateOfCreation: '2025-10-06',
        caseParticulars: 'Multiple cyber fraud cases, money laundering allegations, under surveillance since 2023'
    });
    const [files, setFiles] = useState({ front: null, back: null, side: null });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // ...existing code...
    // Helper for dynamic list changes
    const handleListChange = (field, idx, subfield, value) => {
        setForm(prev => {
            const arr = [...(prev[field] || [])];
            if (typeof arr[idx] === 'object') {
                arr[idx] = { ...arr[idx], [subfield]: value };
            } else {
                arr[idx] = value;
            }
            return { ...prev, [field]: arr };
        });
        setError('');
    };
    const addListItem = (field, emptyVal) => {
        setForm(prev => ({ ...prev, [field]: [...(prev[field] || []), emptyVal] }));
    };
    const removeListItem = (field, idx) => {
        setForm(prev => {
            const arr = [...(prev[field] || [])];
            arr.splice(idx, 1);
            return { ...prev, [field]: arr };
        });
    };

    // Reset form to empty values
    const resetForm = () => {
        setForm({
            // Basic Details
            name: '',
            case: '',
            
            // Personal Information
            guardian: '',
            placeOfBirth: '',
            dob: '',
            gender: '',
            maritalStatus: '',
            phone: '',
            imeiNumbers: [''],
            
            // Family Members
            father: '',
            mother: '',
            brothers: '',
            sisters: '',
            uncles: '',
            aunts: '',
            wives: '',
            children: [{ gender: '', name: '' }],
            closeFriends: '',
            relativesWifeSide: '',
            
            // Relatives & Associates
            relationsAbroad: '',
            relationsIndia: '',
            associatesAbroad: '',
            relativesSecurity: '',
            
            // Background & Address
            occupationBefore: '',
            presentAddress: '',
            permanentAddress: '',
            hideouts: '',
            nationality: '',
            religion: '',
            bloodGroup: '',
            education: [{ level: '', school: '', year: '' }],
            expertise: '',
            profession: '',
            annualIncome: '',
            bankDetails: '',
            
            // Identity Cards
            dl: '',
            pan: '',
            aadhar: '',
            passport: '',
            voter: '',
            ration: '',
            creditCard: '',
            
            // Social Media IDs
            email: '',
            whatsapp: '',
            facebook: '',
            instagram: '',
            telegram: '',
            upi: '',
            youtube: '',
            
            // Physical & Facial Description
            height: '',
            weight: '',
            bodyBuild: '',
            complexion: '',
            hair: '',
            eye: '',
            moustache: '',
            beard: '',
            
            // Other Details
            languagesKnown: '',
            identificationMark: '',
            dress: '',
            peculiarity: '',
            handed: '',
            physicalPeculiarity: '',
            speechStyle: '',
            mannerism: '',
            habits: '',
            whereabouts: '',
            illegalActivities: '',
            activitiesType: '',
            prevOrg: '',
            presentOrg: '',
            religiousActivities: '',
            radicalizationPotential: '',
            economicStatus: '',
            mainFinancier: '',
            countriesVisited: '',
            illegalCrossings: '',
            guides: '',
            properties: '',
            vehicles: '',
            hideoutPlace: '',
            advocate: '',
            arrestDetails: '',
            jailActivities: '',
            associatesJail: '',
            casesInvolved: '',
            securityProceedings: '',
            prisonStatus: '',
            interrogatedBy: '',
            houseGPS: '',
            workGPS: '',
            closeAssociates: [{ name: '', address: '', phone: '' }],
            video: '',
            verifiedBy: '',
            dateOfCreation: '',
            caseParticulars: ''
        });
        setFiles({ front: null, back: null, side: null });
        setError('');
        setSuccess('');
    };

    // ...existing code...
    // File change for 3 photos
    const handlePhotoChange = (view, file) => {
        setFiles(prev => ({ ...prev, [view]: file }));
    };

    // ...existing code...
    // Main handleChange for simple fields
    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        setError('');
    };

    // ...existing code...
    // Submit handler (update as needed for new structure)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            // Validate required fields (e.g. name, dob, gender, etc.)
            if (!form.name || !form.dob || !form.gender) {
                throw new Error('Name, Date of Birth, and Gender are required.');
            }
            // Call API (update as needed)
            const response = await apiService.createProfile(form, files);
            if (response.success) {
                setSuccess(`Profile created successfully! Profile ID: ${response.data?.profileId || 'N/A'}`);
                // Redirect to dashboard after 2 seconds
                setTimeout(() => { 
                    if (onBack) {
                        onBack(); // This should reload the dashboard stats
                    }
                }, 2000);
            } else {
                throw new Error(response.message || 'Failed to create profile');
            }
        } catch (error) {
            console.error('Profile creation error:', error);
            setError(error.message || 'Failed to create profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ...existing code...
    // Input styles
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

    // ...existing code...
    // Render
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f2fe 0%, #f3e5f5 100%)', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '24px', maxWidth: '1400px', margin: '0 auto 32px auto' }}>
                <img src={logoPath} alt="Logo" style={{ width: '64px', height: '64px', marginRight: '24px' }} />
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a8a', margin: 0, letterSpacing: '0.5px' }}>Add New Accused Profile</h1>
            </div>

            {/* Success/Error */}
            {success && (<div style={{ maxWidth: '1400px', margin: '0 auto 24px auto', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px 24px', color: '#166534', fontSize: '14px', fontWeight: '500' }}>✅ {success}</div>)}
            {error && (<div style={{ maxWidth: '1400px', margin: '0 auto 24px auto', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px 24px', color: '#991b1b', fontSize: '14px', fontWeight: '500' }}>❌ {error}</div>)}

            {/* Demo Notice */}
            <div style={{ maxWidth: '1400px', margin: '0 auto 24px auto', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '12px', padding: '16px 24px', color: '#92400e', fontSize: '14px', fontWeight: '500' }}>
                📝 <strong>Demo Mode:</strong> Form is pre-filled with sample data for testing. Click "🔄 Reset Form" to clear all fields. You can upload photos separately.
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px', marginBottom: '40px' }}>
                    {/* Column 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Name, Photos, Case */}
                        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e0e7ff', margin: '0 0 20px 0' }}>Basic Details</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label>1. Name @ Alias Name (Age)</label>
                                <input style={inputStyles.base} value={form.name || ''} onChange={e => handleChange('name', e.target.value)} required />
                                <label>2. Case</label>
                                <input style={inputStyles.base} value={form.case || ''} onChange={e => handleChange('case', e.target.value)} />
                                <label>Photograph (Front)</label>
                                <input type="file" accept="image/*" onChange={e => handlePhotoChange('front', e.target.files[0])} />
                                <label>Photograph (Back)</label>
                                <input type="file" accept="image/*" onChange={e => handlePhotoChange('back', e.target.files[0])} />
                                <label>Photograph (Side)</label>
                                <input type="file" accept="image/*" onChange={e => handlePhotoChange('side', e.target.files[0])} />
                            </div>
                        </div>
                        {/* Personal Information */}
                        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e0e7ff', margin: '0 0 20px 0' }}>Personal Information</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label>2. Guardian’s Name & details</label>
                                <input style={inputStyles.base} value={form.guardian || ''} onChange={e => handleChange('guardian', e.target.value)} />
                                <label>3. Place of Birth</label>
                                <input style={inputStyles.base} value={form.placeOfBirth || ''} onChange={e => handleChange('placeOfBirth', e.target.value)} />
                                <label>4. Date of Birth</label>
                                <input type="date" style={inputStyles.base} value={form.dob || ''} onChange={e => handleChange('dob', e.target.value)} required />
                                <label>5. Gender</label>
                                <select style={inputStyles.base} value={form.gender || ''} onChange={e => handleChange('gender', e.target.value)} required>
                                    <option value="">Select...</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                                <label>6. Marital status</label>
                                <input style={inputStyles.base} value={form.maritalStatus || ''} onChange={e => handleChange('maritalStatus', e.target.value)} />
                                <label>7. Phone Number</label>
                                <input style={inputStyles.base} value={form.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
                                <label>8. IMEI No</label>
                                {form.imeiNumbers.map((val, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 4 }}>
                                        <input style={{ ...inputStyles.base, flex: 1 }} value={val} onChange={e => handleListChange('imeiNumbers', idx, null, e.target.value)} />
                                        <button type="button" onClick={() => removeListItem('imeiNumbers', idx)} disabled={form.imeiNumbers.length === 1}>-</button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addListItem('imeiNumbers', '')}>Add IMEI</button>
                            </div>
                        </div>
                        {/* Family Members */}
                        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e0e7ff', margin: '0 0 20px 0' }}>Family Members</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {/* Father, Mother, Brother, Sister, Uncle, Aunt, Wife, Children, Friends, Relatives in wife side */}
                                <label>9(a). Father</label>
                                <input style={inputStyles.base} value={form.father || ''} onChange={e => handleChange('father', e.target.value)} />
                                <label>9(b). Mother</label>
                                <input style={inputStyles.base} value={form.mother || ''} onChange={e => handleChange('mother', e.target.value)} />
                                <label>9(c). Brother/Brothers</label>
                                <input style={inputStyles.base} value={form.brothers || ''} onChange={e => handleChange('brothers', e.target.value)} />
                                <label>9(d). Sister/Sisters</label>
                                <input style={inputStyles.base} value={form.sisters || ''} onChange={e => handleChange('sisters', e.target.value)} />
                                <label>9(e). Uncle/Uncles</label>
                                <input style={inputStyles.base} value={form.uncles || ''} onChange={e => handleChange('uncles', e.target.value)} />
                                <label>9(f). Aunt/Aunts</label>
                                <input style={inputStyles.base} value={form.aunts || ''} onChange={e => handleChange('aunts', e.target.value)} />
                                <label>9(g). Wife/Wives</label>
                                <input style={inputStyles.base} value={form.wives || ''} onChange={e => handleChange('wives', e.target.value)} />
                                <label>9(h). Children (Son/Daughter)</label>
                                {form.children.map((child, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 4 }}>
                                        <select style={{ ...inputStyles.base, flex: 1 }} value={child.gender} onChange={e => handleListChange('children', idx, 'gender', e.target.value)}>
                                            <option value="">Gender</option>
                                            <option>Son</option>
                                            <option>Daughter</option>
                                        </select>
                                        <input style={{ ...inputStyles.base, flex: 2 }} value={child.name} onChange={e => handleListChange('children', idx, 'name', e.target.value)} placeholder="Name" />
                                        <button type="button" onClick={() => removeListItem('children', idx)} disabled={form.children.length === 1}>-</button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addListItem('children', { gender: '', name: '' })}>Add Child</button>
                                <label>9(j). Close friends</label>
                                <input style={inputStyles.base} value={form.closeFriends || ''} onChange={e => handleChange('closeFriends', e.target.value)} />
                                <label>9(j). Relatives in wife side</label>
                                <input style={inputStyles.base} value={form.relativesWifeSide || ''} onChange={e => handleChange('relativesWifeSide', e.target.value)} />
                            </div>
                        </div>
                        {/* Relatives/Associates */}
                        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e0e7ff', margin: '0 0 20px 0' }}>Relatives & Associates</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label>10. Relations abroad</label>
                                <input style={inputStyles.base} value={form.relationsAbroad || ''} onChange={e => handleChange('relationsAbroad', e.target.value)} />
                                <label>11. Relations in India</label>
                                <input style={inputStyles.base} value={form.relationsIndia || ''} onChange={e => handleChange('relationsIndia', e.target.value)} />
                                <label>12. Associates in Pakistan/Bangladesh/Myanmar/Nepal/Abroad with Address & Phone No.</label>
                                <input style={inputStyles.base} value={form.associatesAbroad || ''} onChange={e => handleChange('associatesAbroad', e.target.value)} />
                                <label>13. Relatives in Security forces (Govt. Central and state)</label>
                                <input style={inputStyles.base} value={form.relativesSecurity || ''} onChange={e => handleChange('relativesSecurity', e.target.value)} />
                            </div>
                        </div>
                    </div>
                    {/* Column 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Occupation, Address, Stay, Nationality, Religion, Blood, Education, Expertise, Profession, Income, Bank */}
                        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e0e7ff', margin: '0 0 20px 0' }}>Background & Address</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label>14. Occupation before joining Militancy</label>
                                <input style={inputStyles.base} value={form.occupationBefore || ''} onChange={e => handleChange('occupationBefore', e.target.value)} />
                                <label>15. Present Address</label>
                                <input style={inputStyles.base} value={form.presentAddress || ''} onChange={e => handleChange('presentAddress', e.target.value)} placeholder="Present Address" />
                                <label>15. Permanent Address</label>
                                <input style={inputStyles.base} value={form.permanentAddress || ''} onChange={e => handleChange('permanentAddress', e.target.value)} placeholder="Permanent Address" />
                                <label>16. Place of stay/hideout with location details during the last 10 years</label>
                                <input style={inputStyles.base} value={form.hideouts || ''} onChange={e => handleChange('hideouts', e.target.value)} />
                                <label>17. Nationality</label>
                                <input style={inputStyles.base} value={form.nationality || ''} onChange={e => handleChange('nationality', e.target.value)} />
                                <label>18. Religion & Sub-caste</label>
                                <input style={inputStyles.base} value={form.religion || ''} onChange={e => handleChange('religion', e.target.value)} />
                                <label>19. Blood group</label>
                                <input style={inputStyles.base} value={form.bloodGroup || ''} onChange={e => handleChange('bloodGroup', e.target.value)} />
                                <label>20. Educational qualification</label>
                                {form.education.map((edu, idx) => (
                                    <input key={idx} style={inputStyles.base} value={edu.level} onChange={e => {
                                        const newArr = [...form.education];
                                        newArr[idx].level = e.target.value;
                                        setForm({ ...form, education: newArr });
                                    }} placeholder="Level" />
                                ))}
                                <label>Expertise</label>
                                <input style={inputStyles.base} value={form.expertise || ''} onChange={e => handleChange('expertise', e.target.value)} />
                                <label>Profession / Occupation/Address of work Telephone Number</label>
                                <input style={inputStyles.base} value={form.profession || ''} onChange={e => handleChange('profession', e.target.value)} />
                                <label>Annual Income</label>
                                <input style={inputStyles.base} value={form.annualIncome || ''} onChange={e => handleChange('annualIncome', e.target.value)} />
                                <label>Bank Name, Branch & Account details</label>
                                <input style={inputStyles.base} value={form.bankDetails || ''} onChange={e => handleChange('bankDetails', e.target.value)} />
                            </div>
                        </div>
                        {/* Identity Cards */}
                        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e0e7ff', margin: '0 0 20px 0' }}>Identity Cards</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label>25A. Driving License No. / Place of issue</label>
                                <input style={inputStyles.base} value={form.dl || ''} onChange={e => handleChange('dl', e.target.value)} />
                                <label>25B. PAN Number & Name details</label>
                                <input style={inputStyles.base} value={form.pan || ''} onChange={e => handleChange('pan', e.target.value)} />
                                <label>25C. Aadhar Number & Name details</label>
                                <input style={inputStyles.base} value={form.aadhar || ''} onChange={e => handleChange('aadhar', e.target.value)} />
                                <label>25D. Passport Number / Issued & Validity date</label>
                                <input style={inputStyles.base} value={form.passport || ''} onChange={e => handleChange('passport', e.target.value)} />
                                <label>25E. Voter Id Number & Name details</label>
                                <input style={inputStyles.base} value={form.voter || ''} onChange={e => handleChange('voter', e.target.value)} />
                                <label>25F. Ration Card details</label>
                                <input style={inputStyles.base} value={form.ration || ''} onChange={e => handleChange('ration', e.target.value)} />
                                <label>25G. Credit Card</label>
                                <input style={inputStyles.base} value={form.creditCard || ''} onChange={e => handleChange('creditCard', e.target.value)} />
                            </div>
                        </div>
                        {/* Social Media IDs */}
                        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e0e7ff', margin: '0 0 20px 0' }}>Social Media IDs</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label>26A. E-mail Id</label>
                                <input style={inputStyles.base} value={form.email || ''} onChange={e => handleChange('email', e.target.value)} />
                                <label>26B. WhatsApp No.</label>
                                <input style={inputStyles.base} value={form.whatsapp || ''} onChange={e => handleChange('whatsapp', e.target.value)} />
                                <label>26C. Facebook Id</label>
                                <input style={inputStyles.base} value={form.facebook || ''} onChange={e => handleChange('facebook', e.target.value)} />
                                <label>26D. Instagram Id</label>
                                <input style={inputStyles.base} value={form.instagram || ''} onChange={e => handleChange('instagram', e.target.value)} />
                                <label>26E. Telegram Id</label>
                                <input style={inputStyles.base} value={form.telegram || ''} onChange={e => handleChange('telegram', e.target.value)} />
                                <label>26F. UPI Id & Number</label>
                                <input style={inputStyles.base} value={form.upi || ''} onChange={e => handleChange('upi', e.target.value)} />
                                <label>26G. Youtube</label>
                                <input style={inputStyles.base} value={form.youtube || ''} onChange={e => handleChange('youtube', e.target.value)} />
                            </div>
                        </div>
                        {/* Physical & Facial Description */}
                        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e0e7ff', margin: '0 0 20px 0' }}>Physical & Facial Description</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label>27A. Height (CM's)</label>
                                <input style={inputStyles.base} value={form.height || ''} onChange={e => handleChange('height', e.target.value)} />
                                <label>27B. Weight (KG's)</label>
                                <input style={inputStyles.base} value={form.weight || ''} onChange={e => handleChange('weight', e.target.value)} />
                                <label>27C. Body Build</label>
                                <input style={inputStyles.base} value={form.bodyBuild || ''} onChange={e => handleChange('bodyBuild', e.target.value)} />
                                <label>27D. Colour Complexion</label>
                                <input style={inputStyles.base} value={form.complexion || ''} onChange={e => handleChange('complexion', e.target.value)} />
                                <label>27E. Hair Colour & length (CM's)</label>
                                <input style={inputStyles.base} value={form.hair || ''} onChange={e => handleChange('hair', e.target.value)} />
                                <label>27F. Eye Colour</label>
                                <input style={inputStyles.base} value={form.eye || ''} onChange={e => handleChange('eye', e.target.value)} />
                                <label>28G. Moustache</label>
                                <input style={inputStyles.base} value={form.moustache || ''} onChange={e => handleChange('moustache', e.target.value)} />
                                <label>28H. Beard</label>
                                <input style={inputStyles.base} value={form.beard || ''} onChange={e => handleChange('beard', e.target.value)} />
                            </div>
                        </div>
                    </div>
                    {/* Column 3 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Languages, Identification, Dress, Peculiarities, Habits, Whereabouts, Activities, Properties, Vehicles, Hideouts, Advocate, Arrest, Jail, Cases, Security, Prison, Interrogation, GPS, Associates, Video, Verified, Date, Case Particulars */}
                        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e40af', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e0e7ff', margin: '0 0 20px 0' }}>Other Details</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label>29. Languages Known</label>
                                <input style={inputStyles.base} value={form.languagesKnown || ''} onChange={e => handleChange('languagesKnown', e.target.value)} />
                                <label>30. Identification Mark</label>
                                <input style={inputStyles.base} value={form.identificationMark || ''} onChange={e => handleChange('identificationMark', e.target.value)} />
                                <label>31. Dress</label>
                                <input style={inputStyles.base} value={form.dress || ''} onChange={e => handleChange('dress', e.target.value)} />
                                <label>32. Any Specific features/signature mark/Peculiarity</label>
                                <input style={inputStyles.base} value={form.peculiarity || ''} onChange={e => handleChange('peculiarity', e.target.value)} />
                                <label>33. Left handed /Right handed</label>
                                <input style={inputStyles.base} value={form.handed || ''} onChange={e => handleChange('handed', e.target.value)} />
                                <label>34. Specific Physical Peculiarities</label>
                                <input style={inputStyles.base} value={form.physicalPeculiarity || ''} onChange={e => handleChange('physicalPeculiarity', e.target.value)} />
                                <label>35. Style of Speech</label>
                                <input style={inputStyles.base} value={form.speechStyle || ''} onChange={e => handleChange('speechStyle', e.target.value)} />
                                <label>36. Mannerism</label>
                                <input style={inputStyles.base} value={form.mannerism || ''} onChange={e => handleChange('mannerism', e.target.value)} />
                                <label>37. Habits (Drinking/Smoking/Tobacco/etc..)</label>
                                <input style={inputStyles.base} value={form.habits || ''} onChange={e => handleChange('habits', e.target.value)} />
                                <label>38. Current where abouts</label>
                                <input style={inputStyles.base} value={form.whereabouts || ''} onChange={e => handleChange('whereabouts', e.target.value)} />
                                <label>39. Illegal activities if any</label>
                                <input style={inputStyles.base} value={form.illegalActivities || ''} onChange={e => handleChange('illegalActivities', e.target.value)} />
                                <label>40. Type of activities / M.O</label>
                                <input style={inputStyles.base} value={form.activitiesType || ''} onChange={e => handleChange('activitiesType', e.target.value)} />
                                <label>41. Previous Organization Name & Post</label>
                                <input style={inputStyles.base} value={form.prevOrg || ''} onChange={e => handleChange('prevOrg', e.target.value)} />
                                <label>42. Present Organization Name & Post</label>
                                <input style={inputStyles.base} value={form.presentOrg || ''} onChange={e => handleChange('presentOrg', e.target.value)} />
                                <label>43. Participation in religious activities (Mosque/Madrassa/ArabicCollege/Church/Temple, etc..)</label>
                                <input style={inputStyles.base} value={form.religiousActivities || ''} onChange={e => handleChange('religiousActivities', e.target.value)} />
                                <label>44. Whether potential to get radicalized / radicalize others?</label>
                                <input style={inputStyles.base} value={form.radicalizationPotential || ''} onChange={e => handleChange('radicalizationPotential', e.target.value)} />
                                <label>45. Economic status and source of funds</label>
                                <input style={inputStyles.base} value={form.economicStatus || ''} onChange={e => handleChange('economicStatus', e.target.value)} />
                                <label>46. Main Financier(s)</label>
                                <input style={inputStyles.base} value={form.mainFinancier || ''} onChange={e => handleChange('mainFinancier', e.target.value)} />
                                <label>47. Countries Visited, Period & Purpose</label>
                                <input style={inputStyles.base} value={form.countriesVisited || ''} onChange={e => handleChange('countriesVisited', e.target.value)} />
                                <label>48. Details of Illegal border crossings with routes adopted</label>
                                <input style={inputStyles.base} value={form.illegalCrossings || ''} onChange={e => handleChange('illegalCrossings', e.target.value)} />
                                <label>49. Guides/intermediate places of stay used during such crossing with location details</label>
                                <input style={inputStyles.base} value={form.guides || ''} onChange={e => handleChange('guides', e.target.value)} />
                                <label>50. Properties details (Movable/Immovable)</label>
                                <input style={inputStyles.base} value={form.properties || ''} onChange={e => handleChange('properties', e.target.value)} />
                                <label>50C. Vehicle details with Reg.No</label>
                                <input style={inputStyles.base} value={form.vehicles || ''} onChange={e => handleChange('vehicles', e.target.value)} />
                                <label>51. Hide out Place</label>
                                <input style={inputStyles.base} value={form.hideoutPlace || ''} onChange={e => handleChange('hideoutPlace', e.target.value)} />
                                <label>53. Name of Advocate & Phone Number</label>
                                <input style={inputStyles.base} value={form.advocate || ''} onChange={e => handleChange('advocate', e.target.value)} />
                                <div style={{ margin: '24px 0', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>54. Last/Previous/Recent Arrest Details</h3>
                                    <label>54A. Police Station</label>
                                    <input style={inputStyles.base} value={form.arrestDetails.policeStation} onChange={e => setForm(f => ({ ...f, arrestDetails: { ...f.arrestDetails, policeStation: e.target.value } }))} />
                                    <label>54B. Crime No. & Sec of Law</label>
                                    <input style={inputStyles.base} value={form.arrestDetails.crimeNoSecLaw} onChange={e => setForm(f => ({ ...f, arrestDetails: { ...f.arrestDetails, crimeNoSecLaw: e.target.value } }))} />
                                    <label>54C. Date & Place of arrest</label>
                                    <input style={inputStyles.base} value={form.arrestDetails.datePlaceOfArrest} onChange={e => setForm(f => ({ ...f, arrestDetails: { ...f.arrestDetails, datePlaceOfArrest: e.target.value } }))} />
                                    <label>54D. Arrested by</label>
                                    <input style={inputStyles.base} value={form.arrestDetails.arrestedBy} onChange={e => setForm(f => ({ ...f, arrestDetails: { ...f.arrestDetails, arrestedBy: e.target.value } }))} />
                                    <label>54E. Bail order & Date</label>
                                    <input style={inputStyles.base} value={form.arrestDetails.bailOrderDate} onChange={e => setForm(f => ({ ...f, arrestDetails: { ...f.arrestDetails, bailOrderDate: e.target.value } }))} />
                                    <label>55F. Co-Accused (if Any)</label>
                                    <input style={inputStyles.base} value={form.arrestDetails.coAccused} onChange={e => setForm(f => ({ ...f, arrestDetails: { ...f.arrestDetails, coAccused: e.target.value } }))} />
                                    <label>54G. Recoveries</label>
                                    <input style={inputStyles.base} value={form.arrestDetails.recoveries} onChange={e => setForm(f => ({ ...f, arrestDetails: { ...f.arrestDetails, recoveries: e.target.value } }))} />
                                    <label>54H. Category <span style={{ fontSize: '12px', color: '#6b7280' }}>(Militants/smuggler/border crosser/courier/sawari/drug peddler/fake currency racketeer etc.)</span></label>
                                    <input style={inputStyles.base} value={form.arrestDetails.category} onChange={e => setForm(f => ({ ...f, arrestDetails: { ...f.arrestDetails, category: e.target.value } }))} />
                                </div>
                                <label>56. Activities in jail</label>
                                <input style={inputStyles.base} value={form.jailActivities || ''} onChange={e => handleChange('jailActivities', e.target.value)} />
                                <label>57. Associates in jail</label>
                                <input style={inputStyles.base} value={form.associatesJail || ''} onChange={e => handleChange('associatesJail', e.target.value)} />
                                <label>58. Total No. of Cases Involved</label>
                                <input style={inputStyles.base} value={form.casesInvolved || ''} onChange={e => handleChange('casesInvolved', e.target.value)} />
                                <label>59. Security Proceedings details</label>
                                <input style={inputStyles.base} value={form.securityProceedings || ''} onChange={e => handleChange('securityProceedings', e.target.value)} />
                                <label>60. Whether accused presently inside Prison or Out of prison?</label>
                                <input style={inputStyles.base} value={form.prisonStatus || ''} onChange={e => handleChange('prisonStatus', e.target.value)} />
                                <label>61. Previously Interrogated by which agencies?</label>
                                <input style={inputStyles.base} value={form.interrogatedBy || ''} onChange={e => handleChange('interrogatedBy', e.target.value)} />
                                <label>62. Photograph & GPS location of the House with remarks</label>
                                <input style={inputStyles.base} value={form.houseGPS || ''} onChange={e => handleChange('houseGPS', e.target.value)} />
                                <label>63. Photograph & GPS location of the Workplace with remarks</label>
                                <input style={inputStyles.base} value={form.workGPS || ''} onChange={e => handleChange('workGPS', e.target.value)} />
                                <label>64. Close Associates with Phone Number</label>
                                {form.closeAssociates.map((a, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 4 }}>
                                        <input style={{ ...inputStyles.base, flex: 2 }} value={a.name} onChange={e => handleListChange('closeAssociates', idx, 'name', e.target.value)} placeholder="Name" />
                                        <input style={{ ...inputStyles.base, flex: 3 }} value={a.address} onChange={e => handleListChange('closeAssociates', idx, 'address', e.target.value)} placeholder="Address" />
                                        <input style={{ ...inputStyles.base, flex: 2 }} value={a.phone} onChange={e => handleListChange('closeAssociates', idx, 'phone', e.target.value)} placeholder="Phone" />
                                        <button type="button" onClick={() => removeListItem('closeAssociates', idx)} disabled={form.closeAssociates.length === 1}>-</button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addListItem('closeAssociates', { name: '', address: '', phone: '' })}>Add Associate</button>
                                <label>65. A Small video to be taken (3 min, certified by interrogator)</label>
                                <input style={inputStyles.base} value={form.video || ''} onChange={e => handleChange('video', e.target.value)} />
                                <label>66. Verified by</label>
                                <input style={inputStyles.base} value={form.verifiedBy || ''} onChange={e => handleChange('verifiedBy', e.target.value)} />
                                <label>67. Date of Creation</label>
                                <input type="date" style={inputStyles.base} value={form.dateOfCreation || ''} onChange={e => handleChange('dateOfCreation', e.target.value)} />
                                <label>Case Particulars and Stage of the Cases</label>
                                <textarea style={inputStyles.base} value={form.caseParticulars || ''} onChange={e => handleChange('caseParticulars', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <button type="button" onClick={onBack} style={{ padding: '12px 32px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={e => e.target.style.backgroundColor = '#e5e7eb'} onMouseOut={e => e.target.style.backgroundColor = '#f3f4f6'}>← Back</button>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={resetForm} style={{ padding: '12px 24px', backgroundColor: '#f59e0b', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseOver={e => e.target.style.backgroundColor = '#d97706'} onMouseOut={e => e.target.style.backgroundColor = '#f59e0b'}>🔄 Reset Form</button>
                        <button type="submit" disabled={isLoading} style={{ padding: '12px 32px', background: isLoading ? '#9ca3af' : 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '500', cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', boxShadow: isLoading ? 'none' : '0 4px 12px rgba(79, 70, 229, 0.3)', opacity: isLoading ? 0.7 : 1 }} onMouseOver={e => !isLoading && (e.target.style.transform = 'translateY(-2px)')} onMouseOut={e => !isLoading && (e.target.style.transform = 'translateY(0px)')}>{isLoading ? 'Creating Profile...' : 'Add Profile →'}</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddProfile;