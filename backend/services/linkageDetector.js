const Profile = require('../models/Profile');
const Linkage = require('../models/Linkage');

/**
 * COMPREHENSIVE DEEP LINKAGE DETECTOR
 * Checks ALL 70+ profile fields for connections
 */

// Helper: String similarity
function stringSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    
    // Convert to strings if not already
    if (typeof str1 !== 'string') str1 = String(str1);
    if (typeof str2 !== 'string') str2 = String(str2);
    
    str1 = str1.toLowerCase().trim();
    str2 = str2.toLowerCase().trim();
    if (str1 === str2) return 1.0;
    
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            const cost = str1[j - 1] === str2[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    
    const maxLen = Math.max(str1.length, str2.length);
    return maxLen === 0 ? 1.0 : 1 - (matrix[str2.length][str1.length] / maxLen);
}

// Helper: GPS distance
function gpsDistance(coord1, coord2) {
    if (!coord1 || !coord2) return Infinity;
    
    // Ensure coords are strings
    const str1 = typeof coord1 === 'string' ? coord1 : String(coord1);
    const str2 = typeof coord2 === 'string' ? coord2 : String(coord2);
    
    const parts1 = str1.split(',');
    const parts2 = str2.split(',');
    if (parts1.length < 2 || parts2.length < 2) return Infinity;
    
    const lat1 = parseFloat(parts1[0]);
    const lon1 = parseFloat(parts1[1]);
    const lat2 = parseFloat(parts2[0]);
    const lon2 = parseFloat(parts2[1]);
    
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return Infinity;
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Helper: Check array fields
function checkArrayMatch(arr1, arr2, fieldGetter = (item) => item) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return null;
    if (arr1.length === 0 || arr2.length === 0) return null;
    
    for (const item1 of arr1) {
        const val1 = fieldGetter(item1);
        if (!val1) continue;
        
        for (const item2 of arr2) {
            const val2 = fieldGetter(item2);
            if (!val2) continue;
            
            if (typeof val1 === 'string' && typeof val2 === 'string') {
                const sim = stringSimilarity(val1, val2);
                if (sim > 0.8) return { value: val1, similarity: sim };
            } else if (val1 === val2) {
                return { value: val1, similarity: 1.0 };
            }
        }
    }
    return null;
}

/**
 * COMPREHENSIVE LINKAGE DETECTION
 * Checks EVERY possible field for connections
 */
