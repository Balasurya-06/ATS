/**
 * Test Data Generator for Network Detection Demo
 * Creates 2 connected criminal profiles to demonstrate AI linkage detection
 * 
 * Usage: node createTestProfiles.js
 */

const API_URL = 'http://localhost:3001/api';

// Profile 1: Rajesh Kumar (High Risk Criminal)
const profile1 = {
    name: "Rajesh Kumar",
    phone: "+91-9876543210",
    email: "rajesh.k@example.com",
    
    // Address
    address: {
        present: "123 MG Road, Bangalore, Karnataka",
        permanent: "123 MG Road, Bangalore, Karnataka"
    },
    
    // Family
    family: {
        father: "Suresh Kumar",
        mother: "Lakshmi Devi",
        spouse: "Priya Sharma",
        children: "2"
    },
    
    // Identity Cards
    identityCards: {
        aadhar: "1234-5678-9012",
        pan: "ABCDE1234F",
        passport: "K1234567",
        drivingLicense: "KA01-20230001"
    },
    
    // Social Media
    socialMedia: {
        email: "rajesh.k@example.com",
        whatsapp: "+91-9876543210",
        instagram: "@rajesh_kumar",
        facebook: "rajesh.kumar.official",
        twitter: "@rajeshk"
    },
    
    // Contact
    imeiNumbers: ["352099001234567", "352099001234568"],
    
    // Close Associates
    closeAssociates: [
        {
            name: "Vikram Singh",
            address: "456 Brigade Road, Bangalore",
            phone: "+91-9988776655"
        },
        {
            name: "Arjun Reddy",
            address: "789 Residency Road, Bangalore",
            phone: "+91-9876000111"
        }
    ],
    
    // Risk Assessment
    radicalizationLevel: "High",
    threatCategory: "Recruiter",
    monitoringStatus: "Active Monitoring",
    
    // Organizations
    organizations: [
        {
            name: "Red Eagle Group",
            role: "Leader",
            joiningDate: "2023-01-15",
            activities: "Recruitment, Planning"
        }
    ],
    
    // Location Intelligence
    hideouts: "Old warehouse near Hebbal Lake, Abandoned factory in Peenya",
    frequentPlaces: "MG Road, Koramangala, Indiranagar",
    houseGPS: {
        gpsLocation: "12.9716,77.5946",
        remarks: "High security area, gated community"
    },
    workplaceGPS: {
        gpsLocation: "12.9700,77.5950",
        remarks: "Commercial complex"
    },
    
    // Case Details
    caseParticulars: [
        {
            district: "Bangalore Urban",
            policeStation: "MG Road PS",
            crimeNo: "CR-2024-001",
            section: "302, 307, 120B IPC",
            investigationAgency: "ATS Bangalore",
            courtName: "Sessions Court, Bangalore",
            caseNo: "SC/2024/001",
            caseStatus: "Under Trial",
            remarks: "High profile case, multiple accused"
        }
    ],
    
    // Additional Info
    activities: "Recruitment of youth, organizing illegal meetings, spreading propaganda",
    modus: "Uses social media for recruitment, conducts secret meetings",
    advocate: {
        name: "Adv. Sunil Verma",
        phone: "+91-9900112233",
        address: "High Court Complex, Bangalore"
    }
};

// Profile 2: Vikram Singh (Connected Criminal)
const profile2 = {
    name: "Vikram Singh",
    phone: "+91-9988776655",
    email: "vikram.s@example.com",
    
    // Address (nearby location)
    address: {
        present: "456 Brigade Road, Bangalore, Karnataka",
        permanent: "456 Brigade Road, Bangalore, Karnataka"
    },
    
    // Family
    family: {
        father: "Harpal Singh",
        mother: "Lakshmi Kaur",
        spouse: "Simran Kaur",
        children: "1"
    },
    
    // Identity Cards
    identityCards: {
        aadhar: "9876-5432-1098",
        pan: "XYZAB5678C",
        passport: "K9876543",
        drivingLicense: "KA01-20230002"
    },
    
    // Social Media
    socialMedia: {
        email: "vikram.s@example.com",
        whatsapp: "+91-9988776655",
        instagram: "@vikram_official",
        facebook: "vikram.singh.pro",
        twitter: "@vikrams"
    },
    
    // Contact (SAME IMEI as Profile 1 - will trigger detection!)
    imeiNumbers: ["352099001234567", "352099009876543"],
    
    // Close Associates (Lists Rajesh Kumar - mutual connection!)
    closeAssociates: [
        {
            name: "Rajesh Kumar",
            address: "123 MG Road, Bangalore",
            phone: "+91-9876543210"
        },
        {
            name: "Deepak Malhotra",
            address: "321 Church Street, Bangalore",
            phone: "+91-9876111222"
        }
    ],
    
    // Risk Assessment
    radicalizationLevel: "Medium",
    threatCategory: "Financier",
    monitoringStatus: "Active Monitoring",
    
    // Organizations (SAME as Profile 1 - will trigger detection!)
    organizations: [
        {
            name: "Red Eagle Group",
            role: "Finance Manager",
            joiningDate: "2023-03-20",
            activities: "Funding, Money laundering"
        }
    ],
    
    // Location Intelligence (SAME hideout - will trigger detection!)
    hideouts: "Old warehouse near Hebbal Lake",
    frequentPlaces: "Brigade Road, Commercial Street, Lavelle Road",
    houseGPS: {
        gpsLocation: "12.9750,77.5980", // Within 1km of Profile 1
        remarks: "Near commercial area"
    },
    workplaceGPS: {
        gpsLocation: "12.9730,77.5960",
        remarks: "Shopping complex"
    },
    
    // Case Details (CO-ACCUSED in same case - will trigger detection!)
    caseParticulars: [
        {
            district: "Bangalore Urban",
            policeStation: "MG Road PS",
            crimeNo: "CR-2024-001", // SAME case number
            section: "120B, 420, 506 IPC",
            investigationAgency: "ATS Bangalore",
            courtName: "Sessions Court, Bangalore",
            caseNo: "SC/2024/001",
            caseStatus: "Under Investigation",
            remarks: "Financial transactions being investigated"
        }
    ],
    
    // Additional Info
    activities: "Money laundering, hawala transactions, property dealings",
    modus: "Uses fake companies for money transfer, maintains multiple bank accounts",
    advocate: {
        name: "Adv. Sunil Verma", // SAME advocate - will trigger detection!
        phone: "+91-9900112233",
        address: "High Court Complex, Bangalore"
    }
};

