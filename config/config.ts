require('dotenv').config()

export const dailyQuoteUrl = 'https://favqs.com/api/qotd'

export const api_token = process.env.API_TOKEN
export const baseURL = `https://api.telegram.org/bot${api_token}/`
export const dbUser = process.env.DB_USER
export const dbPassword = process.env.DB_PASSWORD

export const privilegedUsernames = process.env.PRIVILEGED_USERNAMES ? process.env.PRIVILEGED_USERNAMES.split(',') : []; 
export const acceptedKeywords = ['DONE', 'COMPLETE', 'I\'VE DONE MY WORKOUT', 'TODAY IS DONE', 'done', 'yes', 'YES']
export const reportKeyWord = 'REPORT:'
export const globalMessageKeyWord = 'GLOBAL MESSAGE:'
export const getAllUsersKeyWord = 'GET ALL USERS:'
export const getPrivilegedUsernamesKeyWord = 'GET ADMINS:'


export const repeatMessageTime = '0 17 * * *'
export const dailyInitTime = '0 1 * * *'