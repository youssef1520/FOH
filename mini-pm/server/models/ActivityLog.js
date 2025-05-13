import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const logSchema = new Schema({
  action:   { type: String, required: true },
  user:     { type: Types.ObjectId, ref: 'User', required: true },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default model('ActivityLog', logSchema);