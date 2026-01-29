import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner.jsx';

/**
 * EditProfileModal Component
 * Modal for editing profile with comprehensive form fields
 */
function EditProfileModal({ profile, onClose, onSave }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Basic Information
        name: '',
        case: '',
        guardian: '',
        placeOfBirth: '',
        dob: '',
        age: '',
        gender: '',
        maritalStatus: '',
        nationality: '',
        religion: '',
        bloodGroup: '',
        
        // Contact Information
        phone: '',
        email: '',
        whatsapp: '',
        telegram: '',
        facebook: '',
        instagram: '',
        youtube: '',
        upi: '',
        presentAddress: '',
        permanentAddress: '',
        imeiNumbers: [],
        
        // Family Information
        father: '',
        mother: '',
        brothers: '',
        sisters: '',
        uncles: '',
        aunts: '',
        wives: '',
        children: [],
        closeFriends: '',
        relativesWifeSide: '',
        relationsAbroad: '',
        relationsIndia: '',
        associatesAbroad: '',
        relativesSecurity: '',
        
        // Physical Description
        height: '',
        weight: '',
        bodyBuild: '',
        complexion: '',
        hair: '',
        eye: '',
        moustache: '',
        beard: '',
        identificationMark: '',
        dress: '',
        peculiarity: '',
        handed: '',
        physicalPeculiarity: '',
        
        // Education & Professional
        education: [],
        expertise: '',
        occupationBefore: '',
        profession: '',
        annualIncome: '',
        languagesKnown: '',
        prevOrg: '',
        presentOrg: '',
        
        // Documents & IDs
        aadhar: '',
        pan: '',
        dl: '',
        passport: '',
        voter: '',
        ration: '',
        creditCard: '',
        bankDetails: '',
        
        // Activities & Risk
        radicalizationLevel: '',
        monitoringStatus: '',
        radicalizationPotential: '',
        illegalActivities: '',
        activitiesType: '',
        whereabouts: '',
        hideouts: '',
        religiousActivities: '',
        economicStatus: '',
        mainFinancier: '',
        
        // Legal & Case Information
        casesInvolved: '',
        securityProceedings: '',
        prisonStatus: '',
        advocate: '',
        arrestDetails: '',
        jailActivities: '',
        associatesJail: '',
        interrogatedBy: '',
        
        // Location & Travel
        houseGPS: '',
        workGPS: '',
        countriesVisited: '',
        illegalCrossings: '',
        guides: '',
        properties: '',
        vehicles: '',
        hideoutPlace: '',
        
        // Additional Information
        speechStyle: '',
        mannerism: '',
        habits: '',
        video: '',
        verifiedBy: '',
        caseParticulars: '',
        fileClassification: '',
        closeAssociates: []
    });
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('basic');

    // Initialize form data when profile changes
    useEffect(() => {
        if (profile) {
            setFormData({
                // Basic Information
                name: profile.name || '',
                case: profile.case || '',
                guardian: profile.guardian || '',
                placeOfBirth: profile.placeOfBirth || '',
                dob: profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : '',
                age: profile.age || '',
                gender: profile.gender || '',
                maritalStatus: profile.maritalStatus || '',
                nationality: profile.nationality || '',
                religion: profile.religion || '',
                bloodGroup: profile.bloodGroup || '',
                
                // Contact Information
                phone: profile.phone || profile.mobile || '',
                email: profile.email || '',
                whatsapp: profile.whatsapp || '',
                telegram: profile.telegram || '',
                facebook: profile.facebook || '',
                instagram: profile.instagram || '',
                youtube: profile.youtube || '',
                upi: profile.upi || '',
                presentAddress: profile.presentAddress || profile.address || '',
                permanentAddress: profile.permanentAddress || '',
                imeiNumbers: profile.imeiNumbers || [],
                
                // Family Information
                father: profile.father || '',
                mother: profile.mother || '',
                brothers: profile.brothers || '',
                sisters: profile.sisters || '',
                uncles: profile.uncles || '',
                aunts: profile.aunts || '',
                wives: profile.wives || '',
                children: profile.children || [],
                closeFriends: profile.closeFriends || '',
                relativesWifeSide: profile.relativesWifeSide || '',
                relationsAbroad: profile.relationsAbroad || '',
                relationsIndia: profile.relationsIndia || '',
                associatesAbroad: profile.associatesAbroad || '',
                relativesSecurity: profile.relativesSecurity || '',
                
                // Physical Description
                height: profile.height || '',
                weight: profile.weight || '',
                bodyBuild: profile.bodyBuild || '',
                complexion: profile.complexion || '',
                hair: profile.hair || '',
                eye: profile.eye || '',
                moustache: profile.moustache || '',
                beard: profile.beard || '',
                identificationMark: profile.identificationMark || '',
                dress: profile.dress || '',
                peculiarity: profile.peculiarity || '',
                handed: profile.handed || '',
                physicalPeculiarity: profile.physicalPeculiarity || '',
                
                // Education & Professional
                education: profile.education || [],
                expertise: profile.expertise || '',
                occupationBefore: profile.occupationBefore || '',
                profession: profile.profession || '',
                annualIncome: profile.annualIncome || '',
                languagesKnown: profile.languagesKnown || '',
                prevOrg: profile.prevOrg || '',
                presentOrg: profile.presentOrg || '',
                
                // Documents & IDs
                aadhar: profile.aadhar || '',
                pan: profile.pan || '',
                dl: profile.dl || '',
                passport: profile.passport || '',
                voter: profile.voter || '',
                ration: profile.ration || '',
                creditCard: profile.creditCard || '',
                bankDetails: profile.bankDetails || '',
                
                // Activities & Risk
                radicalizationLevel: profile.radicalizationLevel || '',
                monitoringStatus: profile.monitoringStatus || '',
                radicalizationPotential: profile.radicalizationPotential || '',
                illegalActivities: profile.illegalActivities || '',
                activitiesType: profile.activitiesType || '',
                whereabouts: profile.whereabouts || '',
                hideouts: profile.hideouts || '',
                religiousActivities: profile.religiousActivities || '',
                economicStatus: profile.economicStatus || '',
                mainFinancier: profile.mainFinancier || '',
                
                // Legal & Case Information
                casesInvolved: profile.casesInvolved || '',
                securityProceedings: profile.securityProceedings || '',
                prisonStatus: profile.prisonStatus || '',
                advocate: profile.advocate || '',
                arrestDetails: profile.arrestDetails || '',
                jailActivities: profile.jailActivities || '',
                associatesJail: profile.associatesJail || '',
                interrogatedBy: profile.interrogatedBy || '',
                
                // Location & Travel
                houseGPS: profile.houseGPS || '',
                workGPS: profile.workGPS || '',
                countriesVisited: profile.countriesVisited || '',
                illegalCrossings: profile.illegalCrossings || '',
                guides: profile.guides || '',
                properties: profile.properties || '',
                vehicles: profile.vehicles || '',
                hideoutPlace: profile.hideoutPlace || '',
                
                // Additional Information
                speechStyle: profile.speechStyle || '',
                mannerism: profile.mannerism || '',
                habits: profile.habits || '',
                video: profile.video || '',
                verifiedBy: profile.verifiedBy || '',
                caseParticulars: profile.caseParticulars || '',
                fileClassification: profile.fileClassification || '',
                closeAssociates: profile.closeAssociates || []
            });
        }
    }, [profile]);

    if (!profile) return null;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleArrayChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field, defaultItem = '') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], defaultItem]
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.age || formData.age < 1 || formData.age > 120) newErrors.age = 'Valid age is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.radicalizationLevel) newErrors.radicalizationLevel = 'Risk level is required';
        if (!formData.monitoringStatus) newErrors.monitoringStatus = 'Monitoring status is required';
        if (!formData.fileClassification) newErrors.fileClassification = 'Classification is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Prepare the updated data with proper types
            const updatedData = {
                ...formData,
                age: parseInt(formData.age) || 0,
                dob: formData.dob ? new Date(formData.dob).toISOString() : null,
                imeiNumbers: Array.isArray(formData.imeiNumbers) ? formData.imeiNumbers.filter(item => item.trim()) : [],
                children: Array.isArray(formData.children) ? formData.children : [],
                education: Array.isArray(formData.education) ? formData.education : [],
                closeAssociates: Array.isArray(formData.closeAssociates) ? formData.closeAssociates : []
            };
            
            await onSave(profile._id, updatedData);
            onClose();
        } catch (error) {
            console.error('Error saving profile:', error);
            // Handle error (could show toast notification)
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'basic', label: '📋 Basic Info', icon: '📋' },
        { id: 'contact', label: '📞 Contact', icon: '📞' },
        { id: 'family', label: '👨‍👩‍👧‍👦 Family', icon: '👨‍👩‍👧‍👦' },
        { id: 'physical', label: '👤 Physical', icon: '👤' },
        { id: 'education', label: '🎓 Education', icon: '🎓' },
        { id: 'documents', label: '📄 Documents', icon: '📄' },
        { id: 'risk', label: '⚠️ Risk', icon: '⚠️' },
        { id: 'legal', label: '⚖️ Legal', icon: '⚖️' },
        { id: 'location', label: '📍 Location', icon: '📍' },
        { id: 'additional', label: 'ℹ️ Additional', icon: 'ℹ️' }
    ];

    const renderFormField = (label, field, type = 'text', options = null, placeholder = '', isRequired = false) => (
        <div style={{ marginBottom: '16px' }}>
            <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '6px' 
            }}>
                {label} {isRequired && <span style={{ color: '#dc2626' }}>*</span>}
            </label>
            {type === 'textarea' ? (
                <textarea
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: errors[field] ? '2px solid #dc2626' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        resize: 'vertical'
                    }}
                />
            ) : type === 'select' ? (
                <select
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: errors[field] ? '2px solid #dc2626' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                    }}
                >
                    <option value="">Select {label}</option>
                    {options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: errors[field] ? '2px solid #dc2626' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                    }}
                />
            )}
            {errors[field] && (
                <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                    {errors[field]}
                </div>
            )}
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {renderFormField('Full Name', 'name', 'text', null, 'Enter full name', true)}
                        {renderFormField('Case Number', 'case', 'text', null, 'Case #2025-001')}
                        {renderFormField('Guardian', 'guardian', 'text', null, 'Guardian name')}
                        {renderFormField('Place of Birth', 'placeOfBirth', 'text', null, 'City, State')}
                        {renderFormField('Date of Birth', 'dob', 'date', null, '', true)}
                        {renderFormField('Age', 'age', 'number', null, '0', true)}
                        {renderFormField('Gender', 'gender', 'select', ['Male', 'Female', 'Other'], '', true)}
                        {renderFormField('Marital Status', 'maritalStatus', 'select', ['Single', 'Married', 'Divorced', 'Widowed'])}
                        {renderFormField('Nationality', 'nationality', 'text', null, 'Indian')}
                        {renderFormField('Religion', 'religion', 'text', null, 'Religion')}
                        {renderFormField('Blood Group', 'bloodGroup', 'select', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])}
                        <div></div>
                    </div>
                );

            case 'contact':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {renderFormField('Phone Number', 'phone', 'tel', null, '+91-9876543210')}
                        {renderFormField('Email', 'email', 'email', null, 'email@example.com')}
                        {renderFormField('WhatsApp', 'whatsapp', 'tel', null, '+91-9876543210')}
                        {renderFormField('Telegram', 'telegram', 'text', null, '@username')}
                        {renderFormField('Facebook', 'facebook', 'text', null, 'facebook.com/username')}
                        {renderFormField('Instagram', 'instagram', 'text', null, 'instagram.com/username')}
                        {renderFormField('YouTube', 'youtube', 'text', null, 'youtube.com/channel')}
                        {renderFormField('UPI ID', 'upi', 'text', null, 'user@bank')}
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Present Address', 'presentAddress', 'textarea', null, 'Current residential address')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Permanent Address', 'permanentAddress', 'textarea', null, 'Permanent address')}
                        </div>
                    </div>
                );

            case 'family':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {renderFormField('Father', 'father', 'text', null, 'Father\'s name')}
                        {renderFormField('Mother', 'mother', 'text', null, 'Mother\'s name')}
                        {renderFormField('Brothers', 'brothers', 'text', null, 'Brother names')}
                        {renderFormField('Sisters', 'sisters', 'text', null, 'Sister names')}
                        {renderFormField('Uncles', 'uncles', 'text', null, 'Uncle names')}
                        {renderFormField('Aunts', 'aunts', 'text', null, 'Aunt names')}
                        {renderFormField('Spouse', 'wives', 'text', null, 'Spouse name')}
                        {renderFormField('Close Friends', 'closeFriends', 'text', null, 'Friend names')}
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Relatives (Wife Side)', 'relativesWifeSide', 'textarea', null, 'Relatives from spouse side')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Relations Abroad', 'relationsAbroad', 'textarea', null, 'International relations')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Relations in India', 'relationsIndia', 'textarea', null, 'Domestic relations')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Associates Abroad', 'associatesAbroad', 'textarea', null, 'International associates')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Security Relations', 'relativesSecurity', 'textarea', null, 'Relations in security forces')}
                        </div>
                    </div>
                );

            case 'physical':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {renderFormField('Height', 'height', 'text', null, '175 cm')}
                        {renderFormField('Weight', 'weight', 'text', null, '70 kg')}
                        {renderFormField('Body Build', 'bodyBuild', 'select', ['Slim', 'Average', 'Athletic', 'Heavy', 'Muscular'])}
                        {renderFormField('Complexion', 'complexion', 'select', ['Fair', 'Wheatish', 'Dark', 'Very Fair', 'Very Dark'])}
                        {renderFormField('Hair', 'hair', 'text', null, 'Black, Short')}
                        {renderFormField('Eyes', 'eye', 'select', ['Brown', 'Black', 'Blue', 'Green', 'Gray', 'Hazel'])}
                        {renderFormField('Moustache', 'moustache', 'text', null, 'Thin/Thick/None')}
                        {renderFormField('Beard', 'beard', 'text', null, 'Full/Goatee/None')}
                        {renderFormField('Handedness', 'handed', 'select', ['Right handed', 'Left handed', 'Ambidextrous'])}
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Identification Mark', 'identificationMark', 'textarea', null, 'Scars, tattoos, birthmarks')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Dress Style', 'dress', 'textarea', null, 'Usual clothing style')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Physical Peculiarity', 'physicalPeculiarity', 'textarea', null, 'Any physical peculiarities')}
                        </div>
                    </div>
                );

            case 'education':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {renderFormField('Expertise', 'expertise', 'text', null, 'Skills and expertise')}
                        {renderFormField('Previous Occupation', 'occupationBefore', 'text', null, 'Previous job')}
                        {renderFormField('Current Profession', 'profession', 'text', null, 'Current job details')}
                        {renderFormField('Annual Income', 'annualIncome', 'text', null, '₹15,00,000')}
                        {renderFormField('Previous Organization', 'prevOrg', 'text', null, 'Previous employer')}
                        {renderFormField('Current Organization', 'presentOrg', 'text', null, 'Current employer')}
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Languages Known', 'languagesKnown', 'textarea', null, 'Languages with proficiency level')}
                        </div>
                    </div>
                );

            case 'documents':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {renderFormField('Aadhar Card', 'aadhar', 'text', null, '1234-5678-9012')}
                        {renderFormField('PAN Card', 'pan', 'text', null, 'ABCDE1234F')}
                        {renderFormField('Driving License', 'dl', 'text', null, 'DL number')}
                        {renderFormField('Passport', 'passport', 'text', null, 'Passport details')}
                        {renderFormField('Voter ID', 'voter', 'text', null, 'Voter ID number')}
                        {renderFormField('Ration Card', 'ration', 'text', null, 'Ration card details')}
                        {renderFormField('Credit Card', 'creditCard', 'text', null, 'Credit card info')}
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Bank Details', 'bankDetails', 'textarea', null, 'Bank account information')}
                        </div>
                    </div>
                );

            case 'risk':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {renderFormField('Radicalization Level', 'radicalizationLevel', 'select', ['Low', 'Medium', 'High'], '', true)}
                        {renderFormField('Monitoring Status', 'monitoringStatus', 'select', ['Active Monitoring', 'Passive Monitoring', 'Under Investigation', 'Cleared'], '', true)}
                        {renderFormField('Economic Status', 'economicStatus', 'text', null, 'Financial status')}
                        {renderFormField('Main Financier', 'mainFinancier', 'text', null, 'Source of funding')}
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Radicalization Potential', 'radicalizationPotential', 'textarea', null, 'Assessment of radicalization risk')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Illegal Activities', 'illegalActivities', 'textarea', null, 'Known illegal activities')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Activities Type/Modus Operandi', 'activitiesType', 'textarea', null, 'Methods and patterns')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Current Whereabouts', 'whereabouts', 'textarea', null, 'Known locations')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Known Hideouts', 'hideouts', 'textarea', null, 'Historical hideout locations')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Religious Activities', 'religiousActivities', 'textarea', null, 'Religious involvement')}
                        </div>
                    </div>
                );

            case 'legal':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {renderFormField('Cases Involved', 'casesInvolved', 'text', null, 'Number of cases')}
                        {renderFormField('Prison Status', 'prisonStatus', 'text', null, 'Current legal status')}
                        {renderFormField('Advocate', 'advocate', 'text', null, 'Legal representative')}
                        {renderFormField('Interrogated By', 'interrogatedBy', 'text', null, 'Investigating agencies')}
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Security Proceedings', 'securityProceedings', 'textarea', null, 'Legal proceedings')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Jail Activities', 'jailActivities', 'textarea', null, 'Activities during incarceration')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Associates in Jail', 'associatesJail', 'textarea', null, 'Prison contacts')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Arrest Details', 'arrestDetails', 'textarea', null, 'Arrest information')}
                        </div>
                    </div>
                );

            case 'location':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {renderFormField('House GPS Coordinates', 'houseGPS', 'text', null, 'Latitude, Longitude')}
                        {renderFormField('Work GPS Coordinates', 'workGPS', 'text', null, 'Latitude, Longitude')}
                        {renderFormField('Countries Visited', 'countriesVisited', 'text', null, 'Travel history')}
                        {renderFormField('Illegal Border Crossings', 'illegalCrossings', 'text', null, 'Border violations')}
                        {renderFormField('Guides/Contacts', 'guides', 'text', null, 'Local contacts')}
                        {renderFormField('Vehicles', 'vehicles', 'text', null, 'Vehicle details')}
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Properties Owned', 'properties', 'textarea', null, 'Real estate holdings')}
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Hideout Places', 'hideoutPlace', 'textarea', null, 'Potential hiding locations')}
                        </div>
                    </div>
                );

            case 'additional':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {renderFormField('Speech Style', 'speechStyle', 'text', null, 'Communication patterns')}
                        {renderFormField('Mannerisms', 'mannerism', 'text', null, 'Behavioral patterns')}
                        {renderFormField('Habits', 'habits', 'text', null, 'Personal habits')}
                        {renderFormField('Video Documentation', 'video', 'text', null, 'Video evidence')}
                        {renderFormField('Verified By', 'verifiedBy', 'text', null, 'Verification officer')}
                        {renderFormField('File Classification', 'fileClassification', 'select', ['Unclassified', 'Restricted', 'Secret', 'Top Secret'], '', true)}
                        <div style={{ gridColumn: '1 / -1' }}>
                            {renderFormField('Case Particulars', 'caseParticulars', 'textarea', null, 'Detailed case information')}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

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
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Modal Header */}
                <div style={{ 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', 
                    color: '#ffffff', 
                    padding: '24px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    flexShrink: 0
                }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                            Edit Profile
                        </h2>
                        <div style={{ fontSize: '14px', opacity: '0.9' }}>
                            Profile ID: {profile.profileId} | {profile.name}
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

                {/* Tab Navigation */}
                <div style={{
                    borderBottom: '1px solid #e5e7eb',
                    padding: '0 24px',
                    flexShrink: 0,
                    overflowX: 'auto',
                    whiteSpace: 'nowrap'
                }}>
                    <div style={{ display: 'flex', gap: '8px', paddingBottom: '16px', paddingTop: '16px' }}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    padding: '8px 16px',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    background: activeTab === tab.id ? '#f59e0b' : '#f3f4f6',
                                    color: activeTab === tab.id ? '#ffffff' : '#374151',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    if (activeTab !== tab.id) {
                                        e.target.style.background = '#e5e7eb';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (activeTab !== tab.id) {
                                        e.target.style.background = '#f3f4f6';
                                    }
                                }}
                            >
                                {tab.icon} {tab.label.split(' ').slice(1).join(' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Modal Body */}
                <div style={{ 
                    padding: '32px', 
                    overflow: 'auto',
                    flex: 1
                }}>
                    {renderTabContent()}
                </div>

                {/* Modal Footer */}
                <div style={{ 
                    padding: '16px 32px', 
                    borderTop: '1px solid #e5e7eb', 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexShrink: 0,
                    background: '#f8fafc'
                }}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Tab: {tabs.find(t => t.id === activeTab)?.label}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
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
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            style={{ 
                                background: isLoading ? '#9ca3af' : '#f59e0b', 
                                color: '#ffffff', 
                                border: 'none', 
                                borderRadius: '8px', 
                                padding: '10px 24px', 
                                fontSize: '14px', 
                                fontWeight: '500', 
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {isLoading ? '⏳' : '💾'} {isLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </div>

                {/* Loading Overlay for Save Operation */}
                {isLoading && (
                    <LoadingSpinner 
                        overlay={true}
                        size="large"
                        text="Saving profile changes..."
                        color="#3b82f6"
                    />
                )}
            </div>
        </div>
    );
}

export default EditProfileModal;
