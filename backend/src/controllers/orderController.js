import { publishToQueue } from '../services/messageBrokerService.js';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js'; // For updating customer aggregates
import config from '../config/index.js';

// Basic validation for order data
const validateOrderData = (data) => {
  if (!data.customerId || !data.orderNumber || !Array.isArray(data.items) || data.items.length === 0) {
    return { isValid: false, message: 'Customer ID, Order Number, and at least one item are required.' };
  }
  for (const item of data.items) {
    if (!item.productId || !item.productName || item.quantity == null || item.price == null) {
      return { isValid: false, message: 'Each order item must have productId, productName, quantity, and price.' };
    }
    if (item.quantity < 1 || item.price < 0) {
        return { isValid: false, message: 'Item quantity must be at least 1 and price must be non-negative.' };
    }
  }
  return { isValid: true };
};

export const ingestOrder = async (req, res, next) => {
  const validation = validateOrderData(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ message: validation.message });
  }

  try {

    const messagePayload = { type: 'order_ingest', payload: req.body };
    const success = publishToQueue(config.dataIngestionQueue, messagePayload);

    if (success) {
      res.status(202).json({ message: 'Order data received and queued for processing.' });
    } else {
      res.status(500).json({ message: 'Internal Server Error: Could not queue order data.' });
    }
  } catch (error) {
    console.error('Error in ingestOrder controller:', error);
    next(error);
  }
};

export const getOrdersByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 10, sortBy = 'orderDate', order = 'desc' } = req.query;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        return res.status(400).json({ message: 'Invalid Customer ID format.' });
    }

    const orders = await Order.find({ customerId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .populate('customerId', 'name email') // Optionally populate customer details
      .exec();

    const count = await Order.countDocuments({ customerId });

    res.status(200).json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalOrders: count,
    });
  } catch (error) {
    console.error(`Error fetching orders for customer ${req.params.customerId}:`, error);
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('customerId', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(`Error fetching order ${req.params.id}:`, error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid order ID format.' });
    }
    next(error);
  }
};
