import { api } from '../api/api';
import { ai_base_prompt } from '../config/config';
import { logger } from '../log/logger';

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('YOUR_API_KEY');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const basicPrompt = async (p: string) => {
  const prompt = `${ai_base_prompt} \n ${p}`;
  try {
    const result = await model.generateContent(prompt);
    return result;
  } catch (err) {
    logger.error('Catch on ai basic prompt', { message: err });
  }
};
