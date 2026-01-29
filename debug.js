/**
 * Debug script - check what's in the database
 */

const API_URL = 'http://localhost:3001/api';

async function checkProfiles() {
    console.log('🔍 Checking profiles in database...\n');
    
    const response = await fetch(`${API_URL}/profiles?page=1&limit=10`);
    const data = await response.json();
    
    console.log('Response:', JSON.stringify(data, null, 2));
    
    const profiles = data.data?.docs || data.data || data.profiles || [];
    
    if (profiles.length > 0) {
        console.log(`\nFound ${profiles.length} profiles:\n`);
        profiles.forEach(p => {
            console.log(`📋 ${p.name} (${p.profileId})`);
            console.log(`   Org: ${p.presentOrganization || p.presentOrg || 'none'}`);
            console.log(`   Hideouts: ${p.hideouts || 'none'}`);
            console.log(`   Phone: ${p.phone || 'none'}`);
            console.log(`   IMEI: ${p.imeiNumbers || 'none'}`);
            console.log(`   Suspicion: ${p.suspicionScore || 0}% | Linkages: ${p.linkageCount || 0}`);
            console.log('');
        });
    } else {
        console.log('No profiles found or unexpected response structure');
    }
}

async function checkLinkages() {
    console.log('\n🔗 Checking linkages...\n');
    
    const response = await fetch(`${API_URL}/analysis/stats`);
    const data = await response.json();
    
    if (data.success) {
        console.log('Stats:', data.data);
    }
}

async function runFullAnalysis() {
    console.log('\n🧠 Running FULL analysis with debug...\n');
    
    const response = await fetch(`${API_URL}/analysis/detect-linkages`, {
        method: 'POST'
    });
    
    const data = await response.json();
    console.log('Analysis result:', JSON.stringify(data, null, 2));
}

async function main() {
    await checkProfiles();
    await runFullAnalysis();
    await new Promise(r => setTimeout(r, 3000));
    await checkLinkages();
    await checkProfiles();
}

main();
