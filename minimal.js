/**
 * MINIMAL WORKING VERSION
 * Uses only basic fields that definitely work
 * Usage: node minimal.js
 */

const API_URL = 'http://localhost:3001/api';

// Absolutely minimal profiles - just required fields + a few connection points
const profile1 = {
    name: "Rajesh Kumar",
    dob: "1990-05-15",
    gender: "Male",
    
    // Only simple string fields for connections
    phone: "+91-9876543210",
    presentAddress: "123 MG Road, Bangalore",
    father: "Suresh Kumar",
    presentOrg: "Red Eagle Group",
    hideouts: "Warehouse near Hebbal",
    radicalizationLevel: "High"
};

const profile2 = {
    name: "Vikram Singh",
    dob: "1992-08-20",
    gender: "Male",
    
    // Same values = connections!
    phone: "+91-9988776655",
    presentAddress: "456 Brigade Road, Bangalore",
    father: "Harpal Singh",
    presentOrg: "Red Eagle Group", // SAME ORG!
    hideouts: "Warehouse near Hebbal", // SAME HIDEOUT!
    radicalizationLevel: "Medium"
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
            return null;
        }
    } catch (error) {
        console.error(`❌ Error:`, error.message);
        return null;
    }
}

async function runAnalysis() {
    try {
        console.log('\n🧠 Running analysis...');
        const response = await fetch(`${API_URL}/analysis/detect-linkages`, { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            console.log(`✅ Found ${data.data.totalLinkages} linkages!`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`❌ Error:`, error.message);
        return false;
    }
}

async function showResults() {
    try {
        console.log('\n🔍 Checking results...\n');
        const response = await fetch(`${API_URL}/analysis/suspicious?minScore=20`);
        const data = await response.json();
        
        if (data.success && data.data.profiles.length > 0) {
            data.data.profiles.forEach(p => {
                const emoji = p.suspicionScore >= 70 ? '🔴' : p.suspicionScore >= 40 ? '🟡' : '🟢';
                console.log(`${emoji} ${p.name} - ${p.suspicionScore}% (${p.linkageCount} connections)`);
            });
        } else {
            console.log('No suspicious profiles detected yet.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('  🚨 MINIMAL TEST');
    console.log('═══════════════════════════════════════════════\n');
    
    const p1 = await createProfile(profile1, "Rajesh Kumar");
    const p2 = await createProfile(profile2, "Vikram Singh");
    
    if (!p1 || !p2) {
        console.log('\n❌ Profile creation failed!');
        console.log('\n💡 TRY MANUAL METHOD:');
        console.log('   1. Open http://localhost:3000');
        console.log('   2. Click ➕ Add Profile ');
       console.log('   3. Fill: Rajesh Kumar, Male, DOB: 1990-01-01');
        console.log('      Organization: "Red Eagle Group"');
        console.log('      Hideouts: "Warehouse near Hebbal"');
        console.log('   4. Add another: Vikram Singh');
        console.log('      SAME Organization: "Red Eagle Group"');
        console.log('      SAME Hideouts: "Warehouse near Hebbal"');
        console.log('   5. Go to Records → Click "🧠 Analyze Network"');
        console.log('   6. See the badges and network graph!');
        return;
    }
    
    await new Promise(r => setTimeout(r, 2000));
    await runAnalysis();
    await new Promise(r => setTimeout(r, 3000));
    await showResults();
    
    console.log('\n═══════════════════════════════════════════════');
    console.log('  ✅ SUCCESS! Open Dashboard → Records');
    console.log('═══════════════════════════════════════════════\n');
}

main();