// Function to create profile
async function createProfile(profileData, profileName) {
    try {
        console.log(`\n📝 Creating ${profileName}...`);
        
        const response = await fetch(`${API_URL}/profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ ${profileName} created successfully!`);
            console.log(`   ID: ${data.data._id}`);
            console.log(`   Profile ID: ${data.data.profileId}`);
            return data.data;
        } else {
            console.log(`❌ Failed to create ${profileName}`);
            console.log(`   Error: ${data.message}`);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error creating ${profileName}:`, error.message);
        return null;
    }
}

// Function to run network analysis
async function runNetworkAnalysis() {
    try {
        console.log('\n\n🧠 Running network analysis...');
        
        const response = await fetch(`${API_URL}/analysis/detect-linkages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Network analysis completed!');
            console.log(`   Total Linkages Found: ${data.data.totalLinkages}`);
            console.log(`   Profiles Analyzed: ${data.data.profilesAnalyzed}`);
            return data.data;
        } else {
            console.log('❌ Analysis failed');
            console.log(`   Error: ${data.message}`);
            return null;
        }
    } catch (error) {
        console.error('❌ Error running analysis:', error.message);
        return null;
    }
}

// Function to get suspicious profiles
async function getSuspiciousProfiles() {
    try {
        console.log('\n\n🔍 Fetching suspicious profiles...');
        
        const response = await fetch(`${API_URL}/analysis/suspicious?minScore=30`);
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ Found ${data.data.count} suspicious profiles:`);
            data.data.profiles.forEach(profile => {
                console.log(`\n   👤 ${profile.name}`);
                console.log(`      Suspicion Score: ${profile.suspicionScore}%`);
                console.log(`      Connections: ${profile.linkageCount}`);
                console.log(`      Risk Level: ${profile.radicalizationLevel}`);
                if (profile.suspicionReasons && profile.suspicionReasons.length > 0) {
                    console.log(`      Reasons:`);
                    profile.suspicionReasons.forEach(reason => {
                        console.log(`        • ${reason}`);
                    });
                }
            });
            return data.data.profiles;
        } else {
            console.log('❌ Failed to fetch suspicious profiles');
            return null;
        }
    } catch (error) {
        console.error('❌ Error fetching suspicious profiles:', error.message);
        return null;
    }
}

// Main execution
async function main() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🚨 ATS Network Detection Demo - Test Data Creator  ');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\nThis script will:');
    console.log('1. Create 2 criminal profiles with intentional connections');
    console.log('2. Run AI network analysis');
    console.log('3. Display detected linkages\n');
    
    // Create profiles
    const p1 = await createProfile(profile1, "Profile 1: Rajesh Kumar");
    const p2 = await createProfile(profile2, "Profile 2: Vikram Singh");
    
    if (!p1 || !p2) {
        console.log('\n❌ Failed to create profiles. Please check if backend is running.');
        console.log('   Start backend: cd backend && npm start');
        return;
    }
    
    // Wait a bit for database to settle
    console.log('\n⏳ Waiting 2 seconds for database...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Run analysis
    const analysis = await runNetworkAnalysis();
    
    if (!analysis) {
        console.log('\n❌ Analysis failed. Please check backend logs.');
        return;
    }
    
    // Wait for analysis to complete
    console.log('\n⏳ Waiting 3 seconds for analysis to complete...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get suspicious profiles
    await getSuspiciousProfiles();
    
    console.log('\n\n═══════════════════════════════════════════════════════');
    console.log('  ✅ Demo Setup Complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📊 Expected Connections:');
    console.log('   🔗 Same IMEI: 352099001234567');
    console.log('   📍 Same Hideout: Old warehouse near Hebbal Lake');
    console.log('   👥 Mutual Associates: Listed each other');
    console.log('   🏢 Same Organization: Red Eagle Group');
    console.log('   ⚖️  Co-accused: Case CR-2024-001');
    console.log('   📍 GPS Proximity: Within 1km');
    console.log('   ⚖️  Same Advocate: Adv. Sunil Verma');
    console.log('\n🎯 Next Steps:');
    console.log('   1. Open ATS Dashboard → Records');
    console.log('   2. See 🔴 HIGH RISK badges');
    console.log('   3. Click 🕸️ Network button');
    console.log('   4. Explore the connection graph!');
    console.log('\n═══════════════════════════════════════════════════════\n');
}

// Run the script
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
