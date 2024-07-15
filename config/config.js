"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyInitTime = exports.repeatMessageTime = exports.quoteMeKeyWord = exports.getPrivilegedUsernamesKeyWord = exports.getAllUsersKeyWord = exports.globalMessageKeyWord = exports.reportKeyWord = exports.acceptedKeywords = exports.privilegedUsernames = exports.dbPassword = exports.dbUser = exports.baseURL = exports.api_token = exports.dailyQuoteUrl = void 0;
require('dotenv').config();
exports.dailyQuoteUrl = 'https://favqs.com/api/qotd';
exports.api_token = process.env.API_TOKEN;
exports.baseURL = "https://api.telegram.org/bot".concat(exports.api_token, "/");
exports.dbUser = process.env.DB_USER;
exports.dbPassword = process.env.DB_PASSWORD;
exports.privilegedUsernames = process.env.PRIVILEGED_USERNAMES ? process.env.PRIVILEGED_USERNAMES.split(',') : [];
exports.acceptedKeywords = ['DONE', 'COMPLETE', 'I\'VE DONE MY WORKOUT', 'TODAY IS DONE', 'done', 'yes', 'YES'];
exports.reportKeyWord = 'REPORT:';
exports.globalMessageKeyWord = 'GLOBAL MESSAGE:';
exports.getAllUsersKeyWord = 'GET ALL USERS:';
exports.getPrivilegedUsernamesKeyWord = 'GET ADMINS:';
exports.quoteMeKeyWord = 'QUOTE ME:';
exports.repeatMessageTime = '0 17 * * *';
exports.dailyInitTime = '0 1 * * *';
