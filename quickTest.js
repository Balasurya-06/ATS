/**
 * Quick Test - Creates 2 connected profiles
 * Usage: node quickTest.js
 */

const API = 'http://localhost:3001/api';

const profiles = [
    {
        name: "John Doe",
        phone: "+91-1111111111",
        imeiNumbers: ["111111111111111"],
        address: { present: "123 Test Street, City A" },
        family: { father: "Father Name" },
        closeAssociates: [{ name: "Jane Smith", phone: "+91-2222222222" }],
        organizations: [{ name: "Test Org" }],
        hideouts: "Test Location A",
        radicalizationLevel: "High",
        caseParticulars: [{ crimeNo: "TEST-001" }]
    },
    {
        name: "Jane Smith",
        phone: "+91-2222222222",
        imeiNumbers: ["111111111111111"], // SAME IMEI!
        address: { present: "456 Test Avenue, City A" },
        family: { father: "Father Name 2" },
        closeAssociates: [{ name: "John Doe", phone: "+91-1111111111" }], // MUTUAL!
        organizations: [{ name: "Test Org" }], // SAME ORG!
        hideouts: "Test Location A", // SAME HIDEOUT!
        radicalizationLevel: "Medium",
        caseParticulars: [{ crimeNo: "TEST-001" }] // SAME CASE!
    }
];

async function run() {
    console.log('🚀 Creating test profiles...\n');
    
    for (const p of profiles) {
        const res = await fetch(`${API}/profiles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p)
        });
        const data = await res.json();
        console.log(`✅ Created: ${p.name} (ID: ${data.data?.profileId || 'N/A'})`);
    }
    
    console.log('\n🧠 Running analysis...\n');
    await new Promise(r => setTimeout(r, 2000));
    
    const analysis = await fetch(`${API}/analysis/detect-linkages`, { method: 'POST' });
    const result = await analysis.json();
    
    console.log(`✅ Found ${result.data?.totalLinkages || 0} connections!\n`);
    console.log('🎯 Check Records page → Click 🕸️ Network button!');
}

run();