async function detectComprehensiveLinkages(profile1, profile2) {
    if (profile1._id.equals(profile2._id)) return null;
    
    const linkages = [];
    const matchedFields = [];
    let totalSuspicion = 0;

    // ═══════════════════════════════════════════════════════
    // 1. CONTACT INFORMATION (Weight: 30%)
    // ═══════════════════════════════════════════════════════
    let contactScore = 0, contactCount = 0;

    // Phone
    if (profile1.phone && profile2.phone && profile1.phone === profile2.phone) {
        contactScore += 100;
        contactCount++;
        matchedFields.push({ field: 'Phone', value: profile1.phone, sim: 1.0 });
    }

    // IMEI
    const imei1 = Array.isArray(profile1.imeiNumbers) ? profile1.imeiNumbers : 
                  profile1.imeiNumbers ? [profile1.imeiNumbers] : [];
    const imei2 = Array.isArray(profile2.imeiNumbers) ? profile2.imeiNumbers : 
                  profile2.imeiNumbers ? [profile2.imeiNumbers] : [];
    const commonIMEI = imei1.filter(i => imei2.includes(i));
    if (commonIMEI.length > 0) {
        contactScore += 100;
        contactCount++;
        matchedFields.push({ field: 'IMEI', value: commonIMEI[0], sim: 1.0 });
    }

    // Email
    if (profile1.email && profile2.email && profile1.email.toLowerCase() === profile2.email.toLowerCase()) {
        contactScore += 95;
        contactCount++;
        matchedFields.push({ field: 'Email', value: profile1.email, sim: 1.0 });
    }

    // WhatsApp
    if (profile1.whatsapp && profile2.whatsapp && profile1.whatsapp === profile2.whatsapp) {
        contactScore += 90;
        contactCount++;
        matchedFields.push({ field: 'WhatsApp', value: profile1.whatsapp, sim: 1.0 });
    }

    // Facebook, Instagram, Telegram, YouTube
    const socialPlatforms = ['facebook', 'instagram', 'telegram', 'youtube'];
    for (const platform of socialPlatforms) {
        if (profile1[platform] && profile2[platform]) {
            const sim = stringSimilarity(profile1[platform], profile2[platform]);
            if (sim > 0.8) {
                contactScore += 85 * sim;
                contactCount++;
                matchedFields.push({ field: platform.toUpperCase(), value: profile1[platform], sim });
            }
        }
    }

    // UPI
    if (profile1.upi && profile2.upi && profile1.upi === profile2.upi) {
        contactScore += 95;
        contactCount++;
        matchedFields.push({ field: 'UPI', value: profile1.upi, sim: 1.0 });
    }

    if (contactCount > 0) {
        const avgContact = contactScore / contactCount;
        if (avgContact > 50) {
            linkages.push({ type: 'Contact', score: avgContact, suspicion: avgContact * 0.3 });
            totalSuspicion += avgContact * 0.3;
        }
    }

    // ═══════════════════════════════════════════════════════
    // 2. LOCATION & ADDRESS (Weight: 25%)
    // ═══════════════════════════════════════════════════════
    let locationScore = 0, locationCount = 0;

    // Present Address
    if (profile1.presentAddress && profile2.presentAddress) {
        const sim = stringSimilarity(profile1.presentAddress, profile2.presentAddress);
        if (sim > 0.7) {
            locationScore += sim * 100;
            locationCount++;
            matchedFields.push({ field: 'Present Address', value: profile1.presentAddress, sim });
        }
    }

    // Permanent Address
    if (profile1.permanentAddress && profile2.permanentAddress) {
        const sim = stringSimilarity(profile1.permanentAddress, profile2.permanentAddress);
        if (sim > 0.7) {
            locationScore += sim * 95;
            locationCount++;
            matchedFields.push({ field: 'Permanent Address', value: profile1.permanentAddress, sim });
        }
    }

    // GPS Coordinates
    if (profile1.houseGPS && profile2.houseGPS) {
        const dist = gpsDistance(profile1.houseGPS, profile2.houseGPS);
        if (dist < 1) {
            const sim = Math.max(0, 1 - (dist / 1));
            locationScore += sim * 100;
            locationCount++;
            matchedFields.push({ field: 'House GPS (< 1km)', value: `${dist.toFixed(2)}km apart`, sim });
        }
    }

    if (profile1.workGPS && profile2.workGPS) {
        const dist = gpsDistance(profile1.workGPS, profile2.workGPS);
        if (dist < 2) {
            const sim = Math.max(0, 1 - (dist / 2));
            locationScore += sim * 85;
            locationCount++;
            matchedFields.push({ field: 'Work GPS', value: `${dist.toFixed(2)}km apart`, sim });
        }
    }

    // Hideouts
    if (profile1.hideouts && profile2.hideouts) {
        const sim = stringSimilarity(profile1.hideouts, profile2.hideouts);
        if (sim > 0.6) {
            locationScore += sim * 90;
            locationCount++;
            matchedFields.push({ field: 'Hideouts', value: profile1.hideouts, sim });
        }
    }

    // Place of Birth
    if (profile1.placeOfBirth && profile2.placeOfBirth) {
        const sim = stringSimilarity(profile1.placeOfBirth, profile2.placeOfBirth);
        if (sim > 0.8) {
            locationScore += sim * 70;
            locationCount++;
            matchedFields.push({ field: 'Place of Birth', value: profile1.placeOfBirth, sim });
        }
    }

    // Properties
    if (profile1.properties && profile2.properties) {
        const sim = stringSimilarity(profile1.properties, profile2.properties);
        if (sim > 0.7) {
            locationScore += sim * 75;
            locationCount++;
            matchedFields.push({ field: 'Properties', value: profile1.properties, sim });
        }
    }

    // Whereabouts
    if (profile1.whereabouts && profile2.whereabouts) {
        const sim = stringSimilarity(profile1.whereabouts, profile2.whereabouts);
        if (sim > 0.7) {
            locationScore += sim * 80;
            locationCount++;
            matchedFields.push({ field: 'Whereabouts', value: profile1.whereabouts, sim });
        }
    }

    if (locationCount > 0) {
        const avgLocation = locationScore / locationCount;
        if (avgLocation > 50) {
            linkages.push({ type: 'Location', score: avgLocation, suspicion: avgLocation * 0.25 });
            totalSuspicion += avgLocation * 0.25;
        }
    }

    // ═══════════════════════════════════════════════════════
    // 3. FAMILY & ASSOCIATES (Weight: 20%)
    // ═══════════════════════════════════════════════════════
    let familyScore = 0, familyCount = 0;

    // Father
    if (profile1.father && profile2.father) {
        const sim = stringSimilarity(profile1.father, profile2.father);
        if (sim > 0.85) {
            familyScore += sim * 100;
            familyCount++;
            matchedFields.push({ field: 'Father', value: profile1.father, sim });
        }
    }

    // Mother
    if (profile1.mother && profile2.mother) {
        const sim = stringSimilarity(profile1.mother, profile2.mother);
        if (sim > 0.85) {
            familyScore += sim * 100;
            familyCount++;
            matchedFields.push({ field: 'Mother', value: profile1.mother, sim });
        }
    }

    // Guardian
    if (profile1.guardian && profile2.guardian) {
        const sim = stringSimilarity(profile1.guardian, profile2.guardian);
        if (sim > 0.8) {
            familyScore += sim * 90;
            familyCount++;
            matchedFields.push({ field: 'Guardian', value: profile1.guardian, sim });
        }
    }

    // Siblings
    const siblingFields = ['brothers', 'sisters'];
    for (const field of siblingFields) {
        if (profile1[field] && profile2[field]) {
            const sim = stringSimilarity(profile1[field], profile2[field]);
            if (sim > 0.7) {
                familyScore += sim * 85;
                familyCount++;
                matchedFields.push({ field: field.charAt(0).toUpperCase() + field.slice(1), value: profile1[field], sim });
            }
        }
    }

    // Extended Family
    const extendedFields = ['uncles', 'aunts', 'wives', 'relativesWifeSide', 'relationsAbroad', 'relationsIndia'];
    for (const field of extendedFields) {
if (profile1[field] && profile2[field]) {
            const sim = stringSimilarity(profile1[field], profile2[field]);
            if (sim > 0.7) {
                familyScore += sim * 75;
                familyCount++;
                matchedFields.push({ field: field.replace(/([A-Z])/g, ' $1').trim(), value: profile1[field], sim });
            }
        }
    }

    // Close Friends
    if (profile1.closeFriends && profile2.closeFriends) {
        const sim = stringSimilarity(profile1.closeFriends, profile2.closeFriends);
        if (sim > 0.7) {
            familyScore += sim * 80;
            familyCount++;
            matchedFields.push({ field: 'Close Friends', value: profile1.closeFriends, sim });
        }
    }

    // Close Associates
    if (Array.isArray(profile1.closeAssociates) && Array.isArray(profile2.closeAssociates)) {
        const match = checkArrayMatch(profile1.closeAssociates, profile2.closeAssociates, (a) => a.name);
        if (match) {
            familyScore += 90 * match.similarity;
            familyCount++;
            matchedFields.push({ field: 'Close Associate', value: match.value, sim: match.similarity });
        }
    }

    // Associates Abroad / India
    if (profile1.associatesAbroad && profile2.associatesAbroad) {
        const sim = stringSimilarity(profile1.associatesAbroad, profile2.associatesAbroad);
        if (sim > 0.7) {
            familyScore += sim * 85;
            familyCount++;
            matchedFields.push({ field: 'Associates Abroad', value: profile1.associatesAbroad, sim });
        }
    }

    if (familyCount > 0) {
        const avgFamily = familyScore / familyCount;
        if (avgFamily > 50) {
            linkages.push({ type: 'Family', score: avgFamily, suspicion: avgFamily * 0.2 });
            totalSuspicion += avgFamily * 0.2;
        }
    }

    // ═══════════════════════════════════════════════════════
    // 4. IDENTITY DOCUMENTS (Weight: 15%)
    // ═══════════════════════════════════════════════════════
    let identityScore = 0, identityCount = 0;

    const idFields = ['aadhar', 'pan', 'dl', 'passport', 'voter', 'ration', 'creditCard'];
    for (const field of idFields) {
        if (profile1[field] && profile2[field] && profile1[field] === profile2[field]) {
            identityScore += 100;
            identityCount++;
            matchedFields.push({ field: field.toUpperCase() + ' (CRITICAL)', value: profile1[field], sim: 1.0 });
        }
    }

    // Bank Details
    if (profile1.bankDetails && profile2.bankDetails) {
        const sim = stringSimilarity(profile1.bankDetails, profile2.bankDetails);
        if (sim > 0.8) {
            identityScore += sim * 95;
            identityCount++;
            matchedFields.push({ field: 'Bank Details', value: profile1.bankDetails, sim });
        }
    }

    // Fingerprint
    if (profile1.fingerPrint && profile2.fingerPrint && profile1.fingerPrint === profile2.fingerPrint) {
        identityScore += 100;
        identityCount++;
        matchedFields.push({ field: 'Fingerprint (CRITICAL)', value: 'Match', sim: 1.0 });
    }

    // Advocate
    if (profile1.advocate && profile2.advocate) {
        const sim = stringSimilarity(profile1.advocate, profile2.advocate);
        if (sim > 0.8) {
            identityScore += sim * 70;
            identityCount++;
            matchedFields.push({ field: 'Advocate', value: profile1.advocate, sim });
        }
    }

    if (identityCount > 0) {
        const avgIdentity = identityScore / identityCount;
        if (avgIdentity > 40) {
            linkages.push({ type: 'Identity', score: avgIdentity, suspicion: avgIdentity * 0.15 });
            totalSuspicion += avgIdentity * 0.15;
        }
    }

    // ═══════════════════════════════════════════════════════
    // 5. ACTIVITY & ORGANIZATION (Weight: 10%)
    // ═══════════════════════════════════════════════════════
    let activityScore = 0, activityCount = 0;

    // Organizations
    const org1 = profile1.presentOrg || profile1.presentOrganization || '';
    const org2 = profile2.presentOrg || profile2.presentOrganization || '';
    if (org1 && org2) {
        const sim = stringSimilarity(org1, org2);
        if (sim > 0.8) {
            activityScore += sim * 90;
            activityCount++;
            matchedFields.push({ field: 'Organization', value: org1, sim });
        }
    }

    // Previous Organization
    const prevOrg1 = profile1.prevOrg || profile1.prevOrganization || '';
    const prevOrg2 = profile2.prevOrg || profile2.prevOrganization || '';
    if (prevOrg1 && prevOrg2) {
        const sim = stringSimilarity(prevOrg1, prevOrg2);
        if (sim > 0.8) {
            activityScore += sim * 80;
            activityCount++;
            matchedFields.push({ field: 'Previous Organization', value: prevOrg1, sim });
        }
    }

    // Religious Activities
    if (profile1.religiousActivities && profile2.religiousActivities) {
        const sim = stringSimilarity(profile1.religiousActivities, profile2.religiousActivities);
        if (sim > 0.7) {
            activityScore += sim * 75;
            activityCount++;
            matchedFields.push({ field: 'Religious Activities', value: profile1.religiousActivities, sim });
        }
    }

    // Illegal Activities
    if (profile1.illegalActivities && profile2.illegalActivities) {
        const sim = stringSimilarity(profile1.illegalActivities, profile2.illegalActivities);
        if (sim > 0.6) {
            activityScore += sim * 95;
            activityCount++;
            matchedFields.push({ field: 'Illegal Activities (HIGH RISK)', value: profile1.illegalActivities, sim });
        }
    }

    // Main Financier
    if (profile1.mainFinancier && profile2.mainFinancier) {
        const sim = stringSimilarity(profile1.mainFinancier, profile2.mainFinancier);
        if (sim > 0.8) {
            activityScore += sim * 90;
            activityCount++;
            matchedFields.push({ field: 'Main Financier', value: profile1.mainFinancier, sim });
        }
    }

    // Guides / Smuggling
    if (profile1.guides && profile2.guides) {
        const sim = stringSimilarity(profile1.guides, profile2.guides);
        if (sim > 0.7) {
            activityScore += sim * 85;
            activityCount++;
            matchedFields.push({ field: 'Guides/Contacts', value: profile1.guides, sim });
        }
    }

    // Vehicles
    if (profile1.vehicles && profile2.vehicles) {
        const sim = stringSimilarity(profile1.vehicles, profile2.vehicles);
        if (sim > 0.7) {
            activityScore += sim * 70;
            activityCount++;
            matchedFields.push({ field: 'Vehicles', value: profile1.vehicles, sim });
        }
    }

    // Countries Visited
    if (profile1.countriesVisited && profile2.countriesVisited) {
        const sim = stringSimilarity(profile1.countriesVisited, profile2.countriesVisited);
        if (sim > 0.6) {
            activityScore += sim * 75;
            activityCount++;
            matchedFields.push({ field: 'Countries Visited', value: profile1.countriesVisited, sim });
        }
    }

    // Jail Activities / Associates
    const jailFields = ['jailActivities', 'associatesJail'];
    for (const field of jailFields) {
        if (profile1[field] && profile2[field]) {
            const sim = stringSimilarity(profile1[field], profile2[field]);
            if (sim > 0.7) {
                activityScore += sim * 85;
                activityCount++;
                matchedFields.push({ field: field.replace(/([A-Z])/g, ' $1').trim(), value: profile1[field], sim });
            }
        }
    }

    if (activityCount > 0) {
        const avgActivity = activityScore / activityCount;
        if (avgActivity > 40) {
            linkages.push({ type: 'Activity', score: avgActivity, suspicion: avgActivity * 0.1 });
            totalSuspicion += avgActivity * 0.1;
        }
    }

    // ═══════════════════════════════════════════════════════
    // FINAL LINKAGE CALCULATION
    // ═══════════════════════════════════════════════════════
    if (linkages.length === 0) return null;

    const strongest = linkages.reduce((max, link) => link.score > max.score ? link : max, linkages[0]);
    
    return {
        profile1: profile1._id,
        profile2: profile2._id,
        connectionType: strongest.type,
        matchedFields: matchedFields.slice(0, 10), // Top 10 matches
        strength: Math.min(100, strongest.score),
        suspicionScore: Math.min(100, totalSuspicion),
        details: `${linkages.length} connection type(s): ${linkages.map(l => l.type).join(', ')}`,
        lastAnalyzed: new Date(),
        isActive: true
    };
}

