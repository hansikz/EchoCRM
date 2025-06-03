import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Customer name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Customer email is required.'],
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
  },
  phone: {
    type: String,
    trim: true,
  },
  totalSpends: {
    type: Number,
    default: 0,
    min: 0,
  },
  visitCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastSeen: { 
    type: Date,
  },
  lastPurchaseDate: {
    type: Date,
  },
  tags: [{ 
    type: String,
    trim: true,
    lowercase: true,
  }],
  customFields: { 
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
}, { timestamps: true }); 

customerSchema.virtual('daysSinceLastSeen').get(function() {
  if (!this.lastSeen) return null;
  return Math.floor((Date.now() - this.lastSeen.getTime()) / (1000 * 60 * 60 * 24));
});

customerSchema.virtual('daysSinceLastPurchase').get(function() {
  if (!this.lastPurchaseDate) return null;
  return Math.floor((Date.now() - this.lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24));
});

customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });


export default mongoose.model('Customer', customerSchema);