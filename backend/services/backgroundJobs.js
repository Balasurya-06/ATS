const cron = require('node-cron');
const { analyzeAllProfiles } = require('./linkageDetector');

/**
 * Background Job Scheduler
 * Continuously monitors and analyzes profiles for linkages
 */

class BackgroundJobScheduler {
    constructor() {
        this.jobs = [];
        this.isRunning = false;
    }

    /**
     * Start all background jobs
     */
    start() {
        if (this.isRunning) {
            console.log('⚠️  Background jobs already running');
            return;
        }

        console.log('🚀 Starting background job scheduler...');

        // Job 1: Analyze linkages every 5 minutes
        const linkageJob = cron.schedule('*/5 * * * *', async () => {
            console.log('🔍 [AUTO] Running scheduled linkage analysis...');
            try {
                await analyzeAllProfiles();
                console.log('✅ [AUTO] Scheduled analysis complete');
            } catch (error) {
                console.error('❌ [AUTO] Scheduled analysis failed:', error.message);
            }
        }, {
            scheduled: false
        });

        // Job 2: Deep scan every 30 minutes
        const deepScanJob = cron.schedule('*/30 * * * *', async () => {
            console.log('🔬 [AUTO] Running deep network scan...');
            try {
                await analyzeAllProfiles();
                console.log('✅ [AUTO] Deep scan complete');
            } catch (error) {
                console.error('❌ [AUTO] Deep scan failed:', error.message);
            }
        }, {
            scheduled: false
        });

        // Job 3: Cleanup old linkages daily at 2 AM
        const cleanupJob = cron.schedule('0 2 * * *', async () => {
            console.log('🧹 [AUTO] Running daily cleanup...');
            try {
                const Linkage = require('../models/Linkage');
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                
                await Linkage.deleteMany({
                    isActive: false,
                    lastAnalyzed: { $lt: thirtyDaysAgo }
                });
                console.log('✅ [AUTO] Cleanup complete');
            } catch (error) {
                console.error('❌ [AUTO] Cleanup failed:', error.message);
            }
        }, {
            scheduled: false
        });

        // Start all jobs
        linkageJob.start();
        deepScanJob.start();
        cleanupJob.start();

        this.jobs.push(linkageJob, deepScanJob, cleanupJob);
        this.isRunning = true;

        console.log('✅ Background jobs started:');
        console.log('   - Linkage analysis: Every 5 minutes');
        console.log('   - Deep scan: Every 30 minutes');
        console.log('   - Cleanup: Daily at 2 AM');
    }

    /**
     * Stop all background jobs
     */
    stop() {
        if (!this.isRunning) return;

        console.log('🛑 Stopping background jobs...');
        this.jobs.forEach(job => job.stop());
        this.jobs = [];
        this.isRunning = false;
        console.log('✅ Background jobs stopped');
    }

    /**
     * Trigger immediate analysis (called when new profile is created)
     */
    async triggerImmediateAnalysis(profileId) {
        console.log(`🔥 [IMMEDIATE] New profile detected: ${profileId}`);
        console.log('⚡ Running immediate linkage analysis...');
        
        try {
            await analyzeAllProfiles();
            console.log('✅ [IMMEDIATE] Analysis complete');
        } catch (error) {
            console.error('❌ [IMMEDIATE] Analysis failed:', error.message);
        }
    }
}

// Singleton instance
const scheduler = new BackgroundJobScheduler();

module.exports = scheduler;
