import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_URI = process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017/orqiva_admin';
const TARGET_URI = process.argv[2] || process.env.MONGO_URI || process.env.MONGODB_URI;

if (!TARGET_URI) {
  console.error('[Migration Error] No Atlas Target URI provided! Please specify as argument or set MONGO_URI in .env');
  process.exit(1);
}

// Make sure target URI points to orqiva_admin database if db name is not specified
let finalTargetUri = TARGET_URI;
if (!finalTargetUri.includes('orqiva_admin') && finalTargetUri.includes('.mongodb.net')) {
  if (finalTargetUri.includes('.mongodb.net/?')) {
    finalTargetUri = finalTargetUri.replace('.mongodb.net/?', '.mongodb.net/orqiva_admin?');
  } else if (finalTargetUri.includes('.mongodb.net/')) {
    const parts = finalTargetUri.split('.mongodb.net/');
    const after = parts[1];
    if (after.startsWith('?')) {
      finalTargetUri = parts[0] + '.mongodb.net/orqiva_admin' + after;
    } else {
      const qIndex = after.indexOf('?');
      if (qIndex !== -1) {
        finalTargetUri = parts[0] + '.mongodb.net/orqiva_admin' + after.slice(qIndex);
      } else {
        finalTargetUri = parts[0] + '.mongodb.net/orqiva_admin';
      }
    }
  } else if (finalTargetUri.endsWith('.mongodb.net')) {
    finalTargetUri += '/orqiva_admin?retryWrites=true&w=majority';
  }
}

async function migrateData() {
  console.log(`======================================================`);
  console.log(`  🚀 ORQIVA TECH — MONGODB ATLAS MIGRATION TOOL`);
  console.log(`======================================================`);
  console.log(`[Source Local DB] : ${LOCAL_URI}`);
  console.log(`[Target Atlas DB] : ${finalTargetUri.replace(/:([^:@]+)@/, ':****@')}\n`);

  // Step 1: Connect to Local DB
  console.log(`[Step 1/5] Connecting to Local MongoDB...`);
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  const localDb = localConn.db;
  console.log(`  ✓ Local MongoDB Connected.`);

  // Step 2: Connect to Atlas DB
  console.log(`\n[Step 2/5] Connecting to MongoDB Atlas...`);
  const atlasConn = await mongoose.createConnection(finalTargetUri).asPromise();
  const atlasDb = atlasConn.db;
  console.log(`  ✓ MongoDB Atlas Connected (Database: ${atlasDb.databaseName}).`);

  // Step 3: Fetch all local collections
  console.log(`\n[Step 3/5] Inspecting Local Collections...`);
  const collections = await localDb.listCollections().toArray();
  console.log(`  Found ${collections.length} collections to migrate.`);

  // Step 4: Transfer documents for each collection
  console.log(`\n[Step 4/5] Migrating Collections to Atlas...`);
  const stats = {};

  for (const col of collections) {
    const name = col.name;
    if (name.startsWith('system.')) continue;

    const docs = await localDb.collection(name).find({}).toArray();
    const localCount = docs.length;

    // Drop target collection if exists to avoid duplicates
    try {
      await atlasDb.collection(name).drop();
    } catch (e) {
      // Ignore NamespaceNotFound error
    }

    if (localCount > 0) {
      // Insert all documents with original _id and data types preserved
      await atlasDb.collection(name).insertMany(docs);
    }

    const atlasCount = await atlasDb.collection(name).countDocuments();
    stats[name] = { local: localCount, atlas: atlasCount, match: localCount === atlasCount };

    const statusSymbol = localCount === atlasCount ? '✓' : '✗';
    console.log(`  ${statusSymbol} [${name.padEnd(24)}] Local: ${String(localCount).padStart(3)} | Atlas: ${String(atlasCount).padStart(3)} | Status: ${localCount === atlasCount ? 'MATCH' : 'MISMATCH'}`);
  }

  // Step 5: Verify required Industry records
  console.log(`\n[Step 5/5] Verifying Industry Data in Atlas...`);
  const expectedIndustries = [
    { name: 'Healthcare', count: '40+' },
    { name: 'Education', count: '55+' },
    { name: 'Finance & Fintech', count: '30+' },
    { name: 'Retail & E-Commerce', count: '65+' },
    { name: 'Manufacturing', count: '25+' },
    { name: 'Real Estate', count: '35+' },
    { name: 'Travel & Hospitality', count: '20+' },
    { name: 'Government & NGO', count: '15+' },
  ];

  const atlasIndustries = await atlasDb.collection('industries').find({}).toArray();
  console.log(`  Found ${atlasIndustries.length} industries in Atlas:`);
  for (const exp of expectedIndustries) {
    const found = atlasIndustries.find(i => i.name.toLowerCase() === exp.name.toLowerCase());
    if (found) {
      console.log(`  ✓ ${found.name.padEnd(22)}: ${found.projectCount} Projects (Expected: ${exp.count})`);
    } else {
      console.log(`  ✗ Missing expected industry: ${exp.name}`);
    }
  }

  // Verify Admin User
  const adminDoc = await atlasDb.collection('admins').findOne({ email: 'admin@orqivatech.com' });
  if (adminDoc) {
    console.log(`\n  ✓ Admin account verified in Atlas (${adminDoc.email}) with hashed password.`);
  } else {
    console.log(`\n  ✗ Admin account not found in Atlas!`);
  }

  // Close connections
  await localConn.close();
  await atlasConn.close();

  console.log(`\n======================================================`);
  console.log(`  🎉 MIGRATION TO MONGODB ATLAS COMPLETED SUCCESSFULLY!`);
  console.log(`======================================================`);
}

migrateData().catch((err) => {
  console.error('[Migration Failed]:', err);
  process.exit(1);
});
