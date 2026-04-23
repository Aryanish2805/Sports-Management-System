require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {})
  .then(async () => {
    console.log('Connected to DB');

    // Delete old ones to avoid duplicates
    await User.deleteMany({ email: { $in: ['user@sports.com', 'manager@sports.com', 'admin@sports.com'] } });

    // Use User.create() so Mongoose pre-save hook runs and bcrypt hashes the passwords
    await User.create({
      name: 'System Admin',
      email: 'admin@sports.com',
      password: 'Admin@123',
      role: 'admin',
    });

    await User.create({
      name: 'Regular User',
      email: 'user@sports.com',
      password: 'User@123',
      role: 'spectator',
    });

    await User.create({
      name: 'Team Manager',
      email: 'manager@sports.com',
      password: 'User@123',
      role: 'team_manager',
    });

    console.log('✅ Admin, Regular user and Manager created successfully');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
