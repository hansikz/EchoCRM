import Segment from '../models/Segment.js';
import Customer from '../models/Customer.js'; // For audience preview
import { buildMongoQueryFromRules } from '../services/segmentEvaluationService.js'; 

export const createSegment = async (req, res, next) => {
  try {
    const { name, description, rules } = req.body;
    if (!name || !Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({ message: 'Segment name and at least one rule are required.' });
    }
    const newSegment = new Segment({ name, description, rules /*, createdBy */ });
    await newSegment.save();
    res.status(201).json({ message: 'Segment created successfully.', segment: newSegment });
  } catch (error) {
    console.error('Error creating segment:', error);
    if (error.code === 11000) { // Handle duplicate segment name
        return res.status(409).json({ message: 'Segment name already exists.', fields: error.keyValue });
    }
    next(error);
  }
};

export const getSegments = async (req, res, next) => {
  try {
    const segments = await Segment.find({ /* createdBy */ }).sort({ createdAt: -1 });
    res.status(200).json(segments);
  } catch (error) {
    console.error('Error fetching segments:', error);
    next(error);
  }
};

export const getSegmentById = async (req, res, next) => {
  try {
    const segment = await Segment.findOne({ _id: req.params.id /*, createdBy */ });
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found or not authorized.' });
    }
    res.status(200).json(segment);
  } catch (error) {
    console.error(`Error fetching segment ${req.params.id}:`, error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid segment ID format.' });
    }
    next(error);
  }
};

export const updateSegment = async (req, res, next) => {
  try {
    const { name, description, rules } = req.body;
    const updatedSegment = await Segment.findOneAndUpdate(
      { _id: req.params.id /*, createdBy */ },
      { name, description, rules },
      { new: true, runValidators: true }
    );
    if (!updatedSegment) {
      return res.status(404).json({ message: 'Segment not found or not authorized to update.' });
    }
    res.status(200).json({ message: 'Segment updated successfully.', segment: updatedSegment });
  } catch (error) {
    console.error(`Error updating segment ${req.params.id}:`, error);
     if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid segment ID format.' });
    }
    if (error.code === 11000) {
        return res.status(409).json({ message: 'Segment name already exists.', fields: error.keyValue });
    }
    next(error);
  }
};

export const deleteSegment = async (req, res, next) => {
  try {
    const deletedSegment = await Segment.findOneAndDelete({ _id: req.params.id /*, createdBy */ });
    if (!deletedSegment) {
      return res.status(404).json({ message: 'Segment not found or not authorized to delete.' });
    }
    res.status(200).json({ message: 'Segment deleted successfully.' });
  } catch (error) {
    console.error(`Error deleting segment ${req.params.id}:`, error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid segment ID format.' });
    }
    next(error);
  }
};

export const previewSegmentAudience = async (req, res, next) => {
  try {
    const { rules } = req.body;
    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({ message: 'Rules are required to preview audience.' });
    }

    const mongoQuery = buildMongoQueryFromRules(rules);
    if (!mongoQuery) {
        return res.status(400).json({ message: 'Invalid rules provided for preview.' });
    }
    
    const audienceCount = await Customer.countDocuments(mongoQuery);
    res.status(200).json({ count: audienceCount });
  } catch (error) {
    console.error('Error previewing segment audience:', error);
    next(error);
  }
};