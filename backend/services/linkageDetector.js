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
 * Checks EVERY possible field for connections using correct schema paths
 */
async function detectComprehensiveLinkages(profile1, profile2) {
    if (profile1._id.equals(profile2._id)) return null;
    
    // Helper: flatten object to readable string (avoids raw JSON display)
    const flattenToString = (val) => {
        if (val == null) return '';
        if (typeof val !== 'object') return String(val);
        if (Array.isArray(val)) return val.map(flattenToString).filter(Boolean).join(', ');
        // For plain objects, join key:value pairs in human-readable format
        return Object.entries(val)
            .filter(([k, v]) => v && String(v).trim() !== '' && String(v).trim() !== '-' && String(v).trim().toLowerCase() !== 'nil' && k !== '_id' && k !== '__v')
            .map(([k, v]) => `${k}: ${typeof v === 'object' ? flattenToString(v) : v}`)
            .join(', ');
    };

    // Helper to create matched field with proper schema format
    const addMatch = (field, val1, val2, sim) => {
        const strVal1 = typeof val1 === 'object' ? flattenToString(val1) : String(val1 || '');
        const strVal2 = typeof val2 === 'object' ? flattenToString(val2) : String(val2 || '');
        return { field, value1: strVal1, value2: strVal2, similarity: sim };
    };

    // List of values that should be treated as empty/missing
    const EMPTY_VALUES = ['', '-', '--', 'nil', 'n/a', 'na', 'none', 'null', 'undefined', 'not available', 'not known', 'nk'];
    const isEmptyValue = (val) => {
        if (val == null) return true;
        if (typeof val === 'string') return EMPTY_VALUES.includes(val.trim().toLowerCase());
        if (typeof val === 'object' && !Array.isArray(val)) {
            // Object is empty if all its values are empty
            return Object.values(val).every(v => isEmptyValue(v));
        }
        return false;
    };

    // Helper to safely get nested values
    const get = (obj, path) => {
        if (!obj) return undefined;
        const parts = path.split('.');
        let val = obj;
        for (const p of parts) {
            if (val == null) return undefined;
            val = val[p];
        }
        if (isEmptyValue(val)) return undefined;
        return val;
    };

    // Helper to build full address string from nested address object
    const buildAddressStr = (addr) => {
        if (!addr) return '';
        const parts = [addr.doorNo, addr.streetName, addr.villageWard, addr.district, addr.statePinCode].filter(Boolean);
        return parts.join(', ');
    };

    // Helper to extract all phone numbers from a string
    const extractPhones = (str) => {
        if (!str) return [];
        return String(str).match(/\d{10,}/g) || [];
    };

    // Helper to extract names from a comma/semicolon separated string
    const extractNames = (str) => {
        if (!str) return [];
        return String(str).split(/[,;]/).map(s => s.replace(/\(.*?\)/g, '').trim().toLowerCase()).filter(s => s.length > 2);
    };
    
    const linkages = [];
    const matchedFields = [];
    let totalSuspicion = 0;

    // ============================================================
    // 0. CO-ACCUSED & CASE MATCHING (Weight: 35%) - CRITICAL
    // ============================================================
    let caseScore = 0, caseCount = 0;

    // Check if one profile's name appears in the other's co-accused list
    const coAccused1 = get(profile1, 'arrestDetails.coAccused') || '';
    const coAccused2 = get(profile2, 'arrestDetails.coAccused') || '';
    const name1 = (profile1.name || '').toLowerCase();
    const name2 = (profile2.name || '').toLowerCase();

    if (coAccused1 && name2) {
        const coNames1 = extractNames(coAccused1);
        for (const coName of coNames1) {
            if (coName.includes(name2) || name2.includes(coName) || stringSimilarity(coName, name2) > 0.7) {
                caseScore += 100;
                caseCount++;
                matchedFields.push(addMatch('Co-Accused (CRITICAL)', profile2.name, coAccused1, 1.0));
                break;
            }
        }
    }

    if (coAccused2 && name1) {
        const coNames2 = extractNames(coAccused2);
        for (const coName of coNames2) {
            if (coName.includes(name1) || name1.includes(coName) || stringSimilarity(coName, name1) > 0.7) {
                caseScore += 100;
                caseCount++;
                matchedFields.push(addMatch('Co-Accused (CRITICAL)', profile1.name, coAccused2, 1.0));
                break;
            }
        }
    }

    // Check if profile names appear in each other's close associates
    const associates1 = Array.isArray(profile1.closeAssociates) ? profile1.closeAssociates : [];
    const associates2 = Array.isArray(profile2.closeAssociates) ? profile2.closeAssociates : [];

    for (const assoc of associates1) {
        if (assoc.name && name2) {
            const assocName = assoc.name.toLowerCase();
            if (assocName.includes(name2) || name2.includes(assocName) || stringSimilarity(assocName, name2) > 0.65) {
                caseScore += 95;
                caseCount++;
                matchedFields.push(addMatch('Named Associate (CRITICAL)', profile2.name, assoc.name, 0.95));
                break;
            }
        }
    }

    for (const assoc of associates2) {
        if (assoc.name && name1) {
            const assocName = assoc.name.toLowerCase();
            if (assocName.includes(name1) || name1.includes(assocName) || stringSimilarity(assocName, name1) > 0.65) {
                caseScore += 95;
                caseCount++;
                matchedFields.push(addMatch('Named Associate (CRITICAL)', profile1.name, assoc.name, 0.95));
                break;
            }
        }
    }

    // Cross-match close associates between profiles
    if (associates1.length > 0 && associates2.length > 0) {
        for (const a1 of associates1) {
            for (const a2 of associates2) {
                if (a1.name && a2.name) {
                    const sim = stringSimilarity(a1.name, a2.name);
                    if (sim > 0.7) {
                        caseScore += 85 * sim;
                        caseCount++;
                        matchedFields.push(addMatch('Shared Associate', a1.name, a2.name, sim));
                    }
                }
                // Phone match between associates
                if (a1.phone && a2.phone) {
                    const phones1 = extractPhones(a1.phone);
                    const phones2 = extractPhones(a2.phone);
                    const commonPhones = phones1.filter(p => phones2.includes(p));
                    if (commonPhones.length > 0) {
                        caseScore += 90;
                        caseCount++;
                        matchedFields.push(addMatch('Associate Phone Match', a1.phone, a2.phone, 1.0));
                    }
                }
            }
        }
    }

    // Case Particulars matching (same crime numbers / case numbers)
    const cases1 = Array.isArray(profile1.caseParticulars) ? profile1.caseParticulars : [];
    const cases2 = Array.isArray(profile2.caseParticulars) ? profile2.caseParticulars : [];

    for (const c1 of cases1) {
        for (const c2 of cases2) {
            if (c1.crimeNo && c2.crimeNo) {
                const sim = stringSimilarity(c1.crimeNo, c2.crimeNo);
                if (sim > 0.8) {
                    caseScore += 100;
                    caseCount++;
                    matchedFields.push(addMatch('Same Case/Crime No (CRITICAL)', c1.crimeNo, c2.crimeNo, sim));
                }
            }
            if (c1.caseNo && c2.caseNo) {
                const sim = stringSimilarity(c1.caseNo, c2.caseNo);
                if (sim > 0.8) {
                    caseScore += 95;
                    caseCount++;
                    matchedFields.push(addMatch('Same Court Case No', c1.caseNo, c2.caseNo, sim));
                }
            }
            if (c1.policeStation && c2.policeStation) {
                const sim = stringSimilarity(c1.policeStation, c2.policeStation);
                if (sim > 0.8) {
                    caseScore += 70;
                    caseCount++;
                    matchedFields.push(addMatch('Same PS in Cases', c1.policeStation, c2.policeStation, sim));
                }
            }
            if (c1.section && c2.section) {
                const sim = stringSimilarity(c1.section, c2.section);
                if (sim > 0.7) {
                    caseScore += 75;
                    caseCount++;
                    matchedFields.push(addMatch('Same Section of Law', c1.section, c2.section, sim));
                }
            }
        }
    }

    // Arrest details - Crime No matching
    const crime1 = get(profile1, 'arrestDetails.crimeNoAndSec') || '';
    const crime2 = get(profile2, 'arrestDetails.crimeNoAndSec') || '';
    if (crime1 && crime2) {
        const sim = stringSimilarity(crime1, crime2);
        if (sim > 0.5) {
            caseScore += 90 * sim;
            caseCount++;
            matchedFields.push(addMatch('Arrest Crime/Section Match', crime1, crime2, sim));
        }
        const crimeNos1 = crime1.match(/\d+\/\d+/g) || [];
        const crimeNos2 = crime2.match(/\d+\/\d+/g) || [];
        const commonCrimes = crimeNos1.filter(c => crimeNos2.includes(c));
        if (commonCrimes.length > 0) {
            caseScore += 100;
            caseCount++;
            matchedFields.push(addMatch('Same Crime Number (CRITICAL)', commonCrimes.join(', '), commonCrimes.join(', '), 1.0));
        }
    }

    // Same police station of arrest
    const ps1 = get(profile1, 'arrestDetails.policeStation') || '';
    const ps2 = get(profile2, 'arrestDetails.policeStation') || '';
    if (ps1 && ps2) {
        const sim = stringSimilarity(ps1, ps2);
        if (sim > 0.6) {
            caseScore += 60 * sim;
            caseCount++;
            matchedFields.push(addMatch('Same Police Station', ps1, ps2, sim));
        }
    }

    if (caseCount > 0) {
        const avgCase = caseScore / caseCount;
        if (avgCase > 30) {
            linkages.push({ type: 'Associate', score: Math.min(100, avgCase), suspicion: Math.min(100, avgCase * 0.35) });
            totalSuspicion += avgCase * 0.35;
        }
    }

    // ============================================================
    // 1. CONTACT INFORMATION (Weight: 25%)
    // ============================================================
    let contactScore = 0, contactCount = 0;

    // Phone - extract all numbers and compare
    const phoneStr1 = get(profile1, 'phone') || '';
    const phoneStr2 = get(profile2, 'phone') || '';
    const allPhones1 = extractPhones(phoneStr1);
    const allPhones2 = extractPhones(phoneStr2);
    const commonPhonesMain = allPhones1.filter(p => allPhones2.includes(p));
    if (commonPhonesMain.length > 0) {
        contactScore += 100;
        contactCount++;
        matchedFields.push(addMatch('Phone', phoneStr1, phoneStr2, 1.0));
    }

    // Check if one profile's phone appears in the other's associate phones
    for (const assoc of associates1) {
        const assocPhones = extractPhones(assoc.phone);
        const matchPhone = assocPhones.filter(p => allPhones2.includes(p));
        if (matchPhone.length > 0) {
            contactScore += 90;
            contactCount++;
            matchedFields.push(addMatch('Phone in Associates', phoneStr2, assoc.phone, 0.9));
            break;
        }
    }
    for (const assoc of associates2) {
        const assocPhones = extractPhones(assoc.phone);
        const matchPhone = assocPhones.filter(p => allPhones1.includes(p));
        if (matchPhone.length > 0) {
            contactScore += 90;
            contactCount++;
            matchedFields.push(addMatch('Phone in Associates', phoneStr1, assoc.phone, 0.9));
            break;
        }
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
        matchedFields.push(addMatch('IMEI', commonIMEI[0], commonIMEI[0], 1.0));
    }

    // Social Media - using correct nested paths
    const sm1 = profile1.socialMedia || {};
    const sm2 = profile2.socialMedia || {};

    if (sm1.email && sm2.email && !isEmptyValue(sm1.email) && !isEmptyValue(sm2.email)) {
        const sim = stringSimilarity(sm1.email, sm2.email);
        if (sim > 0.8) {
            contactScore += 95 * sim;
            contactCount++;
            matchedFields.push(addMatch('Email', sm1.email, sm2.email, sim));
        }
    }

    // WhatsApp
    const wa1 = extractPhones(sm1.whatsapp);
    const wa2 = extractPhones(sm2.whatsapp);
    const commonWA = wa1.filter(w => wa2.includes(w));
    if (commonWA.length > 0) {
        contactScore += 90;
        contactCount++;
        matchedFields.push(addMatch('WhatsApp', sm1.whatsapp, sm2.whatsapp, 1.0));
    }

    // Facebook, Instagram, Telegram, YouTube
    const socialPlatforms = ['facebook', 'instagram', 'telegram', 'youtube'];
    for (const platform of socialPlatforms) {
        const v1 = sm1[platform];
        const v2 = sm2[platform];
        if (v1 && v2 && !isEmptyValue(v1) && !isEmptyValue(v2)) {
            const sim = stringSimilarity(v1, v2);
            if (sim > 0.8) {
                contactScore += 85 * sim;
                contactCount++;
                matchedFields.push(addMatch(platform.toUpperCase(), v1, v2, sim));
            }
        }
    }

    // UPI
    if (sm1.upi && sm2.upi && !isEmptyValue(sm1.upi) && !isEmptyValue(sm2.upi)) {
        const sim = stringSimilarity(sm1.upi, sm2.upi);
        if (sim > 0.8) {
            contactScore += 95 * sim;
            contactCount++;
            matchedFields.push(addMatch('UPI', sm1.upi, sm2.upi, sim));
        }
    }

    if (contactCount > 0) {
        const avgContact = contactScore / contactCount;
        if (avgContact > 40) {
            linkages.push({ type: 'Contact', score: Math.min(100, avgContact), suspicion: avgContact * 0.25 });
            totalSuspicion += avgContact * 0.25;
        }
    }

    // ============================================================
    // 2. LOCATION & ADDRESS (Weight: 20%)
    // ============================================================
    let locationScore = 0, locationCount = 0;

    // Present Address - compare profile1's present with profile2's present
    const presAddr1 = buildAddressStr(get(profile1, 'address.present'));
    const presAddr2 = buildAddressStr(get(profile2, 'address.present'));
    if (presAddr1 && presAddr2) {
        const sim = stringSimilarity(presAddr1, presAddr2);
        if (sim > 0.6) {
            locationScore += sim * 100;
            locationCount++;
            matchedFields.push(addMatch('Present Address', presAddr1, presAddr2, sim));
        }
    }

    // Permanent Address - compare profile1's permanent with profile2's permanent
    const permAddr1 = buildAddressStr(get(profile1, 'address.permanent'));
    const permAddr2 = buildAddressStr(get(profile2, 'address.permanent'));
    if (permAddr1 && permAddr2) {
        const sim = stringSimilarity(permAddr1, permAddr2);
        if (sim > 0.6) {
            locationScore += sim * 95;
            locationCount++;
            matchedFields.push(addMatch('Permanent Address', permAddr1, permAddr2, sim));
        }
    }

    // Same district
    const dist1 = get(profile1, 'address.present.district') || get(profile1, 'address.permanent.district');
    const dist2 = get(profile2, 'address.present.district') || get(profile2, 'address.permanent.district');
    if (dist1 && dist2) {
        const sim = stringSimilarity(dist1, dist2);
        if (sim > 0.8) {
            locationScore += sim * 65;
            locationCount++;
            matchedFields.push(addMatch('Same District', dist1, dist2, sim));
        }
    }

    // Same Police Station (from address)
    const addrPS1 = get(profile1, 'address.present.policeStation') || get(profile1, 'address.permanent.policeStation');
    const addrPS2 = get(profile2, 'address.present.policeStation') || get(profile2, 'address.permanent.policeStation');
    if (addrPS1 && addrPS2) {
        const sim = stringSimilarity(addrPS1, addrPS2);
        if (sim > 0.7) {
            locationScore += sim * 75;
            locationCount++;
            matchedFields.push(addMatch('Same Area PS', addrPS1, addrPS2, sim));
        }
    }

    // GPS Coordinates - using nested houseGPS.gpsLocation
    const gps1 = get(profile1, 'houseGPS.gpsLocation');
    const gps2 = get(profile2, 'houseGPS.gpsLocation');
    if (gps1 && gps2) {
        const parseGPS = (str) => {
            const latMatch = str.match(/lat\s*([\d.]+)/i);
            const lonMatch = str.match(/long?\s*([\d.]+)/i);
            if (latMatch && lonMatch) return latMatch[1] + ',' + lonMatch[1];
            return str;
        };
        const parsed1 = parseGPS(gps1);
        const parsed2 = parseGPS(gps2);
        const dist = gpsDistance(parsed1, parsed2);
        if (dist < 5) {
            const sim = Math.max(0, 1 - (dist / 5));
            locationScore += sim * 100;
            locationCount++;
            matchedFields.push(addMatch('House GPS (' + dist.toFixed(2) + 'km apart)', gps1, gps2, sim));
        }
    }

    // Workplace GPS
    const workGps1 = get(profile1, 'workplaceGPS.gpsLocation');
    const workGps2 = get(profile2, 'workplaceGPS.gpsLocation');
    if (workGps1 && workGps2) {
        const parseGPS = (str) => {
            const latMatch = str.match(/lat\s*([\d.]+)/i);
            const lonMatch = str.match(/long?\s*([\d.]+)/i);
            if (latMatch && lonMatch) return latMatch[1] + ',' + lonMatch[1];
            return str;
        };
        const parsed1 = parseGPS(workGps1);
        const parsed2 = parseGPS(workGps2);
        const dist = gpsDistance(parsed1, parsed2);
        if (dist < 5) {
            const sim = Math.max(0, 1 - (dist / 5));
            locationScore += sim * 85;
            locationCount++;
            matchedFields.push(addMatch('Work GPS (' + dist.toFixed(2) + 'km apart)', workGps1, workGps2, sim));
        }
    }

    // Hideouts
    const hideout1 = get(profile1, 'hideoutPlace') || get(profile1, 'hideouts');
    const hideout2 = get(profile2, 'hideoutPlace') || get(profile2, 'hideouts');
    if (hideout1 && hideout2) {
        const sim = stringSimilarity(hideout1, hideout2);
        if (sim > 0.6) {
            locationScore += sim * 90;
            locationCount++;
            matchedFields.push(addMatch('Hideouts', hideout1, hideout2, sim));
        }
    }

    // Place of Birth
    const pob1 = get(profile1, 'placeOfBirth');
    const pob2 = get(profile2, 'placeOfBirth');
    if (pob1 && pob2) {
        const sim = stringSimilarity(pob1, pob2);
        if (sim > 0.5) {
            locationScore += sim * 70;
            locationCount++;
            matchedFields.push(addMatch('Place of Birth', pob1, pob2, sim));
        }
    }

    // Whereabouts
    const where1 = get(profile1, 'whereabouts');
    const where2 = get(profile2, 'whereabouts');
    if (where1 && where2) {
        const sim = stringSimilarity(where1, where2);
        if (sim > 0.4) {
            locationScore += sim * 80;
            locationCount++;
            matchedFields.push(addMatch('Whereabouts', where1, where2, sim));
        }
    }

    if (locationCount > 0) {
        const avgLocation = locationScore / locationCount;
        if (avgLocation > 40) {
            linkages.push({ type: 'Location', score: Math.min(100, avgLocation), suspicion: avgLocation * 0.20 });
            totalSuspicion += avgLocation * 0.20;
        }
    }

    // ============================================================
    // 3. FAMILY & RELATIVES (Weight: 10%)
    // ============================================================
    let familyScore = 0, familyCount = 0;

    // Father - nested: family.father
    const father1 = get(profile1, 'family.father');
    const father2 = get(profile2, 'family.father');
    if (father1 && father2) {
        const sim = stringSimilarity(father1, father2);
        if (sim > 0.5) {
            familyScore += sim * 100;
            familyCount++;
            matchedFields.push(addMatch('Father', father1, father2, sim));
        }
    }

    // Mother - nested: family.mother
    const mother1 = get(profile1, 'family.mother');
    const mother2 = get(profile2, 'family.mother');
    if (mother1 && mother2) {
        const sim = stringSimilarity(mother1, mother2);
        if (sim > 0.5) {
            familyScore += sim * 100;
            familyCount++;
            matchedFields.push(addMatch('Mother', mother1, mother2, sim));
        }
    }

    // Guardian
    const guard1 = get(profile1, 'guardian');
    const guard2 = get(profile2, 'guardian');
    if (guard1 && guard2) {
        const sim = stringSimilarity(guard1, guard2);
        if (sim > 0.4) {
            familyScore += sim * 90;
            familyCount++;
            matchedFields.push(addMatch('Guardian', guard1, guard2, sim));
        }
    }

    // Siblings & family - nested: family.*
    const familyFieldsList = ['brothers', 'sisters', 'wives', 'closeFriends'];
    for (const field of familyFieldsList) {
        const v1 = get(profile1, 'family.' + field);
        const v2 = get(profile2, 'family.' + field);
        if (v1 && v2) {
            const sim = stringSimilarity(v1, v2);
            if (sim > 0.4) {
                familyScore += sim * 85;
                familyCount++;
                matchedFields.push(addMatch(field.charAt(0).toUpperCase() + field.slice(1), v1, v2, sim));
            }
        }
    }

    // Extended family
    const extFamilyFields = ['uncles', 'aunts'];
    for (const field of extFamilyFields) {
        const v1 = get(profile1, 'family.' + field);
        const v2 = get(profile2, 'family.' + field);
        if (v1 && v2) {
            const sim = stringSimilarity(v1, v2);
            if (sim > 0.5) {
                familyScore += sim * 75;
                familyCount++;
                matchedFields.push(addMatch(field.charAt(0).toUpperCase() + field.slice(1), v1, v2, sim));
            }
        }
    }

    // Wife-side relatives
    const wifeSideFields = ['fatherInLaw', 'motherInLaw', 'others'];
    for (const field of wifeSideFields) {
        const v1 = get(profile1, 'family.relativesWifeSide.' + field);
        const v2 = get(profile2, 'family.relativesWifeSide.' + field);
        if (v1 && v2) {
            const sim = stringSimilarity(v1, v2);
            if (sim > 0.5) {
                familyScore += sim * 70;
                familyCount++;
                matchedFields.push(addMatch('Wife Side: ' + field, v1, v2, sim));
            }
        }
    }

    // Relations abroad / India
    const relFields = ['relationsAbroad', 'relationsIndia', 'associatesAbroad', 'relativesSecurity'];
    for (const field of relFields) {
        const v1 = get(profile1, field);
        const v2 = get(profile2, field);
        if (v1 && v2) {
            const sim = stringSimilarity(v1, v2);
            if (sim > 0.4) {
                familyScore += sim * 75;
                familyCount++;
                matchedFields.push(addMatch(field, v1, v2, sim));
            }
        }
    }

    if (familyCount > 0) {
        const avgFamily = familyScore / familyCount;
        if (avgFamily > 40) {
            linkages.push({ type: 'Family', score: Math.min(100, avgFamily), suspicion: avgFamily * 0.10 });
            totalSuspicion += avgFamily * 0.10;
        }
    }

    // ============================================================
    // 4. IDENTITY DOCUMENTS (Weight: 5%)
    // ============================================================
    let identityScore = 0, identityCount = 0;

    // Identity cards - nested: identityCards.*
    const idFieldNames = ['aadhar', 'pan', 'drivingLicense', 'passport', 'voterId', 'rationCard', 'creditCard'];
    for (const field of idFieldNames) {
        const v1 = get(profile1, 'identityCards.' + field);
        const v2 = get(profile2, 'identityCards.' + field);
        if (v1 && v2) {
            const sim = stringSimilarity(v1, v2);
            if (sim > 0.7) {
                identityScore += 100;
                identityCount++;
                matchedFields.push(addMatch(field.toUpperCase() + ' Match (CRITICAL)', v1, v2, sim));
            }
        }
    }

    // Bank Details - nested object
    const bank1 = profile1.bankDetails;
    const bank2 = profile2.bankDetails;
    if (bank1 && bank2) {
        if (bank1.accountNo && bank2.accountNo && bank1.accountNo === bank2.accountNo) {
            identityScore += 100;
            identityCount++;
            matchedFields.push(addMatch('Bank Account (CRITICAL)', bank1.accountNo, bank2.accountNo, 1.0));
        }
        if (bank1.bankName && bank2.bankName) {
            const sim = stringSimilarity(bank1.bankName, bank2.bankName);
            if (sim > 0.8) {
                identityScore += 40 * sim;
                identityCount++;
                matchedFields.push(addMatch('Same Bank', bank1.bankName, bank2.bankName, sim));
            }
        }
    }

    // Advocate - nested: advocate.name
    const adv1 = get(profile1, 'advocate.name');
    const adv2 = get(profile2, 'advocate.name');
    if (adv1 && adv2) {
        const sim = stringSimilarity(adv1, adv2);
        if (sim > 0.5) {
            identityScore += sim * 80;
            identityCount++;
            matchedFields.push(addMatch('Same Advocate', adv1, adv2, sim));
        }
    }

    // Properties - compare sub-fields individually (movable, immovable, vehicles)
    const propsSubFields = ['movable', 'immovable', 'vehicles'];
    for (const pf of propsSubFields) {
        const pv1 = get(profile1, 'properties.' + pf);
        const pv2 = get(profile2, 'properties.' + pf);
        if (pv1 && pv2) {
            const sim = stringSimilarity(pv1, pv2);
            if (sim > 0.5) {
                identityScore += sim * 70;
                identityCount++;
                matchedFields.push(addMatch('Property: ' + pf.charAt(0).toUpperCase() + pf.slice(1), pv1, pv2, sim));
            }
        }
    }

    // Physical Description - only compare unique identifying marks (not generic fields like height/complexion)
    const idMarks1 = get(profile1, 'physicalDescription.identificationMarks');
    const idMarks2 = get(profile2, 'physicalDescription.identificationMarks');
    if (idMarks1 && idMarks2) {
        const sim = stringSimilarity(idMarks1, idMarks2);
        if (sim > 0.7) {
            identityScore += sim * 50;
            identityCount++;
            matchedFields.push(addMatch('Identification Marks', idMarks1, idMarks2, sim));
        }
    }

    // Advocate phone comparison
    const advPhone1 = get(profile1, 'advocate.phone');
    const advPhone2 = get(profile2, 'advocate.phone');
    if (advPhone1 && advPhone2) {
        const phones1 = extractPhones(advPhone1);
        const phones2 = extractPhones(advPhone2);
        const commonAdvPhones = phones1.filter(p => phones2.includes(p));
        if (commonAdvPhones.length > 0) {
            identityScore += 85;
            identityCount++;
            matchedFields.push(addMatch('Same Advocate Phone', advPhone1, advPhone2, 1.0));
        }
    }

    if (identityCount > 0) {
        const avgIdentity = identityScore / identityCount;
        if (avgIdentity > 30) {
            linkages.push({ type: 'Identity', score: Math.min(100, avgIdentity), suspicion: avgIdentity * 0.05 });
            totalSuspicion += avgIdentity * 0.05;
        }
    }

    // ============================================================
    // 5. ACTIVITY & ORGANIZATION (Weight: 5%)
    // ============================================================
    let activityScore = 0, activityCount = 0;

    // Organizations
    const org1 = get(profile1, 'presentOrganization') || '';
    const org2 = get(profile2, 'presentOrganization') || '';
    if (org1 && org2) {
        const sim = stringSimilarity(org1, org2);
        if (sim > 0.4) {
            activityScore += sim * 90;
            activityCount++;
            matchedFields.push(addMatch('Organization', org1, org2, sim));
        }
    }

    // Previous Organization
    const prevOrg1 = get(profile1, 'prevOrganization') || '';
    const prevOrg2 = get(profile2, 'prevOrganization') || '';
    if (prevOrg1 && prevOrg2) {
        const sim = stringSimilarity(prevOrg1, prevOrg2);
        if (sim > 0.4) {
            activityScore += sim * 80;
            activityCount++;
            matchedFields.push(addMatch('Previous Organization', prevOrg1, prevOrg2, sim));
        }
    }

    // Activities type / MO
    const act1 = get(profile1, 'activitiesType');
    const act2 = get(profile2, 'activitiesType');
    if (act1 && act2) {
        const sim = stringSimilarity(act1, act2);
        if (sim > 0.4) {
            activityScore += sim * 95;
            activityCount++;
            matchedFields.push(addMatch('Activities/MO', act1, act2, sim));
        }
    }

    // Religious Activities
    const rel1 = get(profile1, 'religiousActivities');
    const rel2 = get(profile2, 'religiousActivities');
    if (rel1 && rel2) {
        const sim = stringSimilarity(rel1, rel2);
        if (sim > 0.6) {
            activityScore += sim * 75;
            activityCount++;
            matchedFields.push(addMatch('Religious Activities', rel1, rel2, sim));
        }
    }

    // Illegal Activities
    const illegal1 = get(profile1, 'illegalActivities');
    const illegal2 = get(profile2, 'illegalActivities');
    if (illegal1 && illegal2) {
        const sim = stringSimilarity(illegal1, illegal2);
        if (sim > 0.4) {
            activityScore += sim * 95;
            activityCount++;
            matchedFields.push(addMatch('Illegal Activities (HIGH RISK)', illegal1, illegal2, sim));
        }
    }

    // Main Financier
    const fin1 = get(profile1, 'mainFinancier');
    const fin2 = get(profile2, 'mainFinancier');
    if (fin1 && fin2) {
        const sim = stringSimilarity(fin1, fin2);
        if (sim > 0.7) {
            activityScore += sim * 90;
            activityCount++;
            matchedFields.push(addMatch('Main Financier', fin1, fin2, sim));
        }
    }

    // Countries Visited
    const cv1 = get(profile1, 'countriesVisited');
    const cv2 = get(profile2, 'countriesVisited');
    if (cv1 && cv2) {
        const sim = stringSimilarity(cv1, cv2);
        if (sim > 0.5) {
            activityScore += sim * 75;
            activityCount++;
            matchedFields.push(addMatch('Countries Visited', cv1, cv2, sim));
        }
    }

    // Jail Activities / Associates
    const jailFields = ['jailActivities', 'associatesJail'];
    for (const field of jailFields) {
        const v1 = get(profile1, field);
        const v2 = get(profile2, field);
        if (v1 && v2) {
            const sim = stringSimilarity(v1, v2);
            if (sim > 0.6) {
                activityScore += sim * 85;
                activityCount++;
                matchedFields.push(addMatch(field, v1, v2, sim));
            }
        }
    }

    // Verified by same officer
    const ver1 = get(profile1, 'verifiedBy');
    const ver2 = get(profile2, 'verifiedBy');
    if (ver1 && ver2) {
        const sim = stringSimilarity(ver1, ver2);
        if (sim > 0.7) {
            activityScore += sim * 50;
            activityCount++;
            matchedFields.push(addMatch('Same Verifying Officer', ver1, ver2, sim));
        }
    }

    // Tags - only count if they have rare/specific tags in common (skip if all profiles share same tags)

    // Same interrogating agency
    const interr1 = get(profile1, 'interrogatedBy');
    const interr2 = get(profile2, 'interrogatedBy');
    if (interr1 && interr2) {
        const sim = stringSimilarity(interr1, interr2);
        if (sim > 0.7) {
            activityScore += sim * 60;
            activityCount++;
            matchedFields.push(addMatch('Same Interrogating Agency', interr1, interr2, sim));
        }
    }

    if (activityCount > 0) {
        const avgActivity = activityScore / activityCount;
        if (avgActivity > 30) {
            linkages.push({ type: 'Activity', score: Math.min(100, avgActivity), suspicion: avgActivity * 0.05 });
            totalSuspicion += avgActivity * 0.05;
        }
    }

    // ============================================================
    // FINAL LINKAGE CALCULATION
    // ============================================================
    if (linkages.length === 0) return null;

    const strongest = linkages.reduce((max, link) => link.score > max.score ? link : max, linkages[0]);
    
    const detailParts = linkages.map(l => l.type + '(' + l.score.toFixed(0) + '%)');
    
    return {
        profile1: profile1._id,
        profile2: profile2._id,
        connectionType: strongest.type,
        matchedFields: matchedFields.slice(0, 15),
        strength: Math.min(100, Math.round(strongest.score)),
        suspicionScore: Math.min(100, Math.round(totalSuspicion)),
        details: linkages.length + ' connection type(s): ' + detailParts.join(', ') + '. Top matches: ' + matchedFields.slice(0, 3).map(m => m.field).join(', '),
        lastAnalyzed: new Date(),
        isActive: true
    };
}

/**
 * Analyze all profiles
 */
async function analyzeAllProfiles() {
    console.log('ðŸ” [DEEP SCAN] Starting comprehensive linkage analysis...');
    
    try {
        const profiles = await Profile.find({ isActive: true }).lean();
        console.log(`ðŸ“Š Analyzing ${profiles.length} profiles across ALL fields...`);
        
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
                console.log(`âœ“ Processed ${i + 1}/${profiles.length} profiles`);
            }
        }
        
        // Update suspicion scores
        await updateProfileSuspicionScores();
        
        console.log(`âœ… [DEEP SCAN] Complete! Found ${totalLinkages} linkages.`);
        return { success: true, totalLinkages, profilesAnalyzed: profiles.length };
        
    } catch (error) {
        console.error('âŒ Error:', error);
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
            linkageCount: profile.linkageCount || 0
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









