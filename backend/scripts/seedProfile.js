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

// Profile data for Asiq @ Karikkadai Asiq
const asiqProfile = {
    // Basic Details
    name: "Asiq",
    alias: "Karikkadai Asiq (31/25)",
    case: "B3 Variety Hall Road PS Cr.No.977/2018 Case Accused",
    
    // Personal Information
    guardian: "S/o. Abdul Rahman",
    placeOfBirth: "Coonoor, The Nilgiris",
    dob: new Date("1994-01-02"),
    gender: "Male",
    maritalStatus: "Married",
    phone: "9790415311, 7092211198",
    
    // Family Members
    family: {
        father: "Abdul Rahman",
        mother: "Faridha Banu",
        wives: "Gowsiya Banu",
        wives_phone: "8220115899",
        brothers: "Sarughan",
        sisters: "Ammu"
    },
    
    // Address
    address: {
        present: {
            doorNo: "15",
            streetName: "Ganguvar Lane",
            villageWard: "Sundaram Street, RS Puram",
            district: "Coimbatore",
            statePinCode: "Tamil Nadu-641002",
            policeStation: "B2 RS Puram PS"
        },
        permanent: {
            doorNo: "47/5",
            streetName: "NH Road, Thirumal Street",
            villageWard: "Marakadai",
            district: "Coimbatore",
            statePinCode: "Tamil Nadu-641001",
            policeStation: "B1 Bazaar PS"
        }
    },
    
    // Nationality, Religion, Education
    nationality: "Indian",
    religion: "Muslim / Pattani",
    education: [
        {
            level: "1st to 10th Standard",
            schoolCollege: "Rahamania Majeeth, Bangalore",
            year: "2009",
            remarks: "10th fail"
        }
    ],
    
    // Profession & Finance
    profession: "Mutton shop worker",
    prevEmployer: "Mutton shop at Marakadai, Shop owner – Bazeem Ahamed",
    annualIncome: "Approximately Rs.1,50,000/-",
    bankDetails: {
        bankName: "Lakshmi vilas Bank",
        branch: "Oppanakara street, Cbe"
    },
    
    // Identity Cards
    identityCards: {
        drivingLicense: "-",
        pan: "-",
        aadhar: "-",
        passport: "-",
        voterId: "-",
        rationCard: "-"
    },
    
    // Social Media IDs
    socialMedia: {
        email: "-",
        whatsapp: "-",
        facebook: "Ashiq ashiq",
        instagram: "-",
        telegram: "-",
        upi: "-"
    },
    
    // Physical & Facial Description
    physicalDescription: {
        height: "175 Cm",
        weight: "58 Kg",
        bodyBuild: "Normal",
        complexion: "Black",
        hairColor: "Black",
        eyeColor: "Black colour",
        moustache: "Black",
        beard: "Shaved"
    },
    
    // Languages Known
    languages: [
        { language: "Tamil", read: true, write: true, speak: true },
        { language: "English", read: false, write: false, speak: false },
        { language: "Urdhu", read: false, write: false, speak: false }
    ],
    
    // Identification & Behavior
    identificationMark: "A scar mark on his left hand wrist, A scar mark on his left huckle",
    physicalPeculiarities: "-",
    speechStyle: "-",
    mannerism: "-",
    habits: "Smoker",
    
    // Activities & Organization
    whereabouts: "-",
    activitiesType: "-",
    prevOrganization: "-",
    presentOrganization: "-",
    
    // Properties
    properties: {
        movable: "TN 66 R 9708 Honda dio",
        vehicles: "TN 66 R 9708 Honda dio"
    },
    
    // Legal
    advocate: {
        name: "Ahamed Sherif"
    },
    
    // Arrest Details
    arrestDetails: {
        policeStation: "B3 Variety Hall Road PS & E2 PS",
        crimeNoAndSec: "1) Cr.No.977/2018 u/s 143, 120(b) IPC., & 15, 16, 18, 20 & 38 (ii) of Unlawful Activities (Prevention) Act 1967 (Arjun sampath attempt murder case) – Case transferred to NIA R.C.No.33/18. 2) E2 Peelamedu PS.Cr.No.1794/2017 u/s Girl missing, 7 r/w 8 POSCO Act dated. 19.12.2017",
        coAccused: "Ismail, Samsudeen, Salaudeen, Mohammed sahul hameed, Auto faizal"
    },
    
    // Cases Involved
    casesInvolved: {
        pt: "1"
    },
    
    // Security Proceedings
    prisonStatus: "Interned in Central Prison, Trichy",
    interrogatedBy: "NIA",
    houseGPS: {
        remarks: "Residential location"
    },
    
    // Close Associates
    closeAssociates: [
        {
            name: "Auto Faizal",
            age: "25",
            address: "Reshma Garden, GM Nagar, South Ukkadam, Coimbatore",
            phone: "7418392934, 9442011702"
        },
        {
            name: "Mohammed Shahul Hameed @ Anwar",
            age: "25",
            address: "Currently living in Bangalore",
            phone: "8451880707, 8124826453"
        }
    ],
    
    // Verification
    verifiedBy: "SSI. Tr. Velumani",
    dateOfCreation: new Date("2025-07-31"),
    
    // Case Particulars
    caseParticulars: [
        {
            district: "Coimbatore",
            policeStation: "B3 Variety Hall Road PS",
            crimeNo: "977/2018",
            section: "143, 120(b) IPC., & 15, 16, 18, 20 & 38 (ii) of UAPA Act 1967",
            investigationAgency: "NIA",
            caseStatus: "PT"
        }
    ],
    
    // Risk Classification
    radicalizationLevel: "High",
    threatCategory: "Attacker",
    monitoringStatus: "Active Monitoring",
    fileClassification: "Confidential",
    
    // AI Analysis
    suspicionScore: 92,
    isSuspicious: true,
    suspicionReasons: [
        "UAPA Act charges",
        "NIA case transferred",
        "POSCO Act charges",
        "Multiple associates with terrorism charges"
    ],
    
    // System fields
    createdBy: "system",
    tags: ["UAPA", "NIA", "Terrorism", "Incarcerated", "High Risk"]
};

