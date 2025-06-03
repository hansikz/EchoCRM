import Segment from '../models/Segment.js';
import User from '../models/User.js'; 
import CommunicationLog from '../models/CommunicationLog.js';
import { publishToQueue } from '../services/messageBrokerService.js';
import config from '../config/index.js';
import mongoose from 'mongoose'; // Keeping mongoose for ObjectId validation etc.
import logger from '../utils/logger.js';

const CAMPAIGN_LIMIT_FREE_TIER = 10;

export const createCampaign = async (req, res, next) => {
  try {
    const { name, rules, message, objective, description } = req.body;
    const userId = req.user.id;

    if (!name || !message || !Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({ message: 'Campaign name, message, and at least one audience rule are required.' });
    }

    const user = await User.findById(userId); 
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.isSubscribed && user.campaignCount >= CAMPAIGN_LIMIT_FREE_TIER) {
      return res.status(403).json({
        message: `Campaign limit of ${CAMPAIGN_LIMIT_FREE_TIER} reached for free tier. Please upgrade to EchoCRM Pro.`,
        limitReached: true
      });
    }

    const newCampaignDefinition = new Segment({
      name, rules, objective, messageTemplate: message,
      description: description || `Campaign: ${name}`,
      createdBy: userId,
      status: 'PROCESSING', 
    });
    await newCampaignDefinition.save(); // Save without session

    user.campaignCount = (user.campaignCount || 0) + 1;
    await user.save(); 

    logger.info(`[CampaignController] User ${userId} saved campaign definition: ${newCampaignDefinition._id}, Name: ${name}. New count: ${user.campaignCount}`);

    const campaignPayload = {
      campaignDefinitionId: newCampaignDefinition._id.toString(),
    };
    const success = publishToQueue(config.campaignProcessingQueue, campaignPayload);

    if (!success) {
      logger.error(`[CampaignController] Failed to queue campaign. Campaign ID: ${newCampaignDefinition._id}. Attempting to revert state.`);
      try {
        user.campaignCount -= 1;
        await user.save();
        newCampaignDefinition.status = 'FAILED_TO_QUEUE';
        await newCampaignDefinition.save();
        logger.info(`[CampaignController] Reverted user campaign count and set campaign ${newCampaignDefinition._id} status to FAILED_TO_QUEUE.`);
      } catch (revertError) {
        logger.error(`[CampaignController] CRITICAL: Failed to revert state for campaign ${newCampaignDefinition._id} after queue failure:`, revertError);
      }
      return res.status(500).json({ message: 'Failed to queue campaign for processing. Please try again.' });
    }

    logger.info(`[CampaignController] Campaign ${newCampaignDefinition._id} created and queued successfully.`);
    res.status(202).json({
        message: `Campaign "${newCampaignDefinition.name}" created and queued! You have created ${user.campaignCount} of ${user.isSubscribed ? 'unlimited' : CAMPAIGN_LIMIT_FREE_TIER} campaigns.`,
        campaignId: newCampaignDefinition._id,
        campaignName: newCampaignDefinition.name,
        campaignCount: user.campaignCount,
        limit: user.isSubscribed ? null : CAMPAIGN_LIMIT_FREE_TIER
    });

  } catch (error) {
    logger.error('[CampaignController] Error creating campaign:', error);
    if (error.code === 11000 && error.message.includes('name_1_createdBy_1')) { 
        return res.status(409).json({ message: 'You already have a campaign with this name.', fields: error.keyValue });
    }
    next(error);
  } finally {
  }
};

export const getCampaignHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const campaignsWithStats = await Segment.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
        { $match: { status: { $in: ['DRAFT', 'PROCESSING', 'ACTIVE', 'COMPLETED', 'FAILED_TO_QUEUE'] } }},
        { $lookup: { from: 'communicationlogs', localField: '_id', foreignField: 'campaignId', as: 'logs'}},
        {
            $project: {
                _id: 1, name: 1, objective: 1, messageTemplate: 1, status: 1, createdAt: 1, lastLaunchedAt: 1, rules: 1,
                audienceSize: { $size: "$logs" }, 
                sentCount: { $size: { $filter: { input: "$logs", cond: { $eq: ["$$this.status", "SENT"] } } } },
                deliveredCount: { $size: { $filter: { input: "$logs", cond: { $eq: ["$$this.status", "DELIVERED"] } } } },
                failedCount: { $size: { $filter: { input: "$logs", cond: { $eq: ["$$this.status", "FAILED"] } } } },
            }
        },
        { $sort: { createdAt: -1 } }
    ]);
    res.status(200).json(campaignsWithStats);
  } catch (error) {
    logger.error('[CampaignController] Error fetching campaign history for user ' + req.user.id + ':', error);
    next(error);
  }
};

export const getCampaignDetails = async (req, res, next) => {
  try {
    const campaignId = req.params.campaignId;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
        return res.status(400).json({ message: 'Invalid Campaign ID format.'});
    }

    const campaignDefinition = await Segment.findOne({ _id: campaignId, createdBy: userId });
    if (!campaignDefinition) {
      return res.status(404).json({ message: 'Campaign definition not found or you do not have permission to view it.' });
    }
    
    const logs = await CommunicationLog.find({ campaignId: new mongoose.Types.ObjectId(campaignId) })
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(200);

    const stats = await CommunicationLog.aggregate([
        { $match: { campaignId: new mongoose.Types.ObjectId(campaignId) } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const summaryStats = stats.reduce((acc, curr) => {
        acc[curr._id.toLowerCase()] = curr.count;
        return acc;
    }, { totalTargeted: await CommunicationLog.countDocuments({ campaignId: new mongoose.Types.ObjectId(campaignId) }) });
    
    res.status(200).json({ campaign: campaignDefinition, summaryStats, logs });
  } catch (error) {
    logger.error(`[CampaignController] Error fetching campaign details for ${req.params.campaignId}, user ${req.user.id}:`, error);
    next(error);
  }
};