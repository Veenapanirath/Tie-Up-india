import cron from 'node-cron';
import { cleanupTempFiles } from './cleanup.js';

// Schedule cleanup to run every Sunday at 2:00 AM
// Cron expression: '0 2 * * 0' means:
// - 0 minutes
// - 2 hours (2 AM)
// - * any day of month
// - * any month
// - 0 day of week (Sunday)
const cleanupSchedule = '0 2 * * 0';

// Start the cron job
export const startCleanupScheduler = () => {
  console.log('Starting cleanup scheduler...');
  
  const task = cron.schedule(cleanupSchedule, () => {
    console.log('Running weekly cleanup at:', new Date().toISOString());
    cleanupTempFiles();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Adjust timezone as needed
  });

  console.log(`Cleanup scheduled to run every Sunday at 2:00 AM (${cleanupSchedule})`);
  return task;
};

// Alternative: Run cleanup every day at 3:00 AM (more frequent)
export const startDailyCleanupScheduler = () => {
  console.log('Starting daily cleanup scheduler...');
  
  const task = cron.schedule('0 3 * * *', () => {
    console.log('Running daily cleanup at:', new Date().toISOString());
    cleanupTempFiles();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });

  console.log('Daily cleanup scheduled to run every day at 3:00 AM');
  return task;
};

// Manual cleanup function for testing
export const runManualCleanup = () => {
  console.log('Running manual cleanup...');
  cleanupTempFiles();
};