// Profile data for Ismail
const ismailProfile = {
    // Basic Details
    name: "Ismail",
    alias: "31/25 years",
    case: "B3 Variety Hall Road PS Cr.No.977/2018 Case Accused",
    
    // Personal Information
    guardian: "S/o.Sulthan",
    placeOfBirth: "Tiruppathur",
    dob: new Date("1993-12-06"),
    gender: "Male",
    maritalStatus: "Married",
    phone: "8925017227",
    
    // Family Members
    family: {
        father: "Sulthan",
        mother: "Rahmath Beevi",
        wives: "Mamtha Kulkarni",
        brothers: "Jaheer Hussain (Elder Brother), Sadham Hussain (Younger brother)"
    },
    
    // Address
    address: {
        present: {
            doorNo: "32",
            streetName: "R.S. Pillai street",
            villageWard: "Tindivanam",
            district: "Villupuram",
            statePinCode: "Tamil Nadu 604001",
            policeStation: "604001"
        },
        permanent: {
            doorNo: "32",
            streetName: "R.S. Pillai street",
            villageWard: "Tindivanam",
            district: "Villupuram",
            statePinCode: "Tamil Nadu 604001",
            policeStation: "604001"
        }
    },
    
    // Nationality, Religion, Education
    nationality: "Indian",
    religion: "Muslim / Lebbai",
    education: [
        {
            level: "1st to 5th Standard",
            schoolCollege: "Kusalsan higher secondary school",
            year: "2003"
        },
        {
            level: "6th to 10th",
            schoolCollege: "Maragathambigai higher secondary school",
            year: "2008"
        }
    ],
    
    // Profession & Finance
    profession: "Iron scrap business",
    annualIncome: "Approximately Rs.2,50,000/-",
    
    // Identity Cards
    identityCards: {
        drivingLicense: "-",
        pan: "-",
        aadhar: "4339 6308 9067",
        passport: "-",
        voterId: "-",
        rationCard: "-"
    },
    
    // Social Media IDs
    socialMedia: {
        email: "-",
        whatsapp: "8925017227",
        facebook: "-",
        instagram: "-",
        telegram: "8925017227",
        upi: "-"
    },
    
    // Physical & Facial Description
    physicalDescription: {
        height: "164 Cm",
        weight: "55 Kg",
        bodyBuild: "Lean Body",
        complexion: "Black",
        hairColor: "White",
        eyeColor: "Black colour",
        moustache: "Black",
        beard: "Black"
    },
    
    // Languages Known
    languages: [
        { language: "Tamil", read: true, write: true, speak: true },
        { language: "English", read: false, write: false, speak: false },
        { language: "Urdhu", read: false, write: false, speak: false }
    ],
    
    // Identification & Behavior
    identificationMark: "A Black mole on his under right eye, A black mole on his under right knee",
    physicalPeculiarities: "-",
    speechStyle: "-",
    mannerism: "-",
    
    // Activities & Organization
    whereabouts: "-",
    activitiesType: "-",
    prevOrganization: "TNTJ",
    presentOrganization: "Nil",
    
    // Legal
    advocate: { name: "-" },
    
    // Arrest Details
    arrestDetails: {
        policeStation: "B3 Variety Hall Road PS",
        crimeNoAndSec: "Cr.No.977/2018 u/s 143, 120(b) IPC., & 15, 16, 18, 20 & 38 (ii) of Unlawful Activities (Prevention) Act 1967 – PT (Arjun sampath attempt to murder case) Case transfer to NIA R.C.No.33/18"
    },
    
    // Cases Involved
    casesInvolved: {
        pt: "1"
    },
    
    // Security Proceedings
    prisonStatus: "Out of prison",
    houseGPS: { remarks: "-" },
    
    // Close Associates
    closeAssociates: [
        {
            name: "Jaffar Sadiq Ali",
            address: "Viyasarpadi, Chennai -39",
            phone: "6374627669"
        },
        {
            name: "Samsudeen @ Samsu",
            address: "No.1, 2nd street, Ponni nagar, bammal, Pallavaram, Chennai",
            phone: "8122410557"
        },
        {
            name: "Mohammed Salauddin",
            address: "Dhasamakkan, Perambur",
            phone: "9884069088"
        }
    ],
    
    // Verification
    verifiedBy: "SSI. Tr. Velumani",
    dateOfCreation: new Date("2025-08-04"),
    
    // Case Particulars
    caseParticulars: [
        {
            district: "Coimbatore",
            policeStation: "B3 Variety Hall Road PS",
            crimeNo: "977/2018",
            section: "143, 120(b) IPC., & 15, 16, 18, 20 & 38 (ii) of UAPA Act 1967",
            caseStatus: "PT"
        }
    ],
    
    // Risk Classification
    radicalizationLevel: "High",
    threatCategory: "Attacker",
    monitoringStatus: "Active Monitoring",
    fileClassification: "Confidential",
    
    // AI Analysis
    suspicionScore: 88,
    isSuspicious: true,
    suspicionReasons: [
        "UAPA Act charges",
        "Associate with known terror suspects",
        "Previous TNTJ member"
    ],
    
    // System fields
    createdBy: "system",
    tags: ["UAPA", "Terrorism", "TNTJ", "High Risk"]
};

