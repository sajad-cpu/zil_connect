/**
 * PocketBase Data Export Script
 *
 * This script exports all data from your local PocketBase instance
 * Usage: node export-pocketbase-data.js
 */

import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

const pb = new PocketBase('http://127.0.0.1:8090');

// Collections to export
const collections = [
  'businesses',
  'connections',
  'messages',
  'opportunities',
  'opportunity_applications'
];

async function exportData() {
  console.log('🚀 Starting PocketBase data export...\n');

  // Create export directory
  const exportDir = path.join(process.cwd(), 'pocketbase-export');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  for (const collectionName of collections) {
    try {
      console.log(`📦 Exporting ${collectionName}...`);

      // Fetch all records from collection
      const records = await pb.collection(collectionName).getFullList({
        sort: '-created',
      });

      // Save to JSON file
      const filename = path.join(exportDir, `${collectionName}.json`);
      fs.writeFileSync(filename, JSON.stringify(records, null, 2));

      console.log(`   ✅ Exported ${records.length} records to ${filename}`);
    } catch (error) {
      console.error(`   ❌ Error exporting ${collectionName}:`, error.message);
    }
  }

  console.log('\n✨ Export complete! Files saved to:', exportDir);
  console.log('\nNext steps:');
  console.log('1. Go to https://pocketbase.captain.sebipay.com/_/');
  console.log('2. Create the collections (use backup-pocketbase.md as reference)');
  console.log('3. Import each JSON file using the "Import collection" option');
}

exportData().catch(console.error);
