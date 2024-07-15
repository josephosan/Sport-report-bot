import { Telegraf } from 'telegraf'
import { logger } from '../log/logger'
import { escapeMarkdown, messageAllUsers, getUpdates } from '../utils/helpers'
import { api_token, privilegedUsernames, acceptedKeywords, reportKeyWord, globalMessageKeyWord, getAllUsersKeyWord, getPrivilegedUsernamesKeyWord, dailyQuoteUrl } from '../config/config'
import { getAllUsers, getAllUsersReports, getSingleUserReport, insertUser, updateUsersDailyState } from '../db/db'
import { api } from '../api/api'

if (!api_token) logger.error('NO Api Token', { message: 'no api token!' })
export const bot = new Telegraf(api_token as string)

bot.start(async (ctx: any) => {
    await insertUser({ ...ctx.update.message.from })
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
    const msg = ctx.update.message
    // handling privileged users
    if (privilegedUsernames.includes(msg.from.username)) {

        // get privileged usernames
        if (msg.text.includes(getPrivilegedUsernamesKeyWord)) {
            const dp = JSON.stringify(privilegedUsernames)

            ctx.replyWithMarkdownV2(escapeMarkdown(dp))
            return
        }

        // global messaging
        if (msg.text.includes(globalMessageKeyWord)) {
            await messageAllUsers(msg.text.split(globalMessageKeyWord)[1])
            return
        }

        // handle getting reports 
        if (msg.text.includes(reportKeyWord)) {
            ctx.reply('preparing ...')
            const uName = msg.text.split(reportKeyWord)[1]

            // get all users reports
            if (!uName || uName === '') {
                const usersReports = await getAllUsersReports()

                const dc = JSON.stringify(usersReports)

                ctx.replyWithMarkdownV2(escapeMarkdown(dc))
                return
            }

            const data = await getSingleUserReport(uName)
	    
            if (!data) {
                ctx.reply('No such user')
                return
            }

            const dc = JSON.stringify(data)

            ctx.replyWithMarkdownV2(escapeMarkdown(dc))
            return
        }

        // get all users
        if (msg.text.includes(getAllUsersKeyWord)) {
            const allUsers = await getAllUsers()

            if (!allUsers || !allUsers.length) {
                ctx.reply('No user in DB!')
                return
            }

            const dp = JSON.stringify(allUsers)

            ctx.replyWithMarkdownV2(escapeMarkdown(dp))
            return
        }
    }

    // handle workout done
    if (acceptedKeywords.includes(msg.text)) {
        try {
            ctx.reply('Processing ...')
            await updateUsersDailyState(msg.from.username, msg.text)
            const { quote }: any = await api.get(dailyQuoteUrl)
            ctx.reply(`🏋️‍♂️ GOOD JOB. YOUR CHANGES ARE SAVED! \n Quote of the day: ${quote.body}`)
        } catch (err) {
            logger.error('Daily quote', { err })
            ctx.reply('An unexpected error!')
        }
        return
    }

    // if nothing, reply
    ctx.reply(`THIS IS NO COMMAND!`)
})
