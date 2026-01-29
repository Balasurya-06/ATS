const http = require('http');

// Simple fetch implementation for testing if node-fetch is missing
function simpleFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {},
        };

        const req = http.request(requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = data ? JSON.parse(data) : {};
                    resolve({
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        status: res.statusCode,
                        json: () => Promise.resolve(parsedData),
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        status: res.statusCode,
                        text: () => Promise.resolve(data),
                        json: () => Promise.reject(e)
                    });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (options.body) {
            req.write(options.body);
        }
        req.end();
    });
}

const BASE_URL = 'http://localhost:3001';
const PIN = '2815'; // Default PIN from server.js

async function testAPIs() {
    console.log('🧪 Starting API Tests...');

    try {
        // 1. Health Check
        console.log('\n1️⃣  Testing Health Endpoint...');
        const healthRes = await simpleFetch(`${BASE_URL}/health`);
        if (healthRes.ok) {
            const healthData = await healthRes.json();
            console.log('✅ Health Check Passed:', healthData.message);
        } else {
            console.error('❌ Health Check Failed:', healthRes.status);
            return;
        }

const NETWORK_KEY = 'ACCUST_NETWORK_ACCESS_KEY_CHANGE_IN_PRODUCTION_2025_SECRET';

        // 2. Auth Login
        console.log('\n2️⃣  Testing Login (POST /api/auth/login)...');
        const loginRes = await simpleFetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-Network-Key': NETWORK_KEY
            },
            body: JSON.stringify({ pin: PIN })
        });

        let token = null;
        if (loginRes.ok) {
            const loginData = await loginRes.json();
            console.log('✅ Login Passed');
            token = loginData.data ? loginData.data.token : loginData.token;
            console.log('🔑 Token received:', token ? 'Yes' : 'No');
        } else {
            console.error('❌ Login Failed:', loginRes.status);
            const err = await loginRes.json().catch(() => ({}));
            console.error('   Error:', err.message);
            return;
        }

        if (!token) {
            console.error('❌ No token received, stopping tests.');
            return;
        }

        const authHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Network-Key': NETWORK_KEY
        };

        // 3. Get Stats
        console.log('\n3️⃣  Testing Get Stats (GET /api/stats)...');
        const statsRes = await simpleFetch(`${BASE_URL}/api/stats`, {
            headers: authHeaders
        });

        if (statsRes.ok) {
            const statsData = await statsRes.json();
            console.log('✅ Get Stats Passed');
            console.log('   Stats keys:', Object.keys(statsData));
        } else {
            console.error('❌ Get Stats Failed:', statsRes.status);
        }

        // 4. Get Profiles
        console.log('\n4️⃣  Testing Get Profiles (GET /api/profiles)...');
        const profilesRes = await simpleFetch(`${BASE_URL}/api/profiles?page=1&limit=10`, {
            headers: authHeaders
        });

        if (profilesRes.ok) {
            const profilesData = await profilesRes.json();
            console.log('✅ Get Profiles Passed');
            console.log('   Profiles count:', profilesData.docs ? profilesData.docs.length : 'N/A');
        } else {
            console.error('❌ Get Profiles Failed:', profilesRes.status);
        }
        
        console.log('\n🎉 All tests completed.');

    } catch (error) {
        console.error('❌ Test Script Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('   Ensure the backend server is running on port 3001!');
        }
    }
}

testAPIs();
