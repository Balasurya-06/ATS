const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

// All 70 fields mapping from dossier
const DOSSIER_FIELDS = [
    { num: '1', field: 'Name & Alias & Age', key: 'nameAliasAge' },
    { num: '2', field: "Guardian's Name & Details", key: 'guardian' },
    { num: '3', field: 'Place & Date of Birth', key: 'placeOfBirth' },
    { num: '4', field: 'Gender & Marital Status', key: 'genderMaritalStatus' },
    { num: '5', field: 'Phone Number', key: 'phone' },
    { num: '6', field: 'Details of Close Family Members', key: 'familyDetails' },
    { num: '7', field: 'Relations Abroad', key: 'relationsAbroad' },
    { num: '8', field: 'Relations in India', key: 'relationsIndia' },
    { num: '9', field: 'Associates Abroad', key: 'associatesAbroad' },
    { num: '10', field: 'Relatives in Security Forces/Govt', key: 'relativesSecurity' },
    { num: '11', field: 'Occupation Before Joining Militancy', key: 'occupationBefore' },
    { num: '12', field: 'Residential Address', key: 'address' },
    { num: '13', field: 'House Owner Details (if rented)', key: 'houseOwner' },
    { num: '14', field: 'Place of Stay/Hideout (Last 10 Years)', key: 'hideouts' },
    { num: '15', field: 'Nationality', key: 'nationality' },
    { num: '16', field: 'Religion & Sub-caste', key: 'religion' },
    { num: '17', field: 'Blood Group', key: 'bloodGroup' },
    { num: '18', field: 'Educational Qualification', key: 'education' },
    { num: '19', field: 'Education Levels (1st-5th, 6th-10th, 11th-12th, Degree)', key: 'educationLevels' },
    { num: '20', field: 'Expertise', key: 'expertise' },
    { num: '21', field: 'Profession/Occupation', key: 'profession' },
    { num: '22', field: 'Annual Income', key: 'annualIncome' },
    { num: '23', field: 'Bank Details', key: 'bankDetails' },
    { num: '24', field: 'Identity Card Details', key: 'identityCards' },
    { num: '25', field: 'Social Media ID Details', key: 'socialMedia' },
    { num: '26', field: 'Physical & Facial Description', key: 'physicalDescription' },
    { num: '27', field: 'Languages Known (Read, Write, Speak)', key: 'languages' },
    { num: '28', field: 'Identification Mark', key: 'identificationMark' },
    { num: '29', field: 'Dress', key: 'dress' },
    { num: '30', field: 'Specific Features/Signature Mark', key: 'specificFeatures' },
    { num: '31', field: 'Handed (Left/Right/Ambidextrous)', key: 'handed' },
    { num: '32', field: 'Specific Physical Peculiarities', key: 'physicalPeculiarities' },
    { num: '33', field: 'Style of Speech', key: 'speechStyle' },
    { num: '34', field: 'Mannerism', key: 'mannerism' },
    { num: '35', field: 'Habits (Drinking/Smoking/Tobacco etc)', key: 'habits' },
    { num: '36', field: 'Current Whereabouts', key: 'whereabouts' },
    { num: '37', field: 'Illegal Activities if any', key: 'illegalActivities' },
    { num: '38', field: 'Type of Activities / M.O', key: 'activitiesType' },
    { num: '39', field: 'Previous Organization Name & Post', key: 'prevOrganization' },
    { num: '40', field: 'Present Organization Name & Post', key: 'presentOrganization' },
    { num: '41', field: 'Participation in Religious Activities', key: 'religiousActivities' },
    { num: '42', field: 'Potential to Get Radicalized', key: 'radicalizationPotential' },
    { num: '43', field: 'Economic Status & Source of Funds', key: 'economicStatus' },
    { num: '44', field: 'Main Financier(s)', key: 'mainFinancier' },
    { num: '45', field: 'Countries Visited, Period & Purpose', key: 'countriesVisited' },
    { num: '46', field: 'Details of Illegal Border Crossings', key: 'illegalCrossings' },
    { num: '47', field: 'Guides/Intermediate Places During Crossing', key: 'guides' },
    { num: '48', field: 'Properties Details (Movable, Immovable, Vehicles)', key: 'properties' },
    { num: '49', field: 'Hide out Place', key: 'hideoutPlace' },
    { num: '50', field: 'Fingerprint Attached', key: 'fingerPrintAttached' },
    { num: '51', field: "Name of Advocate & Phone Number", key: 'advocate' },
    { num: '52', field: 'Last/Recent Arrest Details', key: 'arrestDetails' },
    { num: '53', field: 'Arrest Categories (Militants/Smuggler/etc)', key: 'arrestCategory' },
    { num: '54', field: 'Prison Details (Duration)', key: 'prisonDetails' },
    { num: '55', field: 'Activities in Jail', key: 'jailActivities' },
    { num: '56', field: 'Associates in Jail', key: 'associatesJail' },
    { num: '57', field: 'LOC/RCN/Blacklist Initiated', key: 'locRcnBlacklist' },
    { num: '58', field: 'Total No. of Cases (UI, PT, Conviction, Acquittal)', key: 'casesInvolved' },
    { num: '59', field: 'Security Proceedings Details', key: 'securityProceedings' },
    { num: '60', field: 'Inside/Out of Prison', key: 'prisonStatus' },
    { num: '61', field: 'Previously Interrogated by Agencies', key: 'interrogatedBy' },
    { num: '62', field: 'House GPS Location & Remarks', key: 'houseGPS' },
    { num: '63', field: 'Workplace GPS Location & Remarks', key: 'workplaceGPS' },
    { num: '64', field: 'Close Associates with Phone Number', key: 'closeAssociates' },
    { num: '65', field: '3 Minute Video (Talk, Walk, Gestures, Expressions)', key: 'video' },
    { num: '66', field: 'History Sheet/Profile No & Maintaining Unit', key: 'historySheet' },
    { num: '67', field: "Reason(s) for Opening Profile", key: 'reasonForProfile' },
    { num: '68', field: 'Verified By', key: 'verifiedBy' },
    { num: '69', field: 'Date of Creation', key: 'dateOfCreation' },
    { num: '70', field: 'Case Particulars & Stage', key: 'caseParticulars' }
];

