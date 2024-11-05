
import { logger } from './log/logger'
// import { messageAllUsers } from './utils/helpers'
import { dailyInitTime, everyMinute, repeatMessageTime, everyDayAtTen, every5Hours } from './config/config'
import { bot } from './bot/bot'
import { initializeDailyStatus } from './db/db'
import { checkIfHasNobat, getCurrencies } from './utils/helpers'


const schedule = require('node-schedule')


schedule.scheduleJob(dailyInitTime, async () => {
    await initializeDailyStatus()
})
schedule.scheduleJob(every5Hours, async () => {
    await getCurrencies()
})


bot.launch().then(() => {
    logger.info('Bot Launched!')
}).catch(err => {
    logger.error('Catch Error', err.message)
});