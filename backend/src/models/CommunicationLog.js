import mongoose from 'mongoose';

const communicationLogSchema = new mongoose.Schema({
  campaignId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment', 
    required: true,
    index: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    index: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'SENT', 'FAILED', 'DELIVERED', 'OPENED', 'CLICKED'], 
    default: 'PENDING',
    index: true,
  },
  vendorMessageId: {
    type: String,
    index: true,
  },
  sentAt: { type: Date },
  deliveredAt: { type: Date },
  failedReason: { type: String }, 
}, { timestamps: true });

communicationLogSchema.index({ campaignId: 1, customerId: 1 }, { unique: true }); 

export default mongoose.model('CommunicationLog', communicationLogSchema);