const formatAddress = (addr) => {
    if (!addr) return '';
    return [addr.doorNo, addr.streetName, addr.villageWard, addr.district, addr.statePinCode, addr.policeStation].filter(Boolean).join(', ');
};

const formatValue = (value) => {
    if (!value) return '';
    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            return value.map(v => typeof v === 'object' ? Object.values(v).filter(Boolean).join(' - ') : v).join('; ');
        }
        return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('; ');
    }
    return String(value);
};

const getDossierData = (profile) => {
    const data = {};
    
    data.nameAliasAge = `${profile.name || ''}${profile.alias ? ' (' + profile.alias + ')' : ''} (Age: ${profile.dob ? Math.floor((new Date() - new Date(profile.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : ''})`;
    data.guardian = profile.guardian || '';
    data.placeOfBirth = `${profile.placeOfBirth || ''} | DOB: ${profile.dob ? new Date(profile.dob).toLocaleDateString('en-IN') : ''}`;
    data.genderMaritalStatus = `${profile.gender || ''} | ${profile.maritalStatus || ''}`;
    data.phone = profile.phone || '';
    
    // Family Details
    const familyParts = [];
    if (profile.family?.father) familyParts.push(`Father: ${profile.family.father}`);
    if (profile.family?.mother) familyParts.push(`Mother: ${profile.family.mother}`);
    if (profile.family?.brothers) familyParts.push(`Brothers: ${profile.family.brothers}`);
    if (profile.family?.sisters) familyParts.push(`Sisters: ${profile.family.sisters}`);
    if (profile.family?.uncles) familyParts.push(`Uncles: ${profile.family.uncles}`);
    if (profile.family?.aunts) familyParts.push(`Aunts: ${profile.family.aunts}`);
    if (profile.family?.wives) familyParts.push(`Wives: ${profile.family.wives}`);
    if (profile.family?.children?.length) familyParts.push(`Children: ${profile.family.children.map(c => `${c.name} (${c.type})`).join(', ')}`);
    if (profile.family?.closeFriends) familyParts.push(`Close Friends: ${profile.family.closeFriends}`);
    if (profile.family?.relativesWifeSide?.fatherInLaw) familyParts.push(`FIL: ${profile.family.relativesWifeSide.fatherInLaw}`);
    if (profile.family?.relativesWifeSide?.motherInLaw) familyParts.push(`MIL: ${profile.family.relativesWifeSide.motherInLaw}`);
    data.familyDetails = familyParts.join(' | ');
    
    data.relationsAbroad = profile.relationsAbroad || '';
    data.relationsIndia = profile.relationsIndia || '';
    data.associatesAbroad = profile.associatesAbroad || '';
    data.relativesSecurity = profile.relativesSecurity || '';
    data.occupationBefore = profile.occupationBefore || '';
    
    // Address
    const addressParts = [];
    if (profile.address?.present) addressParts.push(`Present: ${formatAddress(profile.address.present)}`);
    if (profile.address?.permanent) addressParts.push(`Permanent: ${formatAddress(profile.address.permanent)}`);
    data.address = addressParts.join(' | ');
    
    data.houseOwner = ''; // Not in current schema
    data.hideouts = profile.hideouts || '';
    data.nationality = profile.nationality || '';
    data.religion = profile.religion || '';
    data.bloodGroup = profile.bloodGroup || '';
    
    // Education
    data.education = profile.education?.map(e => `${e.level || ''} (${e.schoolCollege || ''}) - ${e.year || ''}`).join('; ') || '';
    data.educationLevels = profile.education?.map(e => e.level).join(', ') || '';
    
    data.expertise = profile.expertise || '';
    data.profession = profile.profession || '';
    data.annualIncome = profile.annualIncome || '';
    
    // Bank Details
    const bankParts = [];
    if (profile.bankDetails?.bankName) bankParts.push(`Bank: ${profile.bankDetails.bankName}`);
    if (profile.bankDetails?.accountNo) bankParts.push(`Account: ${profile.bankDetails.accountNo}`);
    if (profile.bankDetails?.ifscCode) bankParts.push(`IFSC: ${profile.bankDetails.ifscCode}`);
    if (profile.bankDetails?.branch) bankParts.push(`Branch: ${profile.bankDetails.branch}`);
    data.bankDetails = bankParts.join(' | ');
    
    // Identity Cards
    const idParts = [];
    if (profile.identityCards?.drivingLicense) idParts.push(`DL: ${profile.identityCards.drivingLicense}`);
    if (profile.identityCards?.pan) idParts.push(`PAN: ${profile.identityCards.pan}`);
    if (profile.identityCards?.aadhar) idParts.push(`Aadhar: ${profile.identityCards.aadhar}`);
    if (profile.identityCards?.passport) idParts.push(`Passport: ${profile.identityCards.passport}`);
    if (profile.identityCards?.voterId) idParts.push(`Voter ID: ${profile.identityCards.voterId}`);
    if (profile.identityCards?.rationCard) idParts.push(`Ration: ${profile.identityCards.rationCard}`);
    if (profile.identityCards?.creditCard) idParts.push(`Credit: ${profile.identityCards.creditCard}`);
    data.identityCards = idParts.join(' | ');
    
    // Social Media
    const socialParts = [];
    if (profile.socialMedia?.email) socialParts.push(`Email: ${profile.socialMedia.email}`);
    if (profile.socialMedia?.whatsapp) socialParts.push(`WhatsApp: ${profile.socialMedia.whatsapp}`);
    if (profile.socialMedia?.facebook) socialParts.push(`Facebook: ${profile.socialMedia.facebook}`);
    if (profile.socialMedia?.instagram) socialParts.push(`Instagram: ${profile.socialMedia.instagram}`);
    if (profile.socialMedia?.telegram) socialParts.push(`Telegram: ${profile.socialMedia.telegram}`);
    if (profile.socialMedia?.upi) socialParts.push(`UPI: ${profile.socialMedia.upi}`);
    if (profile.socialMedia?.youtube) socialParts.push(`YouTube: ${profile.socialMedia.youtube}`);
    data.socialMedia = socialParts.join(' | ');
    
    // Physical Description
    const physParts = [];
    if (profile.physicalDescription?.height) physParts.push(`Height: ${profile.physicalDescription.height}`);
    if (profile.physicalDescription?.weight) physParts.push(`Weight: ${profile.physicalDescription.weight}`);
    if (profile.physicalDescription?.bodyBuild) physParts.push(`Build: ${profile.physicalDescription.bodyBuild}`);
    if (profile.physicalDescription?.complexion) physParts.push(`Complexion: ${profile.physicalDescription.complexion}`);
    if (profile.physicalDescription?.hairColor) physParts.push(`Hair: ${profile.physicalDescription.hairColor}`);
    if (profile.physicalDescription?.eyeColor) physParts.push(`Eyes: ${profile.physicalDescription.eyeColor}`);
    if (profile.physicalDescription?.moustache) physParts.push(`Moustache: ${profile.physicalDescription.moustache}`);
    if (profile.physicalDescription?.beard) physParts.push(`Beard: ${profile.physicalDescription.beard}`);
    data.physicalDescription = physParts.join(' | ');
    
    // Languages
    data.languages = profile.languages?.map(l => `${l.language} (R:${l.read ? 'Y' : 'N'} W:${l.write ? 'Y' : 'N'} S:${l.speak ? 'Y' : 'N'})`).join('; ') || '';
    
    data.identificationMark = profile.identificationMark || '';
    data.dress = profile.dress || '';
    data.specificFeatures = profile.specificFeatures || '';
    data.handed = profile.handed || '';
    data.physicalPeculiarities = profile.physicalPeculiarities || '';
    data.speechStyle = profile.speechStyle || '';
    data.mannerism = profile.mannerism || '';
    data.habits = profile.habits || '';
    data.whereabouts = profile.whereabouts || '';
    data.illegalActivities = profile.illegalActivities || '';
    data.activitiesType = profile.activitiesType || '';
    data.prevOrganization = profile.prevOrganization || '';
    data.presentOrganization = profile.presentOrganization || '';
    data.religiousActivities = profile.religiousActivities || '';
    data.radicalizationPotential = profile.radicalizationPotential || '';
    data.economicStatus = profile.economicStatus || '';
    data.mainFinancier = profile.mainFinancier || '';
    data.countriesVisited = profile.countriesVisited || '';
    data.illegalCrossings = profile.illegalCrossings || '';
    data.guides = profile.guides || '';
    
    // Properties
    const propParts = [];
    if (profile.properties?.movable) propParts.push(`Movable: ${profile.properties.movable}`);
    if (profile.properties?.immovable) propParts.push(`Immovable: ${profile.properties.immovable}`);
    if (profile.properties?.vehicles) propParts.push(`Vehicles: ${profile.properties.vehicles}`);
    data.properties = propParts.join(' | ');
    
    data.hideoutPlace = profile.hideoutPlace || '';
    data.fingerPrintAttached = profile.fingerPrintAttached || '';
    data.advocate = profile.advocate ? `${profile.advocate.name} (${profile.advocate.phone})` : '';
    
    // Arrest Details
    const arrestParts = [];
    if (profile.arrestDetails?.policeStation) arrestParts.push(`PS: ${profile.arrestDetails.policeStation}`);
    if (profile.arrestDetails?.crimeNoAndSec) arrestParts.push(`Crime: ${profile.arrestDetails.crimeNoAndSec}`);
    if (profile.arrestDetails?.datePlace) arrestParts.push(`Date/Place: ${profile.arrestDetails.datePlace}`);
    if (profile.arrestDetails?.arrestedBy) arrestParts.push(`By: ${profile.arrestDetails.arrestedBy}`);
    if (profile.arrestDetails?.bailOrder) arrestParts.push(`Bail: ${profile.arrestDetails.bailOrder}`);
    if (profile.arrestDetails?.coAccused) arrestParts.push(`Co-Accused: ${profile.arrestDetails.coAccused}`);
    if (profile.arrestDetails?.recoveries) arrestParts.push(`Recoveries: ${profile.arrestDetails.recoveries}`);
    data.arrestDetails = arrestParts.join(' | ');
    
    data.arrestCategory = profile.arrestDetails?.category || '';
    data.prisonDetails = ''; // Not in current schema
    data.jailActivities = profile.jailActivities || '';
    data.associatesJail = profile.associatesJail || '';
    data.locRcnBlacklist = ''; // Not in current schema
    
    // Cases
    const casesParts = [];
    if (profile.casesInvolved?.ui) casesParts.push(`UI: ${profile.casesInvolved.ui}`);
    if (profile.casesInvolved?.pt) casesParts.push(`PT: ${profile.casesInvolved.pt}`);
    if (profile.casesInvolved?.conviction) casesParts.push(`Conviction: ${profile.casesInvolved.conviction}`);
    if (profile.casesInvolved?.acquittal) casesParts.push(`Acquittal: ${profile.casesInvolved.acquittal}`);
    data.casesInvolved = casesParts.join(' | ');
    
    data.securityProceedings = profile.securityProceedings || '';
    data.prisonStatus = profile.prisonStatus || '';
    data.interrogatedBy = profile.interrogatedBy || '';
    data.houseGPS = profile.houseGPS?.gpsLocation ? `${profile.houseGPS.gpsLocation}${profile.houseGPS.remarks ? ' (' + profile.houseGPS.remarks + ')' : ''}` : '';
    data.workplaceGPS = profile.workplaceGPS?.gpsLocation ? `${profile.workplaceGPS.gpsLocation}${profile.workplaceGPS.remarks ? ' (' + profile.workplaceGPS.remarks + ')' : ''}` : '';
    
    // Close Associates
    data.closeAssociates = profile.closeAssociates?.map(a => `${a.name} (${a.address}, ${a.phone})`).join('; ') || '';
    
    data.video = profile.video ? 'Available' : '';
    data.historySheet = ''; // Not in current schema
    data.reasonForProfile = ''; // Not in current schema
    data.verifiedBy = profile.verifiedBy || '';
    data.dateOfCreation = profile.dateOfCreation ? new Date(profile.dateOfCreation).toLocaleDateString('en-IN') : new Date(profile.createdAt).toLocaleDateString('en-IN');
    
    // Case Particulars
    data.caseParticulars = profile.caseParticulars?.map((cp, i) => {
        const parts = [];
        if (cp.district) parts.push(`District: ${cp.district}`);
        if (cp.policeStation) parts.push(`PS: ${cp.policeStation}`);
        if (cp.crimeNo) parts.push(`Crime: ${cp.crimeNo}`);
        if (cp.section) parts.push(`Sec: ${cp.section}`);
        if (cp.investigationAgency) parts.push(`Agency: ${cp.investigationAgency}`);
        if (cp.courtName) parts.push(`Court: ${cp.courtName}`);
        if (cp.caseNo) parts.push(`Case No: ${cp.caseNo}`);
        if (cp.caseStatus) parts.push(`Status: ${cp.caseStatus}`);
        return `Case ${i + 1}: ${parts.join(' | ')}`;
    }).join('; ') || '';
    
    return data;
};

