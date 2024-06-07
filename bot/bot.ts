import { Telegraf } from 'telegraf'
import { logger } from '../log/logger'
import { escapeMarkdown, messageAllUsers, getUpdates } from '../utils/helpers'
import { api_token, privilegedUsernames, acceptedKeywords } from '../config/config'
import { updateUsersDailyState } from '../db/db'

export const bot = new Telegraf(api_token)


bot.start(async (ctx) => {
    await getUpdates()
    logger.info('Bot start', { username: ctx.update.message.from.username })
    ctx.reply('Hi! Welcome.')
})
bot.help((ctx) => {
    const replyText = `
    🌟 *Daily Workout Bot Features* 🌟

    1. **Completion Detection** 🏆
    - When the bot receives a message containing any of the following phrases: "DONE", "COMPLETE", "I'VE DONE MY WORKOUT", or "TODAY IS DONE", it will mark your daily workout as completed.

    2. **Daily Reminder** ⏰
    - The bot will send you a friendly reminder every day at 17:00 to keep you on track with your fitness goals.

    3. **Coach Privileges** 🏋️‍♂️
    - If you are a coach (a user with full access to the bot), you can use the following keywords for additional functionalities:
        - **"GLOBAL MESSAGE:"** 🌐: Use this keyword in your message to notify all members.
        - **"GET REPORT"** 📊: Use this keyword to view users' daily statuses.
    `;

    // Send the formatted reply
    ctx.replyWithMarkdownV2(escapeMarkdown(replyText));
})
bot.on('message', async (ctx: any) => {
    // handling privileged users
    if (privilegedUsernames.includes(ctx.update.message.from.username)) {
        if (ctx.update.message.text.includes('GLOBAL MESSAGE:')) {
            await messageAllUsers(ctx.update.message.text.split('GLOBAL MESSAGE:')[1])
            return
        }
    }

    // handle workout done
    if (acceptedKeywords.includes(ctx.update.message.text)) {
        await updateUsersDailyState(ctx.update.message.from.username)
        ctx.reply('🏋️‍♂️ GOOD JOB. YOUR CHANGES ARE SAVED!')
        return
    }

    // if nothing, reply
    ctx.reply(`THIS IS NO COMMAND!`)
})
