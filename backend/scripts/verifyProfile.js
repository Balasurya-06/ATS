require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Profile = require('../models/Profile');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME || 'accust_db'
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}\n`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const verifyProfile = async () => {
    try {
        await connectDB();
        
        console.log('🔍 Fetching profile data...\n');
        
        const profile = await Profile.findOne({ name: "Shajahan" });
        
        if (!profile) {
            console.log('❌ No profile found!');
            process.exit(1);
        }
        
        console.log('✅ Profile Found!\n');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('BASIC INFORMATION');
        console.log('═══════════════════════════════════════════════════════════');
        console.log(`Profile ID: ${profile.profileId}`);
        console.log(`Name: ${profile.name}`);
        console.log(`Age: ${profile.age} years`);
        console.log(`DOB: ${profile.dob.toDateString()}`);
        console.log(`Gender: ${profile.gender}`);
        console.log(`Case: ${profile.case}`);
        console.log(`Phone: ${profile.phone}`);
        console.log(`\nFather: ${profile.family.father}`);
        console.log(`Mother: ${profile.family.mother}`);
        console.log(`Spouse: ${profile.family.wives}`);
        
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('ADDRESS');
        console.log('═══════════════════════════════════════════════════════════');
        console.log(`${profile.address.present.doorNo}, ${profile.address.present.streetName}`);
        console.log(`${profile.address.present.villageWard}, ${profile.address.present.district}`);
        console.log(`${profile.address.present.statePinCode}`);
        console.log(`PS: ${profile.address.present.policeStation}`);
        
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('RISK ASSESSMENT');
        console.log('═══════════════════════════════════════════════════════════');
        console.log(`Radicalization Level: ${profile.radicalizationLevel}`);
        console.log(`Threat Category: ${profile.threatCategory}`);
        console.log(`Suspicion Score: ${profile.suspicionScore}%`);
        console.log(`Is Suspicious: ${profile.isSuspicious ? 'YES' : 'NO'}`);
        console.log(`Monitoring Status: ${profile.monitoringStatus}`);
        console.log(`File Classification: ${profile.fileClassification}`);
        
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('ORGANIZATION & ACTIVITIES');
        console.log('═══════════════════════════════════════════════════════════');
        console.log(`Present Organization: ${profile.presentOrganization}`);
        console.log(`Activities Type: ${profile.activitiesType}`);
        console.log(`Religious Activities: ${profile.religiousActivities}`);
        
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('LEGAL DETAILS');
        console.log('═══════════════════════════════════════════════════════════');
        console.log(`PS: ${profile.arrestDetails.policeStation}`);
        console.log(`Crime: ${profile.arrestDetails.crimeNoAndSec}`);
        console.log(`Arrest Date: ${profile.arrestDetails.datePlace}`);
        console.log(`Bail Order: ${profile.arrestDetails.bailOrder}`);
        console.log(`Co-Accused: ${profile.arrestDetails.coAccused}`);
        console.log(`Prison Status: ${profile.prisonStatus}`);
        console.log(`Advocate: ${profile.advocate.name} (${profile.advocate.phone})`);
        
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('CLOSE ASSOCIATES');
        console.log('═══════════════════════════════════════════════════════════');
        profile.closeAssociates.forEach((assoc, index) => {
            console.log(`${index + 1}. ${assoc.name}`);
            console.log(`   Address: ${assoc.address}`);
            console.log(`   Phone: ${assoc.phone}`);
        });
        
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('CASE PARTICULARS');
        console.log('═══════════════════════════════════════════════════════════');
        profile.caseParticulars.forEach((caseItem, index) => {
            console.log(`${index + 1}. ${caseItem.policeStation} - ${caseItem.crimeNo}`);
            console.log(`   Section: ${caseItem.section}`);
            console.log(`   Court: ${caseItem.courtName} (${caseItem.caseNo})`);
            console.log(`   Status: ${caseItem.caseStatus}`);
        });
        
        console.log('\n✅ Verification Complete!\n');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error verifying profile:', error);
        process.exit(1);
    }
};

verifyProfile();
