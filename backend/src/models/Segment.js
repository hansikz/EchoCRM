import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({ 
  field: { type: String, required: true },
  operator: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  logical: { type: String, enum: ['AND', 'OR', ''], default: '' }
}, { _id: false });

const segmentSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Segment/Campaign name is required.'], trim: true },
  description: { type: String, trim: true },
  rules: {
    type: [ruleSchema], required: true,
    validate: [val => val.length > 0, 'At least one rule is required for a segment.']
  },
  objective: { type: String, trim: true },
  messageTemplate: { type: String },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
    index: true,
  },
  status: { type: String, enum: ['DRAFT', 'PROCESSING', 'ACTIVE', 'COMPLETED', 'ARCHIVED', 'FAILED_TO_QUEUE'], default: 'DRAFT' },
  lastLaunchedAt: Date,
}, { timestamps: true });

segmentSchema.index({ name: 1, createdBy: 1 }, { unique: true }); 

export default mongoose.model('Segment', segmentSchema);