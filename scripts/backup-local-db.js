import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_URI = process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017/orqiva_admin';
const BACKUP_DIR = path.join(__dirname, '../backups', `orqiva_admin_backup_${Date.now()}`);

async function backupLocalDatabase() {
  console.log(`[Backup] Connecting to local MongoDB at: ${LOCAL_URI}`);
  const conn = await mongoose.connect(LOCAL_URI);
  const db = conn.connection.db;

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const collections = await db.listCollections().toArray();
  console.log(`[Backup] Found ${collections.length} collections in local database:`);

  const summary = {};

  for (const col of collections) {
    const name = col.name;
    if (name.startsWith('system.')) continue;

    const data = await db.collection(name).find({}).toArray();
    const filePath = path.join(BACKUP_DIR, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    summary[name] = data.length;
    console.log(`  ✓ Exported ${name.padEnd(25)} : ${data.length} documents -> ${filePath}`);
  }

  const summaryPath = path.join(BACKUP_DIR, '_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    sourceUri: LOCAL_URI,
    collectionCount: Object.keys(summary).length,
    collections: summary
  }, null, 2), 'utf-8');

  console.log(`\n[Backup] Backup completed successfully in: ${BACKUP_DIR}`);
  console.log(`[Backup] Summary saved to: ${summaryPath}`);

  await mongoose.disconnect();
}

backupLocalDatabase().catch((err) => {
  console.error('[Backup Error]:', err);
  process.exit(1);
});
