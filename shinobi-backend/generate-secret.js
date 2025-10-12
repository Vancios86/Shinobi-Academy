#!/usr/bin/env node

/**
 * Generate JWT Secret
 * Simple script to generate a secure random JWT secret
 */

const crypto = require('crypto');

console.log('\n🔐 JWT Secret Generator\n');
console.log('Generating a secure 64-character random secret...\n');

const secret = crypto.randomBytes(64).toString('hex');

console.log('Your JWT Secret:');
console.log('━'.repeat(80));
console.log(secret);
console.log('━'.repeat(80));
console.log('\n✅ Copy this value and use it for JWT_SECRET in your environment variables\n');
console.log('⚠️  Keep this secret safe and never commit it to Git!\n');

// Also generate a shorter one as alternative
const shortSecret = crypto.randomBytes(32).toString('hex');
console.log('Alternative (32-character):');
console.log('━'.repeat(80));
console.log(shortSecret);
console.log('━'.repeat(80));
console.log('\n');

