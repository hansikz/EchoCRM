import { getMessageSuggestions } from '../services/aiSuggestionService.js'; 
import logger from '../utils/logger.js';

export const getMessageSuggestionsController = async (req, res, next) => {
  const { objective, message, type = 'message' } = req.body;

  if (!objective && type === 'message') {
    return res.status(400).json({ message: 'Campaign objective is required for message suggestions.' });
  }
  if (type === 'subject' && !objective && !message) {
     return res.status(400).json({ message: 'Either campaign objective or message body is required for subject line suggestions.' });
  }

  try {
    logger.info(`[AIController] Requesting AI suggestions. Type: ${type}, Objective: ${objective}`);
    const suggestions = await getMessageSuggestions(objective, type, message); 
    res.status(200).json(suggestions);
  } catch (error) {
    logger.error('[AIController] Error in getMessageSuggestionsController:', error.message);
    next(error);
  }
};
