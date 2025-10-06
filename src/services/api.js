/**
 * ACCUST Backend API Service
 * Secure communication layer with backend APIs
 * Ultra-secure implementation with all security protocols
 */

import config from '../config/config.js';

class APIService {
    constructor() {
        // Backend configuration
        this.baseURL = config.api.baseURL;
        this.networkKey = config.api.networkKey;
        this.token = null;
        
        // Security headers for all requests
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'X-Network-Key': this.networkKey,
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        };
    }

    /**
     * Set authentication token
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem(config.security.tokenStorageKey, token);
    }

    /**
     * Get authentication token
     */
    getToken() {
        if (!this.token) {
            this.token = localStorage.getItem(config.security.tokenStorageKey);
        }
        return this.token;
    }

    /**
     * Clear authentication
     */
    clearAuth() {
        this.token = null;
        localStorage.removeItem(config.security.tokenStorageKey);
    }

    /**
     * Get headers with authentication
     */
    getAuthHeaders() {
        const headers = { ...this.defaultHeaders };
        const token = this.getToken();
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    }

    /**
     * Make secure API request
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                ...this.getAuthHeaders(),
                ...options.headers
            }
        };
        // Remove Content-Type header for FormData bodies to allow browser to set proper boundary
        if (options.body instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        try {
            console.log(`🔐 API Request: ${options.method || 'GET'} ${endpoint}`);
            
            const response = await fetch(url, config);
            
            // Handle authentication errors
            if (response.status === 401) {
                this.clearAuth();
                throw new Error('Authentication required. Please login again.');
            }
            
            if (response.status === 403) {
                throw new Error('Access denied. Insufficient clearance level.');
            }
            
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait and try again.');
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`✅ API Response: ${options.method || 'GET'} ${endpoint} - Success`);
            
            return data;
            
        } catch (error) {
            console.error(`❌ API Error: ${options.method || 'GET'} ${endpoint} -`, error.message);
            throw error;
        }
    }

    /**
     * Authentication APIs
     */
    async login(pin) {
        const response = await this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ pin })
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async verifyToken() {
        return await this.makeRequest('/auth/verify');
    }

    async logout() {
        this.clearAuth();
        return { success: true };
    }

    /**
     * Profile Management APIs
     */
    async createProfile(profileData, files = {}) {
        const formData = new FormData();
        
        // Add profile data
        Object.keys(profileData).forEach(key => {
            if (profileData[key] !== undefined && profileData[key] !== null) {
                // Handle arrays/objects by converting to JSON strings
                if (Array.isArray(profileData[key]) || typeof profileData[key] === 'object') {
                    formData.append(key, JSON.stringify(profileData[key]));
                } else {
                    formData.append(key, profileData[key]);
                }
            }
        });
        
        // Add files - handle object format { front, back, side }
        if (files && typeof files === 'object') {
            if (files.front) formData.append('front', files.front);
            if (files.back) formData.append('back', files.back);
            if (files.side) formData.append('side', files.side);
        }
        
        // Remove Content-Type header for FormData (browser sets it automatically)
        const headers = { ...this.getAuthHeaders() };
        delete headers['Content-Type'];
        
        return await this.makeRequest('/profiles', {
            method: 'POST',
            headers,
            body: formData
        });
    }

    async getProfiles(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/profiles${queryString ? `?${queryString}` : ''}`;
        return await this.makeRequest(endpoint);
    }

    async getProfile(id) {
        return await this.makeRequest(`/profiles/${id}`);
    }

    async updateProfile(id, profileData, files = []) {
        const formData = new FormData();
        
        // Add profile data
        Object.keys(profileData).forEach(key => {
            if (profileData[key] !== undefined && profileData[key] !== null) {
                formData.append(key, profileData[key]);
            }
        });
        
        // Add files
        files.forEach((file, index) => {
            formData.append('photos', file);
        });
        
        // Remove Content-Type header for FormData
        const headers = { ...this.getAuthHeaders() };
        delete headers['Content-Type'];
        
        return await this.makeRequest(`/profiles/${id}`, {
            method: 'PUT',
            headers,
            body: formData
        });
    }

    async deleteProfile(id) {
        return await this.makeRequest(`/profiles/${id}`, {
            method: 'DELETE'
        });
    }

    async searchProfiles(query, type = 'general') {
        const params = new URLSearchParams({ q: query, type });
        return await this.makeRequest(`/profiles/search?${params}`);
    }

    /**
     * Statistics APIs
     */
    async getStats() {
        return await this.makeRequest('/stats');
    }

    async getSystemHealth() {
        return await this.makeRequest('/stats/health');
    }

    /**
     * File Upload APIs
     */
    async uploadFiles(files) {
        const formData = new FormData();
        
        files.forEach((file, index) => {
            formData.append('files', file);
        });
        
        const headers = { ...this.getAuthHeaders() };
        delete headers['Content-Type'];
        
        return await this.makeRequest('/upload', {
            method: 'POST',
            headers,
            body: formData
        });
    }

    /**
     * Backup APIs (Top Secret clearance required)
     */
    async triggerBackup() {
        return await this.makeRequest('/backup/trigger', {
            method: 'POST'
        });
    }

    async getBackupStatus() {
        return await this.makeRequest('/backup/status');
    }

    /**
     * System Health Check
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
            return await response.json();
        } catch (error) {
            throw new Error('Backend server is not responding');
        }
    }

    /**
     * Auto-refresh token if needed
     */
    async refreshTokenIfNeeded() {
        const token = this.getToken();
        if (!token) return false;
        
        try {
            await this.verifyToken();
            return true;
        } catch (error) {
            this.clearAuth();
            return false;
        }
    }
}

// Create singleton instance
const apiService = new APIService();

export default apiService;