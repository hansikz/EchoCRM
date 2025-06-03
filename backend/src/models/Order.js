import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String, 
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: { 
    type: Number,
    required: true,
    min: 0,
  },
}, { _id: false }); 

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required for an order.'],
    index: true,
  },
  orderNumber: { // A unique order identifier, can be generated or from external system
    type: String,
    required: true,
    unique: true, // Ensure order numbers are unique
    trim: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  orderDate: {
    type: Date,
    default: Date.now,
    index: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
    default: 'Pending',
  },
}, { timestamps: true }); 

orderSchema.pre('save', function(next) {
  if (this.isModified('items') || this.isNew) {
    this.totalAmount = this.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  }
  next();
});

export default mongoose.model('Order', orderSchema);