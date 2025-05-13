import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

async function seed() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is undefined');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🗄 MongoDB connected');

  const admin  = await User.findOne({ role: 'admin' });
  const member = await User.findOne({ role: 'member' });

  if (!admin) {
    await User.create({
      name: 'Alice Admin',
      email: 'admin@example.com',
      password: 'password',
      role: 'admin'
    });
    console.log('✅ Seeded admin user');
  }
  if (!member) {
    await User.create({
      name: 'Bob Member',
      email: 'member@example.com',
      password: 'password',
      role: 'member'
    });
    console.log('✅ Seeded member user');
  }

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});