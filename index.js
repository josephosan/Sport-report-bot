const axios = require('axios')
const { Pool } = require('pg')
const { Telegraf } = require('telegraf')
const schedule = require('node-schedule')
const winston = require('winston')

// ==================== base constants ==================== //
const api_token = '7225296585:AAEhMD18-ORk0At8_POKvStNTzOPFCr9xdk'
const baseURL = `https://api.telegram.org/bot${api_token}/`
// ==================== base constants ==================== //



// ==================== app and api ==================== //
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sportreport',
    password: '12345678',
    port: 5432,
})
const api = axios.create({
    baseURL
})
const bot = new Telegraf(api_token)
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'application.log' })
    ]
});
// ==================== app and api ==================== //



// ==================== base variables ==================== //
let users
const privilegedUsernames = ['josephosan']
const acceptedKeywords = ['DONE', 'COMPLETE', 'I\'VE DONE MY WORKOUT', 'TODAY IS DONE']
const repeatMessageTime = '0 17 * * *'
// ==================== base variables ==================== //


// ==================== database functions ==================== //
const insertUser = async (user) => {
    let sameUser = false
    const findUser = `SELECT * FROM users WHERE username = '${user.username}'`
    try {
        const { rows } = await pool.query(findUser)
        sameUser = rows.length
    } catch (err) {
        console.log(err.message)
    }

    if (sameUser) {
        logger.warn('User exists', { message: 'This user already exists on db!' })
        return
    }

    const query = `
        INSERT INTO users (username, chat_id, is_bot, language_code)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `

    try {
        const { rows } = await pool.query(query, [user.username, user.chat_id, user.is_bot, user.language_code])
    } catch (err) {
        logger.error('Catch Error', err.message)
    }
}

const updateUsersDailyState = async (username) => {
    let userData = undefined
    const getUserQuery = `SELECT * FROM users WHERE username = '${username}'`

    try {
        const { rows } = await pool.query(getUserQuery)
        userData = rows[0]
    } catch (err) {
        console.log(err.message)
    }

    if (!userData) {
        logger.warn('USER NOT FOUND', { message: "requested user not found!" })
        return
    }

    console.log(userData)
}
// ==================== database functions ==================== //

// ==================== tel bot functions ==================== //
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
bot.on('message', async (ctx) => {
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


const getUpdates = async () => {
    try {
        const { data } = await api.get('/getUpdates')
        const userIds = []
        users = data.result.map(item => {
            const from = item.message.from
            if (!userIds.includes(from.id)) {
                userIds.push(from.id)
                return { ...from, chat_id: from.id }
            }
        }).filter(item => item)

        const insertPromises = users.map(user => {
            return insertUser(user).catch(err => logger.error('Catch Error', err.message))
        })

        return Promise.all(insertPromises)
    } catch (err) {
        logger.error('Catch Error', err.message)
    }
}

const messageAllUsers = async (message = 'Global') => {
    const getAllQuery = 'SELECT * FROM users'
    let dbUsers
    try {
        const { rows } = await pool.query(getAllQuery)
        if (rows) dbUsers = rows
    } catch (err) {
        logger.error('Catch Error', err.message)
    }

    if (!dbUsers || !dbUsers.length) {
        logger.warn('No user in db!', { message: 'There is no user in database to notify!' })
        return
    }

    const promises = dbUsers.map(user => {
        return api.post(`/sendMessage?chat_id=${user.chat_id}&text=${message}`).catch(err => console.log(err))
    })

    await Promise.all(promises)
}

const getMe = async () => {
    try {
        const { data } = await api.get('getMe')
    } catch (err) {
        logger.error('Catch Error', err.message)
    }
}
// ==================== tel bot functions ==================== //


// ==================== running jobs ==================== //
const globalMessageJob = schedule.scheduleJob(repeatMessageTime, async () => {
    await messageAllUsers('Did you do your workout?')
})
// ==================== running jobs ==================== //

// ==================== utils ==================== //
const escapeMarkdown = (text) => {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
};
// ==================== utils ==================== //




bot.launch().then(() => {
    logger.info('Bot Launched!')
}).catch(err => {
    logger.error('Catch Error', err.message)
});