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
  const prompt = `${ai_base_prompt} \n ${userName} says: ${p} \n and prev messages are: ${prevMessages}`;
  try {
    const result = await model.generateContent(prompt);
    return result;
  } catch (err) {
    logger.error('Catch on ai basic prompt', { message: err });
  }
};
