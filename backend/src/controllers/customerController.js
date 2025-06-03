import { publishToQueue } from '../services/messageBrokerService.js';
import Customer from '../models/Customer.js';
import config from '../config/index.js';

const validateCustomerData = (data) => {
  if (!data.email || !data.name) {
    return { isValid: false, message: 'Customer email and name are required.' };
  }
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(data.email)) {
    return { isValid: false, message: 'Invalid email format.' };
  }
  return { isValid: true };
};

export const ingestCustomer = async (req, res, next) => {
  const validation = validateCustomerData(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ message: validation.message });
  }

  try {

    const messagePayload = { type: 'customer_ingest', payload: req.body };
    const success = publishToQueue(config.dataIngestionQueue, messagePayload);

    if (success) {
      res.status(202).json({ message: 'Customer data received and queued for processing.' });
    } else {
      console.error('Failed to queue customer data for email:', req.body.email);
      res.status(500).json({ message: 'Internal Server Error: Could not queue customer data.' });
    }
  } catch (error) {
    console.error('Error in ingestCustomer controller:', error);
    next(error); 
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', search = '' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } } 
      ];
    }

    const customers = await Customer.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .exec();

    const count = await Customer.countDocuments(query);

    res.status(200).json({
      customers,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCustomers: count,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error(`Error fetching customer ${req.params.id}:`, error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid customer ID format.' });
    }
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  const validation = validateCustomerData(req.body); 
  if (!validation.isValid && req.body.email !== undefined && req.body.name !== undefined) { 
  }

  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the modified document
      runValidators: true, // Ensure schema validations are run on update
    });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(200).json({ message: 'Customer updated successfully.', customer });
  } catch (error) {
    console.error(`Error updating customer ${req.params.id}:`, error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid customer ID format.' });
    }
    if (error.code === 11000) { 
        return res.status(409).json({ message: 'Update failed. Email may already exist.', fields: error.keyValue });
    }
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(200).json({ message: 'Customer deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting customer ${req.params.id}:`, error);
     if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid customer ID format.' });
    }
    next(error);
  }
};