// Profile data for Mohammed Hussain
const mohammedHussainProfile = {
    // Basic Details
    name: "Mohammed Hussain",
    alias: "ISIS Sympathizer (31)",
    case: "Podanur PS Cr.No.499/2019 - UAPA Act",
    
    // Personal Information
    guardian: "S/o Ayyubkhan",
    placeOfBirth: "Coimbatore",
    dob: new Date("1994-07-21"),
    gender: "Male",
    maritalStatus: "Married",
    phone: "7539927197",
    imeiNumbers: ["867707050593138", "867707050593120"],
    
    // Family Members
    family: {
        father: "Ayyubkhan",
        father_age: "74",
        father_occupation: "Treasury (Rtd)",
        mother: "Saleema beevi",
        mother_age: "58",
        wives: "Rumana Parveen",
        wives_age: "24",
        children: [{ type: "Son", name: "Nabyan", dob: "16.07.22", age: "3 yrs" }],
        brothers: "Jaffer ali (44) Labour ACC cement Factory, Kaleel rahman (32) Labour Asian Belt Center"
    },
    
    // Address
    address: {
        present: {
            doorNo: "Q1",
            streetName: "Housing unit",
            villageWard: "Ward no.82",
            district: "Coimbatore",
            statePinCode: "Tamil Nadu - 641001",
            policeStation: "Ukkadam PS"
        },
        permanent: {
            doorNo: "Q1",
            streetName: "Housing unit",
            villageWard: "Ward no.82",
            district: "Coimbatore",
            statePinCode: "Tamil Nadu - 641001",
            policeStation: "Ukkadam PS"
        }
    },
    
    // Nationality, Religion, Education
    nationality: "Indian",
    religion: "Muslim Labbai",
    education: [
        {
            level: "1st to 12th Standard",
            schoolCollege: "Manbaul uloom Higher secondary school",
            year: "2011"
        },
        {
            level: "B.Sc. Zoology",
            schoolCollege: "Kongunadu, Arts & Science college, cbe",
            year: "2014"
        }
    ],
    
    // Profession & Finance
    profession: "Medical Representative",
    employer: "Medlay Pharmaceuticals Ltd, Sri Rathna Agencies at No.36, Oppanakara St., Town Hall, Coimbatore, Tamil Nadu 641001",
    employerPhone: "07947108634",
    annualIncome: "Rs.2,88,000/-",
    bankDetails: {
        bankName: "Yes Bank",
        accountNo: "073091900007115",
        branch: "Ramanathapuram, Cbe"
    },
    
    // Identity Cards
    identityCards: {
        drivingLicense: "TN 66 20130064107, Cbe North, Coimbatore",
        pan: "CGLPM1218B",
        aadhar: "6088 5752 7986",
        voterId: "ROG2908846",
        rationCard: "13/G/0262346",
        lpgConnection: "In the name of his father"
    },
    
    // Social Media IDs
    socialMedia: {
        email: "mhdhussain753@gmail.com",
        whatsapp: "7539927197",
        facebook: "-",
        instagram: "-",
        telegram: "7539927197",
        upi: "mhdhussain753@ybl"
    },
    
    // Physical & Facial Description
    physicalDescription: {
        height: "173 Cm",
        weight: "97 Kg",
        bodyBuild: "Well build",
        complexion: "Black",
        hairColor: "Black",
        eyeColor: "Black",
        moustache: "Handle bar",
        beard: "Thin"
    },
    
    // Languages Known
    languages: [
        { language: "Tamil", read: true, write: true, speak: true },
        { language: "English", read: true, write: true, speak: true },
        { language: "Urdhu", read: false, write: false, speak: false },
        { language: "Arabic", read: true, write: false, speak: true }
    ],
    
    // Identification & Behavior
    identificationMark: "A black mole on the left hand cham, A scar on the right near hand thumb finger",
    physicalPeculiarities: "-",
    speechStyle: "Normal",
    mannerism: "Normal",
    habits: "-",
    
    // Activities & Organization
    whereabouts: "Coimbatore, Medical representative",
    activitiesType: "Regarding suicide attacks on temples and public gathering places",
    prevOrganization: "Islamic Youth Association - former member",
    presentOrganization: "-",
    religiousActivities: "Every week Friday he prays at Sunnath jamath mosque, Chinna pallivasal, Kottaimedu, Cbe (Imam: Ibrahim)",
    
    // Properties
    properties: {
        movable: "TVS two wheeler",
        vehicles: "TN 66 AP 0879 - TVS"
    },
    
    // Legal
    advocate: {
        name: "Tr. Kalaiyarasan",
        phone: "9965532711"
    },
    
    // Arrest Details
    arrestDetails: {
        policeStation: "Podanur PS",
        crimeNoAndSec: "Coimbatore City - D3 Podanur PS Cr.No.499/2019 u/s 18, 38, 39 of UAPA Act, 1967",
        bailOrder: "19.07.2020",
        coAccused: "Shajahan, Sheik Safiullah"
    },
    
    // Cases Involved
    casesInvolved: {
        pt: "1"
    },
    
    // Security Proceedings
    securityProceedings: "167 Crpc",
    prisonStatus: "Bail",
    interrogatedBy: "Podanur PS",
    houseGPS: {
        gpsLocation: "Lat 10.988877, Long 76.964327"
    },
    workplaceGPS: {
        gpsLocation: "Lat 10.994061, Long 76.959799"
    },
    
    // Close Associates
    closeAssociates: [
        {
            name: "Shajahan",
            address: "1 A, Resema garden, Anbu Nagar, Cbe-01",
            phone: "6380033537"
        },
        {
            name: "Sheik Safiullah",
            address: "Kuniyamuthur, Coimbatore",
            phone: "9025347243"
        }
    ],
    
    // Verification
    verifiedBy: "Inspr. Tr. T. Jothi, HC 1606 Tr. Vimal Kumar",
    dateOfCreation: new Date("2025-06-21"),
    
    // Case Particulars
    caseParticulars: [
        {
            district: "Coimbatore",
            policeStation: "Podanur PS",
            crimeNo: "499/2019",
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
    suspicionScore: 94,
    isSuspicious: true,
    suspicionReasons: [
        "ISIS Sympathizer",
        "UAPA Act charges",
        "Suicide attack planning",
        "Medical professional with access to public areas",
        "Active radicalization potential"
    ],
    
    // System fields
    createdBy: "system",
    tags: ["ISIS", "UAPA", "Terrorism", "Radicalization", "High Risk", "Medical Professional"]
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
        
        // Create Asiq profile
        console.log('1️⃣  Creating Asiq profile...');
        const profile1 = await Profile.create(asiqProfile);
        console.log(`   ✅ Profile ID: ${profile1.profileId}`);
        console.log(`   Name: ${profile1.name}`);
        console.log(`   Risk Level: ${profile1.radicalizationLevel}`);
        console.log(`   Prison Status: ${profile1.prisonStatus}\n`);
        
        // Create Ismail profile
        console.log('2️⃣  Creating Ismail profile...');
        const profile2 = await Profile.create(ismailProfile);
        console.log(`   ✅ Profile ID: ${profile2.profileId}`);
        console.log(`   Name: ${profile2.name}`);
        console.log(`   Risk Level: ${profile2.radicalizationLevel}`);
        console.log(`   Prison Status: ${profile2.prisonStatus}\n`);
        
        // Create Mohammed Hussain profile
        console.log('3️⃣  Creating Mohammed Hussain profile...');
        const profile3 = await Profile.create(mohammedHussainProfile);
        console.log(`   ✅ Profile ID: ${profile3.profileId}`);
        console.log(`   Name: ${profile3.name}`);
        console.log(`   Risk Level: ${profile3.radicalizationLevel}`);
        console.log(`   Suspicion Score: ${profile3.suspicionScore}%\n`);
        
        // Create Shajahan profile
        console.log('4️⃣  Creating Shajahan profile...');
        const profile4 = await Profile.create(shajahanProfile);
        console.log(`   ✅ Profile ID: ${profile4.profileId}`);
        console.log(`   Name: ${profile4.name}`);
        console.log(`   Risk Level: ${profile4.radicalizationLevel}`);
        console.log(`   Suspicion Score: ${profile4.suspicionScore}%\n`);
        
        // Create Sheik Shaffiullah profile
        console.log('5️⃣  Creating Sheik Shaffiullah profile...');
        const profile5 = await Profile.create(shaffiullahProfile);
        console.log(`   ✅ Profile ID: ${profile5.profileId}`);
        console.log(`   Name: ${profile5.name}`);
        console.log(`   Risk Level: ${profile5.radicalizationLevel}`);
        console.log(`   Suspicion Score: ${profile5.suspicionScore}%\n`);
        
        console.log('✨ Database seeding completed successfully!');
        console.log('📊 Summary:');
        console.log(`   - Total Profiles: 5`);
        console.log(`   - Incarcerated: 1`);
        console.log(`   - On Bail: 2`);
        console.log(`   - Released: 2`);
        console.log(`   - High Risk: 5`);
        console.log(`   - UAPA Act Charges: 5`);
        console.log(`   - ISIS Sympathizers: 3`);
        console.log(`   - Co-accused Linkages Detected\n`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
