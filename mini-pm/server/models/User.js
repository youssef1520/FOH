import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin','member'], default: 'member' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.checkPassword = function(raw) {
  return bcrypt.compare(raw, this.password);
};

export default model('User', userSchema);