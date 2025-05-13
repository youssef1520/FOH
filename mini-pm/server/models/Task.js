import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const taskSchema = new Schema({
  title:       { type: String, required: true },
  description: { type: String },
  assignedTo:  { type: Types.ObjectId, ref: 'User', required: true },
  project:     { type: Types.ObjectId, ref: 'Project', required: true },
  status:      { type: String, enum: ['To Do','In Progress','Done'], default: 'To Do' },
  dueDate:     { type: Date }
}, { timestamps: true });

export default model('Task', taskSchema);