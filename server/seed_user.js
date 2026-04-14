require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {})
  .then(async () => {
    console.log('Connected to DB');
    
    // Delete old ones to avoid duplicates
    await User.deleteMany({ email: { $in: ['user@sports.com', 'manager@sports.com', 'admin@sports.com'] } });
    
    // Create Admin
    const adminSalt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash('Admin@123', adminSalt);
    
    await User.collection.insertOne({
      name: 'System Admin',
      email: 'admin@sports.com',
      password: adminHashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('User@123', salt);

    // Create a regular user (spectator)
    await User.collection.insertOne({
      name: 'Regular User',
      email: 'user@sports.com',
      password: hashedPassword,
      role: 'spectator',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create a team manager
    await User.collection.insertOne({
      name: 'Team Manager',
      email: 'manager@sports.com',
      password: hashedPassword,
      role: 'team_manager',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Admin, Regular user and Manager created successfully');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
