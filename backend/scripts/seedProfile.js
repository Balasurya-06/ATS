require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const Linkage = require('../models/Linkage');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME || 'accust_db'
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Profile data for Shajahan
const shajahanProfile = {
    // Basic Details
    name: "Shajahan",
    alias: "31 years",
    case: "ISIS Sympathizer",
    
    // Personal Information
    guardian: "S/o Abdul Jabbar",
    placeOfBirth: "Coimbatore",
    dob: new Date("1993-11-20"),
    gender: "Male",
    maritalStatus: "Married",
    phone: "6380033537",
    imeiNumbers: ["862024050265591", "860041059175714"],
    
    // Family Members
    family: {
        father: "Abdul Jabbar",
        mother: "Thajnisa",
        wives: "Shahanas",
        children: [
            { type: "Son", name: "Rayyan shati - 18.11.2022 (2yrs)" },
            { type: "Daughter", name: "Ritwan shati - 28.09.2024 (11 month)" }
        ],
        brothers: "Tharik Anwar (34) - Shoe shop, Mochi, Thiruppur old busstand; Thasin Abdullah (24) - Metro shoe shop, Prozone mall, saravanampatti, cbe",
        sisters: "Sitharama ryam (26) - House wife; Shameemaparveen (24) - House wife"
    },
    
    // Address
    address: {
        present: {
            doorNo: "1 A",
            streetName: "Reshma Garden, Anbu Nagar last",
            villageWard: "South Ukkadam",
            district: "Coimbatore",
            statePinCode: "Tamilnadu - 641001",
            policeStation: "Ukkadam PS"
        },
        permanent: {
            doorNo: "1 A",
            streetName: "Reshma Garden, Anbu Nagar last",
            villageWard: "South Ukkadam",
            district: "Coimbatore",
            statePinCode: "Tamilnadu - 641001",
            policeStation: "Ukkadam PS"
        }
    },
    
    // Nationality, Religion, Education
    nationality: "Indian",
    religion: "Muslim - Labbai",
    education: [
        {
            level: "1st to 10th Standard",
            schoolCollege: "Manbul ul ulum Hr. sec. School, Kottaimedu, coimbatore",
            year: "1999-2009"
        },
        {
            level: "11th to 12th Standard",
            schoolCollege: "CSI Boys school, Town hall, cbe",
            year: "2009-2011"
        },
        {
            level: "B.sc. Computer science",
            schoolCollege: "Kongunad Arts & Science college, cbe",
            year: "2014"
        }
    ],
    
    // Profession & Finance
    profession: "IT company - PHD Programmer",
    annualIncome: "Rs.4,03,000/-",
    bankDetails: {
        bankName: "SBI Bank",
        accountNo: "20328923597",
        branch: "Oppanakara street, Cbe"
    },
    
    // Identity Cards
    identityCards: {
        drivingLicense: "TN6620160002199, Coimbatore",
        pan: "HANPS7989J",
        aadhar: "3897 7449 6941",
        voterId: "RIV2201339",
        rationCard: "NPHH333683064223 (Abdul jabbar)"
    },
    
    // Social Media IDs
    socialMedia: {
        email: "shajahan619@yahoo.in, shajahancbe0@gmail.com",
        whatsapp: "63800 33537",
        facebook: "https://www.facebook.com/100000699934113",
        instagram: "shajahan_me",
        telegram: "63800 33537",
        upi: "shajahan619@oksbi"
    },
    
    // Physical & Facial Description
    physicalDescription: {
        height: "5.7 feet",
        weight: "55 Kg",
        bodyBuild: "Normal",
        complexion: "Fair",
        hairColor: "Black",
        eyeColor: "Black",
        moustache: "shaved",
        beard: "thin"
    },
    
    // Languages Known
    languages: [
        { language: "Tamil", read: true, write: true, speak: true },
        { language: "English", read: true, write: true, speak: true },
        { language: "Urdhu", read: false, write: false, speak: false },
        { language: "Arabic", read: true, write: true, speak: true }
    ],
    
    // Identification & Behavior
    identificationMark: "A Black mole on the forehead, A black mole on the right ear",
    physicalPeculiarities: "Spectacles",
    speechStyle: "Normal",
    mannerism: "Normal",
    
    // Activities & Organization
    whereabouts: "Coimbatore",
    activitiesType: "Regarding suicide attacks on temples and public gathering places",
    prevOrganization: "Student Islamic organization - member",
    presentOrganization: "Student Islamic organization - member",
    religiousActivities: "Muluk mosque, Anbu nagar, cbe (Imam: Nowfil)",
    
    // Properties
    properties: {
        movable: "Yes",
        vehicles: "TN 39 M 5158 Bajaj pulsar"
    },
    
    // Legal
    advocate: {
        name: "Tr. Kalaiarasan",
        phone: "9965532711"
    },
    
    // Arrest Details
    arrestDetails: {
        policeStation: "Podanur PS",
        crimeNoAndSec: "Coimbatore City - D3 Podanur PS Cr.No.499/2019 u/s 18, 38, 39 of UAPA Act, 1967, SC.No.188/19",
        datePlace: "July/2019",
        bailOrder: "19.07.2020",
        coAccused: "Mohamed Hussain, Sheik Safiyullah"
    },
    
    // Cases Involved
    casesInvolved: {
        pt: "1"
    },
    
    // Security Proceedings
    securityProceedings: "B1 Bazaar 2023",
    prisonStatus: "Out of prison",
    interrogatedBy: "Podanur PS",
    
    // GPS & Photos
    houseGPS: {
        gpsLocation: "Lat 10.98286, Long 76.974719",
        remarks: "Residential location"
    },
    workplaceGPS: {
        remarks: "Work from home"
    },
    
    // Close Associates
    closeAssociates: [
        {
            name: "Mohammed Hussain",
            address: "Housing unit, Ukkadam",
            phone: "7539927197"
        },
        {
            name: "Sheik Saffiullah",
            address: "Kuniamuthur",
            phone: "9025347243"
        }
    ],
    
    // Verification
    verifiedBy: "Inspr. Tr.T.Jothi, HC 1606 Tr.Vimal kumar",
    dateOfCreation: new Date("2025-06-21"),
    
    // Case Particulars
    caseParticulars: [
        {
            district: "Coimbatore",
            policeStation: "Podanur PS",
            crimeNo: "499/19",
            section: "18, 38, 39 of UAPA Act, 1967",
            investigationAgency: "Podanur PS",
            courtName: "PDJ Court, Cbe",
            caseNo: "SC.No.188/19",
            caseStatus: "PT",
            remarks: "PW1 & PW2"
        }
    ],
    
    // Risk Classification
    radicalizationLevel: "High",
    threatCategory: "Attacker",
    monitoringStatus: "Active Monitoring",
    fileClassification: "Top Secret",
    
    // AI Analysis
    suspicionScore: 95,
    isSuspicious: true,
    suspicionReasons: [
        "ISIS Sympathizer",
        "UAPA Act charges",
        "Suicide attack planning on temples and public gathering places",
        "Multiple associates with similar charges"
    ],
    
    // System fields
    createdBy: "system",
    tags: ["ISIS", "UAPA", "Terrorism", "Radicalization", "High Risk"]
};

