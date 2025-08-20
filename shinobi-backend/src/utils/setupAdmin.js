const User = require('../models/User');
require('dotenv').config();

/**
 * Create initial admin user
 * Run this script once to set up the first admin account
 */
const setupAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.username);
      return existingAdmin;
    }

    // Create new admin user
    const adminData = {
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    };

    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('Username:', admin.username);
    console.log('⚠️  Please change the default password after first login');
    
    return admin;
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    throw error;
  }
};

module.exports = setupAdmin;
