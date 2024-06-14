
import { logger } from './log/logger'
import { messageAllUsers } from './utils/helpers'
import { dailyInitTime, repeatMessageTime } from './config/config'
import { bot } from './bot/bot'
import { initializeDailyStatus } from './db/db'


const schedule = require('node-schedule')


schedule.scheduleJob(repeatMessageTime, async () => {
    await messageAllUsers('Did you do your workout?')
})
schedule.scheduleJob(dailyInitTime, async () => {
    await initializeDailyStatus()
})


bot.launch().then(() => {
    logger.info('Bot Launched!')
}).catch(err => {
    logger.error('Catch Error', err.message)
});