import { ai_api_token, ai_base_prompt } from '../config/config';
import { logger } from '../log/logger';

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(ai_api_token);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const basicPrompt = async (
  p: string,
  userName: string,
  prevMessages: string
) => {
  logger.info('prev messages', { message: prevMessages });
  const prompt = `${ai_base_prompt} \n ${userName} says: ${p}`;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    logger.error('Catch on ai basic prompt', { message: err });
  }
};
