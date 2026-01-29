/**
 * WORKING VERSION - Uses validation schema format (strings only)
 * Usage: node demo.js
 */

const API_URL = 'http://localhost:3001/api';

const profile1 = {
    // REQUIRED
    name: "Rajesh Kumar",
    dob: "1990-05-15",
    gender: "Male",
    
    // CONNECTION FIELDS (all as strings or string arrays)
    phone: "+91-9876543210",
    imeiNumbers: "352099001234567", // String format - SAME = connection!
    
    father: "Suresh Kumar",
    mother: "Lakshmi Devi",
    
    presentAddress: "123 MG Road, Bangalore, Karnataka",
    permanentAddress: "123 MG Road, Bangalore, Karnataka",
    
    closeAssociates: "Vikram Singh, 456 Brigade Road, +91-9988776655", // STRING format
    
    presentOrg: "Red Eagle Group", // SAME = connection!
    hideouts: "Old warehouse near Hebbal Lake", // SAME = connection!
    
    radicalizationLevel: "High",
    threatCategory: "Recruiter",
    monitoringStatus: "Active Monitoring",
    
    // STRING format (validation requires string)
    caseParticulars: "Case No: CR-2024-001, District: Bangalore Urban, PS: MG Road, Section: 302/307 IPC, Status: Under Trial",
    
    houseGPS: "12.9716,77.5946",
    
    // STRING format (validation requires string)
    advocate: "Adv. Sunil Verma, +91-9900112233"
};

const profile2 = {
    // REQUIRED
    name: "Vikram Singh",
    dob: "1992-08-20",
    gender: "Male",
    
    // CONNECTION FIELDS
    phone: "+91-9988776655",
    imeiNumbers: "352099001234567", // SAME IMEI!
    
    father: "Harpal Singh",
    mother: "Lakshmi Kaur",
    
    presentAddress: "456 Brigade Road, Bangalore, Karnataka",
    permanentAddress: "456 Brigade Road, Bangalore, Karnataka",
    
    closeAssociates: "Rajesh Kumar, 123 MG Road, +91-9876543210", // MUTUAL!
    
    presentOrg: "Red Eagle Group", // SAME!
    hideouts: "Old warehouse near Hebbal Lake", // SAME!
    
    radicalizationLevel: "Medium",
    threatCategory: "Financier",
    monitoringStatus: "Active Monitoring",
    
    caseParticulars: "Case No: CR-2024-001, District: Bangalore Urban, PS: MG Road, Section: 120B/420 IPC, Status: Investigation", // SAME CASE!
    
    houseGPS: "12.9750,77.5980", // Within 1km!
    
    advocate: "Adv. Sunil Verma, +91-9900112233" // SAME!
};

async function createProfile(profileData, name) {
    try {
        console.log(`📝 Creating ${name}...`);
        
        const response = await fetch(`${API_URL}/profiles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ ${name} created! ID: ${data.data.profileId || data.data._id}`);
            return data.data;
        } else {
            console.log(`❌ Failed: ${data.message}`);
            if (data.errors) console.log('Errors:', data.errors);
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
        const response = await fetch(`${API_URL}/analysis/detect-linkages`, { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ Found ${data.data.totalLinkages} linkages!`);
            return data.data;
        }
        return null;
    } catch (error) {
        console.error(`❌ Error:`, error.message);
        return null;
    }
}

async function showResults() {
    try {
        console.log('\n🔍 Checking suspicious profiles...\n');
        const response = await fetch(`${API_URL}/analysis/suspicious?minScore=30`);
        const data = await response.json();
        
        if (data.success && data.data.profiles.length > 0) {
            data.data.profiles.forEach(p => {
                const emoji = p.suspicionScore >= 70 ? '🔴' : p.suspicionScore >= 40 ? '🟡' : '🟢';
                console.log(`${emoji} ${p.name} - ${p.suspicionScore}% suspicion (${p.linkageCount} connections)`);
                if (p.suspicionReasons) {
                    p.suspicionReasons.forEach(r => console.log(`   • ${r}`));
                }
                console.log('');
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    console.log('═══════════════════════════════════════════════════');
    console.log('  🚨 ATS NETWORK DETECTION - DEMO');
    console.log('═══════════════════════════════════════════════════\n');
    
    const p1 = await createProfile(profile1, "Rajesh Kumar");
    const p2 = await createProfile(profile2, "Vikram Singh");
    
    if (!p1 || !p2) {
        console.log('\n❌ FAILED! Backend might not be running.');
        console.log('   Run: cd backend && npm start');
        return;
    }
    
    console.log('\n⏳ Waiting 2 seconds...');
    await new Promise(r => setTimeout(r, 2000));
    
    await runAnalysis();
    
    console.log('⏳ Waiting 3 seconds for analysis...');
    await new Promise(r => setTimeout(r, 3000));
    
    await showResults();
    
    console.log('═══════════════════════════════════════════════════');
    console.log('  ✅ DEMO COMPLETE!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n🔗 Expected Connections:');
    console.log('   • Same IMEI: 352099001234567');
    console.log('   • Same hideout: Old warehouse near Hebbal Lake');
    console.log('   • Mutual associates (mentioned each other)');
    console.log('   • Same organization: Red Eagle Group');
    console.log('   • Same case: CR-2024-001');
    console.log('   • GPS proximity: Within 1km');
    console.log('   • Same advocate: Adv. Sunil Verma');
    console.log('\n🎯 NOW GO TO DASHBOARD:');
    console.log('   1. Open http://localhost:3000');
    console.log('   2. Go to Records page');
    console.log('   3. Look for 🔴 HIGH RISK and 🟡 MEDIUM badges');
    console.log('   4. Click 🕸️ Network button to see graph!');
    console.log('   5. Try the filter: "🚨 Suspicious Only"\n');
}

main();
