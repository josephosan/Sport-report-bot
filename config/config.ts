require("dotenv").config();

export const dailyQuoteUrl = "https://favqs.com/api/qotd";

export const api_token = process.env.API_TOKEN;
export const baseURL = `https://api.telegram.org/bot${api_token}/`;
export const dbUser = process.env.DB_USER;
export const dbPassword = process.env.DB_PASSWORD;

export const privilegedUsernames = process.env.PRIVILEGED_USERNAMES
  ? process.env.PRIVILEGED_USERNAMES.split(",")
  : [];

export const reportKeyWord = "REPORT:";
export const globalMessageKeyWord = "GLOBAL MESSAGE:";
export const getAllUsersKeyWord = "GET ALL USERS:";
export const getPrivilegedUsernamesKeyWord = "GET ADMINS:";
export const quoteMeKeyWord = "QUOTE ME:";
export const getUsersMessagesKeyWord = "MESSAGES:";
export const messageToKeyWord = "MESSAGE TO:";
export const setDailyCurrencyCronJobStringKeyWord = "DAILY CURRENCY CRON:"

export const repeatMessageTime = "0 17 * * *";
export const dailyInitTime = "0 1 * * *";
export const everyMinute = "* * * * *";
export const everyDayAtTen = "0 10 * * *";

export const acceptedKeywords = [
  "DONE",
  "COMPLETE",
  "I'VE DONE MY WORKOUT",
  "TODAY IS DONE",
  "done",
  "yes",
  "YES",
  "FINISHED",
  "finished",
  "COMPLETED",
  "completed",
  "ALL DONE",
  "all done",
  "I'M DONE",
  "i'm done",
  "I AM DONE",
  "i am done",
  "WORKOUT DONE",
  "workout done",
  "WORKOUT COMPLETED",
  "workout completed",
  "WORKOUT FINISHED",
  "workout finished",
  "CHECKED",
  "checked",
  "ACHIEVED",
  "achieved",
  "ACCOMPLISHED",
  "accomplished",
  "TASK DONE",
  "task done",
  "TASK COMPLETE",
  "task complete",
  "TASK FINISHED",
  "task finished",
  "MISSION ACCOMPLISHED",
  "mission accomplished",
  "SUCCESS",
  "success",
  "GOT IT DONE",
  "got it done",
  "I DID IT",
  "i did it",
  "IT'S DONE",
  "it's done",
  "IT IS DONE",
  "it is done",
  "Done",
];