const generateDossierPDF = (profile) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ bufferPages: true, margin: 40 });
            const chunks = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(chunks);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);

            const dossierData = getDossierData(profile);

            // Header
            doc.fontSize(18).font('Helvetica-Bold').text('ATS COIMBATORE, TAMILNADU', { align: 'center' });
            doc.fontSize(16).text('DOSSIER - PART-I', { align: 'center' });
            doc.fontSize(11).text(`Profile ID: ${profile.profileId}`, { align: 'center' });
            doc.fontSize(11).text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' });
            doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
            doc.moveDown(0.5);

            // Main content in two columns for efficient space usage
            let pageNumber = 1;
            const fieldsPerPage = 12;

            DOSSIER_FIELDS.forEach((fieldInfo, idx) => {
                const value = dossierData[fieldInfo.key] || '';

                // Check if we need a new page
                if (idx > 0 && idx % fieldsPerPage === 0) {
                    doc.addPage();
                    pageNumber++;
                }

                // Field number and name
                const fieldY = doc.y;
                doc.fontSize(10).font('Helvetica-Bold').text(`${fieldInfo.num}. ${fieldInfo.field}:`, { width: 200 });
                
                // Value
                doc.fontSize(9).font('Helvetica').text(value || '[Not Available]', {
                    width: 480,
                    align: 'left',
                    lineGap: 2
                });

                doc.moveDown(0.3);

                // Check height to avoid overflow
                if (doc.y > 720) {
                    doc.addPage();
                    pageNumber++;
                }
            });

            // Footer on each page
            const pages = doc.bufferedPageRange().count;
            for (let i = 0; i < pages; i++) {
                doc.switchToPage(i);
                doc.fontSize(8).text(`Page ${i + 1} of ${pages}`, 50, 750, { align: 'center' });
            }

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    generateDossierPDF,
    DOSSIER_FIELDS
};
