import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  displayName: { type: String, required: true },
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  avatarUrl: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Simplified roles
  isSubscribed: { type: Boolean, default: false }, // For Pro subscription
  campaignCount: { type: Number, default: 0 },   // To track number of campaigns created
}, { timestamps: true });

userSchema.index({ googleId: 1 }, { unique: true, sparse: true });

export default mongoose.model('User', userSchema);