
import { logger } from './log/logger'
// import { messageAllUsers } from './utils/helpers'
import { dailyInitTime, everyDayAtTen, every5Hours } from './config/config'
import { bot } from './bot/bot'
import { initializeDailyStatus } from './db/db'
import { checkIfHasNobat, getCurrencies, messageAllUsers } from './utils/helpers'


const schedule = require('node-schedule')


schedule.scheduleJob(dailyInitTime, async () => {
    await initializeDailyStatus()
})
schedule.scheduleJob(every5Hours, async () => {
    await getCurrencies()
})
schedule.scheduleJob('10 14 * * *', async () => {
    await messageAllUsers('متین متین متین ...')
})
schedule.scheduleJob('0 22 * * *', async () => {
    await messageAllUsers('ماهیتابه')
})
schedule.scheduleJob('30 23 * * *', async () => {
    await messageAllUsers('سامان مسواک بزن')
})

bot.launch().then(() => {
    logger.info('Bot Launched!')
}).catch(err => {
    logger.error('Catch Error', err.message)
});