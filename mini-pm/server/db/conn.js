import mongoose from 'mongoose';
import 'dotenv/config';

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('🗄️  MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

export default mongoose;