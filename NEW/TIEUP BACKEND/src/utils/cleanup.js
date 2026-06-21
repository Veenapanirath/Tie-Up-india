import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clean up temporary files in public/temp folder
export const cleanupTempFiles = () => {
  try {
    const tempDir = path.join(__dirname, '../../public/temp');
    
    // Check if temp directory exists
    if (!fs.existsSync(tempDir)) {
      console.log('Temp directory does not exist:', tempDir);
      return;
    }

    // Read all files in temp directory
    const files = fs.readdirSync(tempDir);
    
    if (files.length === 0) {
      console.log('No files to clean up in temp directory');
      return;
    }

    let deletedCount = 0;
    let totalSize = 0;

    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      
      try {
        // Get file stats
        const stats = fs.statSync(filePath);
        
        // Only process files (not directories)
        if (stats.isFile()) {
          const fileSize = stats.size;
          const fileAge = Date.now() - stats.mtime.getTime();
          
          // Delete files older than 1 hour (3600000 ms) or files larger than 10MB
          const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
          const tenMB = 10 * 1024 * 1024; // 10MB in bytes
          
          if (fileAge > oneHour || fileSize > tenMB) {
            fs.unlinkSync(filePath);
            deletedCount++;
            totalSize += fileSize;
            console.log(`Deleted file: ${file} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error.message);
      }
    });

    console.log(`Cleanup completed: ${deletedCount} files deleted, ${(totalSize / 1024 / 1024).toFixed(2)} MB freed`);
    
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
};

// Clean up all files in temp folder (for manual cleanup)
export const cleanupAllTempFiles = () => {
  try {
    const tempDir = path.join(__dirname, '../../public/temp');
    
    if (!fs.existsSync(tempDir)) {
      console.log('Temp directory does not exist:', tempDir);
      return;
    }

    const files = fs.readdirSync(tempDir);
    
    if (files.length === 0) {
      console.log('No files to clean up in temp directory');
      return;
    }

    let deletedCount = 0;
    let totalSize = 0;

    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      
      try {
        const stats = fs.statSync(filePath);
        
        if (stats.isFile()) {
          const fileSize = stats.size;
          fs.unlinkSync(filePath);
          deletedCount++;
          totalSize += fileSize;
          console.log(`Deleted file: ${file} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
        }
      } catch (error) {
        console.error(`Error deleting file ${file}:`, error.message);
      }
    });

    console.log(`Manual cleanup completed: ${deletedCount} files deleted, ${(totalSize / 1024 / 1024).toFixed(2)} MB freed`);
    
  } catch (error) {
    console.error('Error during manual cleanup:', error.message);
  }
};
