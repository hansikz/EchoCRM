import OpenAI from 'openai';
import config from '../config/index.js'; // For OPENAI_API_KEY
import logger from '../utils/logger.js'; 

let openai;
if (config.openaiApiKey && config.openaiApiKey !== 'YOUR_OPENAI_API_KEY_OR_LEAVE_BLANK_FOR_MOCK' && config.openaiApiKey.startsWith('sk-')) {
  try {
    openai = new OpenAI({ apiKey: config.openaiApiKey });
    logger.info("[AIService] OpenAI client initialized successfully.");
  } catch (e) {
    logger.error("[AIService] Failed to initialize OpenAI client with API key:", e.message);
    openai = null; 
  }
} else {
  if (!config.openaiApiKey || config.openaiApiKey === 'YOUR_OPENAI_API_KEY_OR_LEAVE_BLANK_FOR_MOCK') {
    logger.warn("[AIService] OpenAI API Key not configured or is placeholder. AI features will be mocked.");
  } else if (!config.openaiApiKey.startsWith('sk-')) {
    logger.warn("[AIService] OpenAI API Key appears invalid (does not start with 'sk-'). AI features will be mocked.");
  }
  openai = null; 
}

const generateMockSuggestions = (type, objective = "the campaign") => {
  logger.info(`[AIService] Generating MOCK ${type} suggestions for objective: ${objective}`);
  if (type === 'subject') {
    return [
      { id: 'mock_subj1', text: `Mock Subject: Exciting News for ${objective}!` },
      { id: 'mock_subj2', text: `Mock Subject: A Special Offer Regarding ${objective}` },
      { id: 'mock_subj3', text: `Mock Subject: Don't Miss This: ${objective}!` },
    ];
  }
  // Default to message suggestions
  return [
    { id: 'mock_msg1', text: `Mock Message for {{name}}: Discover more about ${objective} today!` },
    { id: 'mock_msg2', text: `Mock Message: We have an exclusive deal for ${objective}, just for you, {{name}}!` },
    { id: 'mock_msg3', text: `Mock Message: Hi {{name}}, quick update on ${objective}.` },
  ];
};

// This function can provide suggestions for 'message' or 'subject'
export const getMessageSuggestions = async (objective, type = 'message', relatedText = "") => {
  if (!openai) { // If OpenAI client is not initialized (no key or bad key)
    return generateMockSuggestions(type, objective);
  }

  let promptContent;
  let maxTokens = 150;
  let systemMessage = "You are a creative marketing assistant for a CRM called EchoCRM. Provide concise and engaging content.";

  if (type === 'subject') {
    promptContent = `Generate 3 distinct and compelling email subject lines for a marketing campaign.
    Campaign Objective: "${objective || 'increase customer engagement'}"
    Email Body Context (if available): "${relatedText || 'not provided'}"
    The subject lines should be short, catchy, and encourage opens. Consider using relevant emojis where appropriate.
    Output strictly as a JSON array of 3 strings. For example: ["Subject 1 🎉", "Subject 2: Don't Miss Out!", "Subject 3 for {{name}}"]`;
    maxTokens = 70; 
  } else { 
    promptContent = `Generate 3 distinct, short, and personalized marketing message variants for a campaign.
    Campaign Objective: "${objective || 'general promotion'}"
    These messages could be for SMS or short emails.
    Consider using the personalization placeholder {{name}} where it makes sense.
    Output strictly as a JSON array of 3 strings. For example: ["Hi {{name}}, special offer just for you!", "Message variant 2 here.", "Don't forget about our {{name}} deal!"]`;
    maxTokens = 180;
  }

  try {
    logger.info(`[AIService] Requesting REAL AI ${type} suggestions from OpenAI. Objective: ${objective}`);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: promptContent }
      ],
      temperature: 0.75, 
      max_tokens: maxTokens,
      n: 1, 
    });

    const content = completion.choices[0]?.message?.content;
    logger.debug(`[AIService] Raw OpenAI response for ${type}: ${content}`);
    let suggestionsArray = [];

    if (content) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(item => typeof item === 'string')) {
          suggestionsArray = parsed;
        } else {
          logger.warn(`[AIService] OpenAI response for ${type} was parsed but not a valid array of strings. Content: "${content}"`);
        }
      } catch (e) {
        logger.warn(`[AIService] OpenAI response for ${type} was not valid JSON. Content: "${content}". Attempting to parse as a list.`);
        suggestionsArray = content.split('\n')
                                .map(s => s.trim().replace(/^- ?|"?$/g, '').replace(/^"/g, '')) // Clean up list markers/quotes
                                .filter(s => s.length > 5);
      }
    }
    
    if (!suggestionsArray || suggestionsArray.length === 0) {
      logger.warn(`[AIService] OpenAI did not return usable ${type} suggestions for objective: ${objective}. Falling back to mocks.`);
      return generateMockSuggestions(type, objective);
    }

    logger.info(`[AIService] Successfully generated ${suggestionsArray.length} real AI ${type} suggestions.`);
    return suggestionsArray.slice(0, 3).map((text, index) => ({ id: `openai_${type}_${index + 1}`, text }));

  } catch (error) {
    logger.error(`[AIService] Error getting real AI ${type} suggestions from OpenAI:`, error.message);
    if (error.status === 401 || (error.message && error.message.toLowerCase().includes("incorrect api key"))) {
        logger.error("[AIService] OpenAI API Key is invalid or authentication failed. Please check your .env configuration.");
    }
    return generateMockSugsestions(type, objective); 
  }
};