/**
 * Analyze all profiles
 */
async function analyzeAllProfiles() {
    console.log('🔍 [DEEP SCAN] Starting comprehensive linkage analysis...');
    
    try {
        const profiles = await Profile.find({ isActive: true }).lean();
        console.log(`📊 Analyzing ${profiles.length} profiles across ALL fields...`);
        
        let totalLinkages = 0;
        
        for (let i = 0; i < profiles.length; i++) {
            for (let j = i + 1; j < profiles.length; j++) {
                const linkageData = await detectComprehensiveLinkages(profiles[i], profiles[j]);
                
                if (linkageData) {
                    await Linkage.findOneAndUpdate(
                        {
                            $or: [
                                { profile1: linkageData.profile1, profile2: linkageData.profile2 },
                                { profile1: linkageData.profile2, profile2: linkageData.profile1 }
                            ]
                        },
                        linkageData,
                        { upsert: true, new: true }
                    );
                    totalLinkages++;
                }
            }
            
            if ((i + 1) % 50 === 0) {
                console.log(`✓ Processed ${i + 1}/${profiles.length} profiles`);
            }
        }
        
        // Update suspicion scores
        await updateProfileSuspicionScores();
        
        console.log(`✅ [DEEP SCAN] Complete! Found ${totalLinkages} linkages.`);
        return { success: true, totalLinkages, profilesAnalyzed: profiles.length };
        
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

/**
 * Update suspicion scores
 */
async function updateProfileSuspicionScores() {
    const profiles = await Profile.find({ isActive: true });
    
    for (const profile of profiles) {
            const linkages = await Linkage.find({
            $or: [{ profile1: profile._id }, { profile2: profile._id }],
            isActive: true
        })
        .populate('profile1', 'name')
        .populate('profile2', 'name');
        
        if (linkages.length === 0) {
            profile.suspicionScore = 0;
            profile.isSuspicious = false;
            profile.linkageCount = 0;
            profile.suspicionReasons = [];
        } else {
            const avgSuspicion = linkages.reduce((sum, l) => sum + l.suspicionScore, 0) / linkages.length;
            const maxSuspicion = Math.max(...linkages.map(l => l.suspicionScore));
            
            profile.suspicionScore = Math.round((avgSuspicion * 0.3) + (maxSuspicion * 0.7));
            profile.isSuspicious = profile.suspicionScore > 30;
            profile.linkageCount = linkages.length;
            profile.lastAnalyzed = new Date();
            
            profile.suspicionReasons = linkages
                .filter(l => l.suspicionScore > 40)
                .map(l => {
                    const otherName = (l.profile1?._id || l.profile1).toString() === profile._id.toString() 
                        ? l.profile2?.name || 'Unknown' 
                        : l.profile1?.name || 'Unknown';
                    return `${l.connectionType} linkage with ${otherName} (${l.strength.toFixed(0)}%)`;
                })
                .slice(0, 5);
        }
        
        await profile.save();
    }
}

/**
 * Get network data
 */
async function getProfileNetwork(profileId, maxDepth = 2) {
    const nodes = new Map();
    const links = [];
    const visited = new Set();
    
    async function exploreNode(currentId, depth) {
        if (depth > maxDepth || visited.has(currentId.toString())) return;
        visited.add(currentId.toString());
        
        const profile = await Profile.findById(currentId).lean();
        if (!profile) return;
        
        nodes.set(currentId.toString(), {
            id: currentId.toString(),
            name: profile.name,
            suspicionScore: profile.suspicionScore || 0,
            linkageCount: profile.linkageCount || 0,
            radicalizationLevel: profile.radicalizationLevel
        });
        
        const linkages = await Linkage.find({
            $or: [{ profile1: currentId }, { profile2: currentId }],
            isActive: true,
            strength: { $gte: 50 }
        }).lean();
        
        for (const linkage of linkages) {
            const otherId = linkage.profile1.equals(currentId) ? linkage.profile2 : linkage.profile1;
            
            links.push({
                source: linkage.profile1.toString(),
                target: linkage.profile2.toString(),
                strength: linkage.strength,
                type: linkage.connectionType,
                suspicion: linkage.suspicionScore
            });
            
            if (depth < maxDepth) {
                await exploreNode(otherId, depth + 1);
            }
        }
    }
    
    await exploreNode(profileId, 0);
    
    return {
        nodes: Array.from(nodes.values()),
        links: links
    };
}

module.exports = {
    detectComprehensiveLinkages,
    analyzeAllProfiles,
    updateProfileSuspicionScores,
    getProfileNetwork
};
