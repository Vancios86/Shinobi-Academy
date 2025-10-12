#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

// Load models to access their collections
const User = require('../src/models/User');
const Class = require('../src/models/Class');

async function dropDuplicateKeyIndexes(model, fieldName) {
  const collection = model.collection;
  const indexes = await collection.indexes();

  // Find indexes with the exact key { [fieldName]: 1 }
  const matching = indexes.filter(idx => {
    const keys = idx.key || {};
    const keyNames = Object.keys(keys);
    return keyNames.length === 1 && keyNames[0] === fieldName && keys[fieldName] === 1;
  });

  if (matching.length <= 1) {
    console.log(`No duplicate indexes found for '${collection.collectionName}.${fieldName}'.`);
    return;
  }

  // Keep the first one, drop the rest
  const toDrop = matching.slice(1);
  for (const idx of toDrop) {
    console.log(`Dropping duplicate index '${idx.name}' on '${collection.collectionName}.${fieldName}'`);
    await collection.dropIndex(idx.name);
  }
}

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shinobi-academy';

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Ensure models are initialized
    await Promise.all([
      dropDuplicateKeyIndexes(User, 'username'),
      dropDuplicateKeyIndexes(Class, 'slug'),
    ]);

    console.log('✅ Index cleanup completed.');
  } catch (err) {
    console.error('❌ Index cleanup failed:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

main();


