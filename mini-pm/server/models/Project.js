import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  name:        { type: String, required: true },
  description: { type: String },
  startDate:   { type: Date },
  endDate:     { type: Date },
  status:      { type: String, enum: ['Planned','In Progress','Completed'], default: 'Planned' }
}, { timestamps: true });

export default model('Project', projectSchema);