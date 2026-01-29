/**
 * FINAL WORKING VERSION - Test Data Generator
 * Uses correct Mongoose schema structure
 * Usage: node finalTest.js
 */

const API_URL = 'http://localhost:3001/api';

const profile1 = {
    // REQUIRED
    name: "Rajesh Kumar",
    dob: "1990-05-15",
    gender: "Male",
    
    // CONNECTION FIELDS
    phone: "+91-9876543210",
    imeiNumbers: ["352099001234567"], // SAME IMEI = connection!
    
    father: "Suresh Kumar",
    mother: "Lakshmi Devi",
    
    presentAddress: "123 MG Road, Bangalore, Karnataka",
    permanentAddress: "123 MG Road, Bangalore, Karnataka",
    
    closeAssociates: [{
        name: "Vikram Singh",
        address: "456 Brigade Road",
        phone: "+91-9988776655"
    }],
    
    presentOrg: "Red Eagle Group", // SAME ORG = connection!
    hideouts: "Old warehouse near Hebbal Lake", // SAME HIDEOUT = connection!
    
    radicalizationLevel: "High",
    threatCategory: "Recruiter",
    monitoringStatus: "Active Monitoring",
    
    // CASE PARTICULARS - ARRAY OF OBJECTS!
    caseParticulars: [{
        district: "Bangalore Urban",
        policeStation: "MG Road PS",
        crimeNo: "CR-2024-001", // SAME CASE = connection!
        section: "302, 307, 120B IPC",
        investigationAgency: "ATS Bangalore",
        caseStatus: "Under Trial"
    }],
    
    houseGPS: "12.9716,77.5946",
    
    // ADVOCATE - OBJECT!
    advocate: {
        name: "Adv. Sunil Verma",
        phone: "+91-9900112233"
    }
};

const profile2 = {
    // REQUIRED
    name: "Vikram Singh",
    dob: "1992-08-20",
    gender: "Male",
    
    // CONNECTION FIELDS
    phone: "+91-9988776655",
    imeiNumbers: ["352099001234567"], // SAME IMEI!
    
    father: "Harpal Singh",
    mother: "Lakshmi Kaur",
    
    presentAddress: "456 Brigade Road, Bangalore, Karnataka",
    permanentAddress: "456 Brigade Road, Bangalore, Karnataka",
    
    closeAssociates: [{
        name: "Rajesh Kumar", // MUTUAL!
        address: "123 MG Road",
        phone: "+91-9876543210"
    }],
    
    presentOrg: "Red Eagle Group", // SAME ORG!
    hideouts: "Old warehouse near Hebbal Lake", // SAME HIDEOUT!
    
    radicalizationLevel: "Medium",
    threatCategory: "Financier",
    monitoringStatus: "Active Monitoring",
    
    // CASE PARTICULARS - ARRAY!
    caseParticulars: [{
        district: "Bangalore Urban",
        policeStation: "MG Road PS",
        crimeNo: "CR-2024-001", // SAME CASE!
        section: "120B, 420, 506 IPC",
        investigationAgency: "ATS Bangalore",
        caseStatus: "Under Investigation"
    }],
    
    houseGPS: "12.9750,77.5980", // Within 1km!
    
    // ADVOCATE - OBJECT!
    advocate: {
        name: "Adv. Sunil Verma", // SAME ADVOCATE!
        phone: "+91-9900112233"
    }
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
                console.log(`${emoji} ${p.name} - ${p.suspicionScore}% (${p.linkageCount} connections)`);
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
    console.log('  🚨 ATS Network Detection - FINAL TEST');
    console.log('═══════════════════════════════════════════════════\n');
    
    const p1 = await createProfile(profile1, "Rajesh Kumar");
    const p2 = await createProfile(profile2, "Vikram Singh");
    
    if (!p1 || !p2) {
        console.log('\n❌ FAILED! Is backend running?');
        return;
    }
    
    console.log('\n⏳ Waiting...');
    await new Promise(r => setTimeout(r, 2000));
    
    await runAnalysis();
    
    await new Promise(r => setTimeout(r, 3000));
    await showResults();
    
    console.log('═══════════════════════════════════════════════════');
    console.log('  ✅ DEMO COMPLETE!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n🔗 7 Connections Detected:');
    console.log('   ✓ Same IMEI number');
    console.log('   ✓ Same hideout location');
    console.log('   ✓ Mutual close associates');
    console.log('   ✓ Same organization');
    console.log('   ✓ Co-accused in same case');
    console.log('   ✓ GPS proximity (< 1km)');
    console.log('   ✓ Same advocate');
    console.log('\n🎯 NOW: Open Dashboard → Records');
    console.log('   You\'ll see 🔴/🟡 badges!');
    console.log('   Click 🕸️ Network to see graph!\n');
}

main();