export const getCampaignInsightsFromAI = async (campaignData) => {
  if (!openai) {
    logger.warn("[AIService] Mocking campaign insights as OpenAI client is not available.");
    return "Mock AI Insight: This campaign shows good potential based on its objective. Consider focusing on clear calls to action. (OpenAI client not configured)";
  }

  const prompt = `
    You are an expert marketing analyst for EchoCRM.
    Analyze the following marketing campaign data and provide 2-3 concise, actionable insights or suggestions for improvement.
    Keep the insights practical and encouraging.

    Campaign Name: "${campaignData.name}"
    Objective: "${campaignData.objective || 'Not specified'}"
    Target Audience Rules Summary: ${campaignData.rules ? JSON.stringify(campaignData.rules.map(r => `${r.field} ${r.operator} ${r.value}`)).substring(0,150) + "..." : 'Not specified'}
    Message Sent: "${campaignData.messageTemplate ? campaignData.messageTemplate.substring(0,100) + "..." : 'Not specified'}"
    
    Performance So Far (if available):
      - Targeted: ${campaignData.summaryStats.totalTargeted || 'N/A'}
      - Sent: ${campaignData.summaryStats.sent || 'N/A'}
      - Delivered: ${campaignData.summaryStats.delivered || 'N/A'}
      - Failed: ${campaignData.summaryStats.failed || 'N/A'}
      ${campaignData.summaryStats.opened ? `- Opened: ${campaignData.summaryStats.opened}` : ''}
      ${campaignData.summaryStats.clicked ? `- Clicked: ${campaignData.summaryStats.clicked}` : ''}

    Provide insights as a single string, perhaps with bullet points using asterisks or hyphens.
    Focus on what could be learned, potential optimizations, or next steps.
    Be specific if possible based on the data.
  `;

  try {
    logger.info(`[AIService] Requesting REAL AI insights for campaign: ${campaignData.name}`);
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "You are an expert marketing analyst providing actionable insights." },
            { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 250, 
    });
    const insights = completion.choices[0]?.message?.content?.trim();
    logger.info(`[AIService] Successfully generated real AI insights for campaign: ${campaignData.name}`);
    return insights || "No specific insights could be generated at this time. Review performance data manually.";
  } catch (error) {
    logger.error(`[AIService] Error getting real AI campaign insights from OpenAI:`, error.message);
    if (error.status === 401 || (error.message && error.message.toLowerCase().includes("incorrect api key"))) {
        logger.error("[AIService] OpenAI API Key is invalid or authentication failed. Please check your .env configuration.");
    }
    return "Could not generate AI insights due to an API error. Please check campaign performance manually.";
  }
};