// Profile data for Sheik Shaffiullah
const shaffiullahProfile = {
    // Basic Details
    name: "Sheik Shaffiullah",
    alias: "41 years",
    case: "ISIS Sympathizer",
    
    // Personal Information
    guardian: "S/o. Yakoob.K.A",
    placeOfBirth: "Coimbatore",
    dob: new Date("1983-07-25"),
    gender: "Male",
    maritalStatus: "Married",
    phone: "9025347243",
    imeiNumbers: ["861743040764550", "861743040764568"],
    
    // Family Members
    family: {
        father: "Yakoob.K.A (75)",
        mother: "Rashidha (63)",
        wives: "Sabeena (31)",
        children: [
            { type: "Son", name: "Sheik Ahamed Yasin - 29.09.2012 (13 yrs)" },
            { type: "Daughter", name: "Yumna fathima - 21.07.2019 (6)" }
        ],
        brothers: "Sheik Abdulla - Sunday Market shop (Remanded along with Azarudeen in 2016 and in 2022 Car Cylinder Blast Case); Sheik Hidayathullah; Sheik Arifulla - Real Estate and Cloth business",
        sisters: "Mushpira Bhanu, W/o Abdul Malik - Karumbukadai, cbe",
        closeFriends: "Basheer - 9345994350, Hassain Peer - 9787336555, Riyas - 9087184117, Abbas - 8144181921, Afsal - 8220899517, Jafar - 9551465339, Rafi - 8438388846, Farook - 9047865864"
    },
    
    // Address
    address: {
        present: {
            doorNo: "24/10",
            streetName: "Muthusamy Servai street, Kavery Nagar",
            villageWard: "Kuniyamuthur",
            district: "Coimbatore",
            statePinCode: "Tamil Nadu - 641008",
            policeStation: "Kuniyamuthur PS"
        },
        permanent: {
            doorNo: "24/10",
            streetName: "Muthusamy Servai street, Kavery Nagar",
            villageWard: "Kuniyamuthur",
            district: "Coimbatore",
            statePinCode: "Tamil Nadu - 641008",
            policeStation: "Kuniyamuthur PS"
        }
    },
    
    // Nationality, Religion, Education
    nationality: "Indian",
    religion: "Muslim - Ravuthar",
    education: [
        {
            level: "1st to 12th Standard",
            schoolCollege: "CSI Boys Higher Secondary School, V.H.Road, Coimbatore",
            year: "2000"
        }
    ],
    
    // Profession & Finance
    profession: "Medical Representative at IPCA (Interpace web) Laboratories Company, Mumbai",
    annualIncome: "Rs.3,20,000/-",
    bankDetails: {
        bankName: "Canara Bank, TMB Bank, YES Bank",
        accountNo: "1206101043824 (Canara), 460100050302049 (TMB), 114991900002712 (YES)",
        branch: "Oppanakkara Branch, Kuniyamuthur Branch, SB colony"
    },
    
    // Identity Cards
    identityCards: {
        drivingLicense: "TN99 20150008233",
        pan: "CZEPS8682P",
        aadhar: "9653 7400 0554",
        voterId: "RIV3635570",
        rationCard: "NPHH333221489525 (Sheik shafiullah)",
        creditCard: "Indane gas - CS1442232"
    },
    
    // Social Media IDs
    socialMedia: {
        email: "shaffiullahshiek@gmail.com",
        whatsapp: "9025347243",
        facebook: "டம்மி பீஸ் - https://www.facebook.com/profile.php?id=100016911193533&mibextid=ZbWKwL",
        instagram: "dammy_piece - https://www.instagram.com/dammy_piece?igsh=b2t5cnQ5cWxseHVx",
        telegram: "9025347243",
        upi: "sheiekshaffiullah-1@okaxis (yes bank), sheiekshaffiullah-3@okaxis (TMB), sheiekshaffiullah-4@okaxis (Canara)"
    },
    
    // Physical & Facial Description
    physicalDescription: {
        height: "163 cm",
        weight: "45 Kgs",
        bodyBuild: "Lean",
        complexion: "Dark",
        hairColor: "Black",
        eyeColor: "Normal",
        moustache: "Handle bar",
        beard: "Thin"
    },
    
    // Languages Known
    languages: [
        { language: "Tamil", read: true, write: true, speak: true },
        { language: "English", read: true, write: true, speak: true },
        { language: "Urdhu", read: true, write: true, speak: true },
        { language: "Arabic", read: true, write: true, speak: true }
    ],
    
    // Identification & Behavior
    identificationMark: "A black mole on the Left-hand forearm near wrist, A black mole on the Right-hand Index finger",
    
    // Activities & Organization
    whereabouts: "Medical Representative at Coimbatore in IPCA Laboratories Company, Mumbai",
    activitiesType: "Regarding suicide attacks on temples and public gathering places",
    prevOrganization: "Previously was member in PFI (2004-2007) Wahadet Islami Hind (Sunday Class 2012-2014), IYA (Islamic youth Association) - member",
    presentOrganization: "Nil",
    religiousActivities: "Sunnath Jamath Mosque near NehadiMandhi, Kuniyamuthur; Occasionally visit TNTJ and JAQ Pallivasal, near his home; Burhan Pallivasal at kuniamuthur, Cbe",
    radicalizationPotential: "Self Radicalized - To establish Islamic rule and Shaheed",
    hideouts: "Visited Hyderabad, Bangalore Vadodhara, Tirupathi, Lona walla, etc., for company official meeting, remaining time was in Coimbatore",
    
    // Properties
    properties: {
        immovable: "Rental house",
        vehicles: "TN-66-K-5092 (Two wheeler)"
    },
    
    // Legal
    advocate: {
        name: "Tr. Kalaiyarasan",
        phone: "9965532711"
    },
    
    // Arrest Details
    arrestDetails: {
        policeStation: "Coimbatore City - D3 Podanur PS",
        crimeNoAndSec: "Cr.No.499/2019 u/s 18, 38, 39 of UAPA Act, 1967 (in regarding Confession of Shajahan and Hussain regarding the Srilankan Bomb Blast led to arrest of him)",
        datePlace: "13-06-2019, Naniyar Nagar, Saramedu, Karumbukkadai Podanur",
        bailOrder: "PDSJ, Court",
        coAccused: "Shajahan and Hussain"
    },
    
    // Cases Involved
    casesInvolved: {
        pt: "1",
        ui: "1"
    },
    
    // Prison Status
    prisonStatus: "Out of prison",
    interrogatedBy: "Podanur PS",
    
    // GPS & Photos
    houseGPS: {
        gpsLocation: "Lat 10.965302866368264, Long 76.95175459534933",
        remarks: "Residential location"
    },
    workplaceGPS: {
        remarks: "IPCA Laboratories Company, Mumbai (Head Quarters)"
    },
    
    // Close Associates
    closeAssociates: [
        {
            name: "Shajahan",
            address: "D.No.1 A, Reshma Garden, Anubu Nagar last, South Ukkadam, Coimbatore – 641001",
            phone: "6380033537"
        },
        {
            name: "Hussain",
            address: "Q1, Housing unit, Ward no.82, Coimbatore",
            phone: "7539927197"
        }
    ],
    
    // Verification
    verifiedBy: "Inspr. Tr. T.Jothi, HC 1606 Tr. Vimal Kumar",
    dateOfCreation: new Date("2025-06-19"),
    
    // Case Particulars
    caseParticulars: [
        {
            district: "Coimbatore",
            policeStation: "D3 Podanur PS",
            crimeNo: "499/2019",
            section: "18, 38, 39 of UAPA Act, 1967",
            investigationAgency: "Podanur PS",
            courtName: "PDJ Court, Cbe",
            caseNo: "SC.No.188/19",
            caseStatus: "PT",
            remarks: "PW1 & PW2 - Confession of Shajahan and Hussain regarding the Srilankan Bomb Blast"
        },
        {
            district: "Coimbatore",
            policeStation: "Kuniamuthur PS",
            crimeNo: "392/2024",
            section: "113 (3) BNS",
            investigationAgency: "Kuniamuthur PS",
            courtName: "-",
            caseNo: "-",
            caseStatus: "UI",
            remarks: ""
        }
    ],
    
    // Risk Classification
    radicalizationLevel: "High",
    threatCategory: "Attacker",
    monitoringStatus: "Active Monitoring",
    fileClassification: "Top Secret",
    
    // AI Analysis
    suspicionScore: 93,
    isSuspicious: true,
    suspicionReasons: [
        "ISIS Sympathizer",
        "UAPA Act charges",
        "Suicide attack planning on temples and public gathering places",
        "Former PFI member",
        "Self radicalized - to establish Islamic rule",
        "Multiple associates with terrorism charges",
        "Brother involved in cylinder blast case"
    ],
    
    // System fields
    createdBy: "system",
    tags: ["ISIS", "UAPA", "Terrorism", "PFI", "Radicalization", "High Risk", "Self Radicalized"]
};

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');
        
        // Connect to database
        await connectDB();
        
        // Clear all existing data
        console.log('🗑️  Clearing existing data...');
        await Profile.deleteMany({});
        console.log('✅ Profiles cleared');
        
        await ActivityLog.deleteMany({});
        console.log('✅ Activity logs cleared');
        
        await Linkage.deleteMany({});
        console.log('✅ Linkages cleared\n');
        
        // Seed the profiles
        console.log('📝 Creating profiles...\n');
        
        // Create Shajahan profile
        console.log('1️⃣  Creating Shajahan profile...');
        const profile1 = await Profile.create(shajahanProfile);
        console.log(`   ✅ Profile ID: ${profile1.profileId}`);
        console.log(`   Name: ${profile1.name}`);
        console.log(`   Age: ${profile1.age} years`);
        console.log(`   Risk Level: ${profile1.radicalizationLevel}`);
        console.log(`   Suspicion Score: ${profile1.suspicionScore}%\n`);
        
        // Create Shaffiullah profile
        console.log('2️⃣  Creating Sheik Shaffiullah profile...');
        const profile2 = await Profile.create(shaffiullahProfile);
        console.log(`   ✅ Profile ID: ${profile2.profileId}`);
        console.log(`   Name: ${profile2.name}`);
        console.log(`   Age: ${profile2.age} years`);
        console.log(`   Risk Level: ${profile2.radicalizationLevel}`);
        console.log(`   Suspicion Score: ${profile2.suspicionScore}%\n`);
        
        console.log('✨ Database seeding completed successfully!');
        console.log('📊 Summary:');
        console.log(`   - Total Profiles: 2`);
        console.log(`   - Active Monitoring: 2`);
        console.log(`   - High Risk: 2`);
        console.log(`   - Co-accused linkages detected\n`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
