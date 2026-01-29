/**
 * Simple Test Data Generator (WORKING VERSION)
 * Creates 2 connected profiles with minimal required fields
 * Usage: node simpleTest.js
 */

const API_URL = 'http://localhost:3001/api';

// Minimal profiles with only required + connection fields
const profile1 = {
    // Required fields
    name: "Rajesh Kumar",
    dob: "1990-05-15",
    gender: "Male",
    
    // Connection fields
    phone: "+91-9876543210",
    imeiNumbers: ["352099001234567"],
    family: {
        father: "Suresh Kumar",
        mother: "Lakshmi Devi"
    },
    address: {
        present: "123 MG Road, Bangalore, Karnataka"
    },
    closeAssociates: [{
        name: "Vikram Singh",
        phone: "+91-9988776655"
    }],
    organizations: [{
        name: "Red Eagle Group"
    }],
    hideouts: "Old warehouse near Hebbal Lake",
    radicalizationLevel: "High",
    caseParticulars: [{
        crimeNo: "CR-2024-001"
    }],
    houseGPS: {
        gpsLocation: "12.9716,77.5946"
    },
    advocate: {
        name: "Adv. Sunil Verma"
    }
};

const profile2 = {
    // Required fields
    name: "Vikram Singh",
    dob: "1992-08-20",
    gender: "Male",
    
    // Connection fields (SAME as profile1 for detection!)
    phone: "+91-9988776655",
    imeiNumbers: ["352099001234567"], // SAME IMEI!
    family: {
        father: "Harpal Singh",
        mother: "Lakshmi Kaur"
    },
    address: {
        present: "456 Brigade Road, Bangalore, Karnataka"
    },
    closeAssociates: [{
        name: "Rajesh Kumar", // MUTUAL!
        phone: "+91-9876543210"
    }],
    organizations: [{
        name: "Red Eagle Group" // SAME ORG!
    }],
    hideouts: "Old warehouse near Hebbal Lake", // SAME HIDEOUT!
    radicalizationLevel: "Medium",
    caseParticulars: [{
        crimeNo: "CR-2024-001" // SAME CASE!
    }],
    houseGPS: {
        gpsLocation: "12.9750,77.5980" // Within 1km!
    },
    advocate: {
        name: "Adv. Sunil Verma" // SAME ADVOCATE!
    }
};

async function createProfile(profileData, profileName) {
    try {
        console.log(`📝 Creating ${profileName}...`);
        
        const response = await fetch(`${API_URL}/profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ ${profileName} created!`);
            console.log(`   Profile ID: ${data.data.profileId || data.data._id}`);
            return data.data;
        } else {
            console.log(`❌ Failed: ${data.message}`);
            if (data.errors) {
                console.log('   Validation errors:', data.errors);
            }
            return null;
        }
    } catch (error) {
        console.error(`❌ Error:`, error.message);
        return null;
    }
}

async function runAnalysis() {
    try {
        console.log('\n🧠 Running network analysis...');
        
        const response = await fetch(`${API_URL}/analysis/detect-linkages`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ Analysis complete!`);
            console.log(`   Linkages found: ${data.data.totalLinkages}`);
            console.log(`   Profiles analyzed: ${data.data.profilesAnalyzed}`);
            return data.data;
        } else {
            console.log(`❌ Analysis failed: ${data.message}`);
            return null;
        }
    } catch (error) {
        console.error(`❌ Error:`, error.message);
        return null;
    }
}

async function showResults() {
    try {
        console.log('\n🔍 Fetching suspicious profiles...');
        
        const response = await fetch(`${API_URL}/analysis/suspicious?minScore=30`);
        const data = await response.json();
        
        if (data.success && data.data.profiles.length > 0) {
            console.log(`\n✅ Found ${data.data.count} suspicious profiles:\n`);
            
            data.data.profiles.forEach(profile => {
                const riskEmoji = profile.suspicionScore >= 70 ? '🔴' : 
                                 profile.suspicionScore >= 40 ? '🟡' : '🟢';
                
                console.log(`${riskEmoji} ${profile.name}`);
                console.log(`   Suspicion: ${profile.suspicionScore}%`);
                console.log(`   Connections: ${profile.linkageCount}`);
                console.log(`   Risk: ${profile.radicalizationLevel}`);
                
                if (profile.suspicionReasons && profile.suspicionReasons.length > 0) {
                    console.log('   Reasons:');
                    profile.suspicionReasons.forEach(reason => {
                        console.log(`     • ${reason}`);
                    });
                }
                console.log('');
            });
        } else {
            console.log('No suspicious profiles found yet.');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function main() {
    console.log('═══════════════════════════════════════════════════');
    console.log('  🚨 ATS Network Detection - Quick Demo Setup');
    console.log('═══════════════════════════════════════════════════\n');
    
    // Create profiles
    const p1 = await createProfile(profile1, "Rajesh Kumar");
    const p2 = await createProfile(profile2, "Vikram Singh");
    
    if (!p1 || !p2) {
        console.log('\n❌ Profile creation failed!');
        console.log('Make sure backend is running: cd backend && npm start');
        return;
    }
    
    // Wait for database
    console.log('\n⏳ Waiting 2 seconds...');
    await new Promise(r => setTimeout(r, 2000));
    
    // Run analysis
    await runAnalysis();
    
    // Wait for completion
    console.log('⏳ Waiting 3 seconds for analysis...');
    await new Promise(r => setTimeout(r, 3000));
    
    // Show results
    await showResults();
    
    console.log('═══════════════════════════════════════════════════');
    console.log('  ✅ Demo Complete!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n🔗 Expected Connections:');
    console.log('   • Same IMEI: 352099001234567');
    console.log('   • Same hideout location');
    console.log('   • Mutual associates');
    console.log('   • Same organization');
    console.log('   • Co-accused in same case');
    console.log('   • GPS proximity (< 1km)');
    console.log('   • Same advocate');
    console.log('\n🎯 Next: Open Dashboard → Records');
    console.log('   Look for 🔴 badges and 🕸️ Network buttons!\n');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
