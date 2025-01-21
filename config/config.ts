require('dotenv').config();

export const dailyQuoteUrl = 'https://favqs.com/api/qotd';

export const api_token = process.env.API_TOKEN;
export const baseURL = `https://api.telegram.org/bot${api_token}/`;
export const dbUser = process.env.DB_USER;
export const dbPassword = process.env.DB_PASSWORD;
export const ai_api_token = process.env.AI_API_KEY;

export const privilegedUsernames = process.env.PRIVILEGED_USERNAMES
  ? process.env.PRIVILEGED_USERNAMES.split(',')
  : [];

export const reportKeyWord = 'REPORT:';
export const globalMessageKeyWord = 'GLOBAL MESSAGE:';
export const getAllUsersKeyWord = 'GET ALL USERS:';
export const getPrivilegedUsernamesKeyWord = 'GET ADMINS:';
export const quoteMeKeyWord = 'QUOTE ME:';
export const getUsersMessagesKeyWord = 'MESSAGES:';
export const messageToKeyWord = 'MESSAGE TO:';
export const setDailyCurrencyCronJobStringKeyWord = 'DAILY CURRENCY CRON:';
export const execCommandKeyWord = 'COMMAND:';

export const repeatMessageTime = '0 17 * * *';
export const dailyInitTime = '0 1 * * *';
export const everyMinute = '* * * * *';
export const everyDayAtTen = '0 10 * * *';
export const every5Hours = '0 */3 * * *';

export const acceptedKeywords = [
  'DONE',
  'COMPLETE',
  "I'VE DONE MY WORKOUT",
  'TODAY IS DONE',
  'done',
  'yes',
  'YES',
  'FINISHED',
  'finished',
  'COMPLETED',
  'completed',
  'ALL DONE',
  'all done',
  "I'M DONE",
  "i'm done",
  'I AM DONE',
  'i am done',
  'WORKOUT DONE',
  'workout done',
  'WORKOUT COMPLETED',
  'workout completed',
  'WORKOUT FINISHED',
  'workout finished',
  'CHECKED',
  'checked',
  'ACHIEVED',
  'achieved',
  'ACCOMPLISHED',
  'accomplished',
  'TASK DONE',
  'task done',
  'TASK COMPLETE',
  'task complete',
  'TASK FINISHED',
  'task finished',
  'MISSION ACCOMPLISHED',
  'mission accomplished',
  'SUCCESS',
  'success',
  'GOT IT DONE',
  'got it done',
  'I DID IT',
  'i did it',
  "IT'S DONE",
  "it's done",
  'IT IS DONE',
  'it is done',
  'Done',
];

export const ai_base_prompt = `
You are an AI assistant. Your task is to provide specific and accurate information based on the user's query. Follow these instructions:

1. Be specific and concise in your responses.
2. If you encounter HTML content, disregard it and do not include it in your response.
3. If you see a URL, use a web scraping tool to fetch the content of the website and return the relevant information to the user.
4. You must be an AI daily assistant, so you should provide relevant information based on users previous messages and the new message.
`;


export const ai_execute_command_prompt = `
You are a command-line assistant. Only output the requested bash command as plain text, with no additional explanation or formatting. The user will ask for a specific command, and you must provide just that command as a one-line string. Do not return any other content or instructions. For example, if asked for "list files in /home/joseph", you would output "ls /home/joseph".
allowed commands: 'ls', 'echo', 'cat', 'pwd'
`