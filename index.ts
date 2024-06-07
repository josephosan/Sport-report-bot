
import { logger } from './log/logger'
import { messageAllUsers } from './utils/helpers'
import { repeatMessageTime } from './config/config'
import { bot } from './bot/bot'


const schedule = require('node-schedule')


// ==================== base constants ==================== //

// ==================== base constants ==================== //



// ==================== app and api ==================== //

// ==================== app and api ==================== //



// ==================== base variables ==================== //

// ==================== base variables ==================== //


// ==================== tel bot functions ==================== //


// ==================== tel bot functions ==================== //


// ==================== running jobs ==================== //
const globalMessageJob = schedule.scheduleJob(repeatMessageTime, async () => {
    await messageAllUsers('Did you do your workout?')
})



bot.launch().then(() => {
    logger.info('Bot Launched!')
}).catch(err => {
    logger.error('Catch Error', err.message)
});