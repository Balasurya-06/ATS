/**
 * REAL WORKING TEST - Uses fields from actual Profile schema
 */

const API_URL = 'http://localhost:3001/api';

// Based on what we saw in debug: profiles only have basic fields
// Let's add fields that the linkageDetector actually checks for

const profile1 = {
    name: "Rajesh Kumar",
    dob: "1990-05-15",
    gender: "Male",
    
    // Fields the detector ACTUALLY checks:
    phone: "+91-9876543210",
    presentAddress: "123 MG Road, Bangalore",  
    father: "Suresh Kumar",
    hideouts: "Warehouse near Hebbal Lake",
    
    radicalizationLevel: "High",
    monitoringStatus: "Active Monitoring"
};

const profile2 = {
    name: "Vikram Singh",
    dob: "1992-08-20",
    gender: "Male",
    
    // SAME VALUES for connections!
    phone: "+91-9988776655",
    presentAddress: "456 Brigade Road, Bangalore",
    father: "Harpal Singh",  
    hideouts: "Warehouse near Hebbal Lake", // SAME HIDEOUT!
    
    radicalizationLevel: "Medium",
    monitoringStatus: "Active Monitoring"
};

async function test() {
    console.log('Creating profiles...\n');
    
    // Create
    let p1 = await fetch(`${API_URL}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile1)
    }).then(r => r.json());
    
    let p2 = await fetch(`${API_URL}/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile2)
    }).then(r => r.json());
    
    console.log('✅ Created:', p1.data?.profileId, p2.data?.profileId);
    
    // Wait
    await new Promise(r => setTimeout(r, 2000));
    
    // Analyze
    console.log('\n🧠 Running analysis...\n');
    let analysis = await fetch(`${API_URL}/analysis/detect-linkages`, { method: 'POST' }).then(r => r.json());
    console.log('Result:', analysis);
    
    // Wait for scores to update
    await new Promise(r => setTimeout(r, 3000));
    
    // Check results
    console.log('\n📊 Checking suspicious profiles...\n');
    let suspicious = await fetch(`${API_URL}/analysis/suspicious?minScore=20`).then(r => r.json());
    
    if (suspicious.success && suspicious.data.profiles.length > 0) {
        suspicious.data.profiles.forEach(p => {
            console.log(`${p.suspicionScore >= 50 ? '🔴' : '🟡'} ${p.name} - ${p.suspicionScore}% (${p.linkageCount} connections)`);
            if (p.suspicionReasons) {
                p.suspicionReasons.forEach(r => console.log(`   • ${r}`));
            }
        });
    } else {
        console.log('No suspicious profiles found.');
    }
    
    console.log('\n🎯 Open Dashboard → Records to see badges!');
}

test();
