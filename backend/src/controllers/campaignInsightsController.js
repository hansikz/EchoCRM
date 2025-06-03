import Segment from '../models/Segment.js';
import CommunicationLog from '../models/CommunicationLog.js';
import { getCampaignInsightsFromAI } from '../services/aiSuggestionService.js';
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const generateCampaignInsights = async (req, res, next) => {
    const { campaignId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
        return res.status(400).json({ message: 'Invalid Campaign ID format.' });
    }

    try {
        const campaignDefinition = await Segment.findOne({ _id: campaignId, createdBy: userId });
        if (!campaignDefinition) {
            return res.status(404).json({ message: 'Campaign not found or unauthorized.' });
        }

        const stats = await CommunicationLog.aggregate([
            { $match: { campaignId: new mongoose.Types.ObjectId(campaignId) } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const summaryStats = stats.reduce((acc, curr) => {
            acc[curr._id.toLowerCase()] = curr.count;
            return acc;
        }, { totalTargeted: await CommunicationLog.countDocuments({ campaignId: new mongoose.Types.ObjectId(campaignId) }) });

        const campaignDataForAI = {
            name: campaignDefinition.name,
            objective: campaignDefinition.objective,
            rules: campaignDefinition.rules,
            messageTemplate: campaignDefinition.messageTemplate,
            summaryStats: summaryStats
        };

        logger.info(`[CampaignInsightsCtrl] Generating AI insights for campaign ${campaignId}`);
        const insights = await getCampaignInsightsFromAI(campaignDataForAI);

        res.status(200).json({ insights });

    } catch (error) {
        logger.error(`[CampaignInsightsCtrl] Error generating AI insights for campaign ${campaignId}:`, error);
        next(error);
    }
};