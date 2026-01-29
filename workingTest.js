/**
 * WORKING Test Data Generator
 * Uses correct field names matching validation schema
 * Usage: node workingTest.js
 */

const API_URL = 'http://localhost:3001/api';

// Profile 1 with CORRECT field names
const profile1 = {
    // Required fields
    name: "Rajesh Kumar",
    dob: "1990-05-15",
    gender: "Male",
    
    // Connection fields (using CORRECT flat field names)
    phone: "+91-9876543210",
    imeiNumbers: ["352099001234567"],
    
    // Family (flat fields!)
    father: "Suresh Kumar",
    mother: "Lakshmi Devi",
    
    // Address (flat fields!)
    presentAddress: "123 MG Road, Bangalore, Karnataka",
    permanentAddress: "123 MG Road, Bangalore, Karnataka",
    
    // Associates
    closeAssociates: [{
        name: "Vikram Singh",
        address: "456 Brigade Road",
        phone: "+91-9988776655"
    }],
    
    // Organization (flat text field!)
    presentOrg: "Red Eagle Group",
    
    // Hideouts
    hideouts: "Old warehouse near Hebbal Lake",
    
    // Risk
    radicalizationLevel: "High",
    threatCategory: "Recruiter",
    monitoringStatus: "Active Monitoring",
    
    // Case (flat text field!)
    caseParticulars: "Case: CR-2024-001, Section: 302/307 IPC, PS: MG Road",
    
    // GPS  (flat text field!)
    houseGPS: "12.9716,77.5946",
    
    // Advocate (flat text field!)
    advocate: "Adv. Sunil Verma, +91-9900112233"
};

// Profile 2 with SAME connection points
const profile2 = {
    // Required fields
    name: "Vikram Singh",
    dob: "1992-08-20",
    gender: "Male",
    
    // Connection fields
    phone: "+91-9988776655",
    imeiNumbers: ["352099001234567"], // SAME IMEI!
    
    // Family
    father: "Harpal Singh",
    mother: "Lakshmi Kaur",
    
    // Address
    presentAddress: "456 Brigade Road, Bangalore, Karnataka",
    permanentAddress: "456 Brigade Road, Bangalore, Karnataka",
    
    // Associates (MUTUAL!)
    closeAssociates: [{
        name: "Rajesh Kumar",
        address: "123 MG Road",
        phone: "+91-9876543210"
    }],
    
    // Organization (SAME!)
    presentOrg: "Red Eagle Group",
    
    // Hideouts (SAME!)
    hideouts: "Old warehouse near Hebbal Lake",
    
    // Risk
    radicalizationLevel: "Medium",
    threatCategory: "Financier",
    monitoringStatus: "Active Monitoring",
    
    // Case (SAME!) 
    caseParticulars: "Case: CR-2024-001, Section: 120B/420 IPC, PS: MG Road",
    
    // GPS (Within 1km!)
    houseGPS: "12.9750,77.5980",
    
    // Advocate (SAME!)
    advocate: "Adv. Sunil Verma, +91-9900112233"
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
                console.log('   Errors:', data.errors);
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
            return data.data;
        } else {
            console.log(`❌ Failed: ${data.message}`);
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
                const emoji = profile.suspicionScore >= 70 ? '🔴' : 
                             profile.suspicionScore >= 40 ? '🟡' : '🟢';
                
                console.log(`${emoji} ${profile.name}`);
                console.log(`   Suspicion: ${profile.suspicionScore}%`);
                console.log(`   Connections: ${profile.linkageCount}`);
                console.log(`   Risk: ${profile.radicalizationLevel}`);
                
                if (profile.suspicionReasons?.length > 0) {
                    console.log('   Reasons:');
                    profile.suspicionReasons.forEach(r => console.log(`     • ${r}`));
                }
                console.log('');
            });
        } else {
            console.log('No suspicious profiles found.');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

async function main() {
    console.log('═══════════════════════════════════════════════════');
    console.log('  🚨 ATS Network Detection - WORKING VERSION');
    console.log('═══════════════════════════════════════════════════\n');
    
    const p1 = await createProfile(profile1, "Rajesh Kumar");
    const p2 = await createProfile(profile2, "Vikram Singh");
    
    if (!p1 || !p2) {
        console.log('\n❌ Failed! Check backend: cd backend && npm start');
        return;
    }
    
    console.log('\n⏳ Waiting 2 seconds...');
    await new Promise(r => setTimeout(r, 2000));
    
    await runAnalysis();
    
    console.log('⏳ Waiting 3 seconds...');
    await new Promise(r => setTimeout(r, 3000));
    
    await showResults();
    
    console.log('═══════════════════════════════════════════════════');
    console.log('  ✅ DEMO COMPLETE!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n🔗 Expected Connections:');
    console.log('   • Same IMEI: 352099001234567');
    console.log('   • Same hideout location');
    console.log('   • Mutual close associates');
    console.log('   • Same organization');
    console.log('   • Same case mentioned');
    console.log('   • GPS proximity (< 1km)');
    console.log('   • Same advocate');
    console.log('\n🎯 Open Dashboard → Records');
    console.log('   Look for 🔴/🟡 badges and 🕸️ Network buttons!\n');
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
