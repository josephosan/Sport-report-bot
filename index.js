const axios = require('axios')
const express = require('express')
const { Pool } = require('pg')
const { Telegraf } = require('telegraf')


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
const app = express()
app.use(express.json())
// ==================== app and api ==================== //



// ==================== base variables ==================== //
let users
const PORT = 3000
// ==================== base variables ==================== //


// ==================== database functions ==================== //
const insertUser = async (user) => {
    let sameUser = false
    const getAllQuery = 'SELECT * FROM users'
    try {
        const { rows } = await pool.query(getAllQuery)
        sameUser = rows.some(u => u.username === user.username)
    } catch (err) {
        console.log(err)
    }

    if (sameUser) {
        console.log('This user already exists on db!')
        return
    }

    const query = `
        INSERT INTO users (username, chat_id, is_bot, language_code)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `

    try {
        const { rows } = await pool.query(query, [user.username, user.chat_id, user.is_bot, user.language_code])
        console.log(rows)
    } catch (err) {
        console.log(err)
    }
}
// ==================== database functions ==================== //

// ==================== tel bot functions ==================== //
bot.start((ctx) => ctx.reply('Hi!'))
bot.help((ctx) => ctx.reply('You asked help, None of my business!'))
bot.on('message', (ctx) => {
    console.log(ctx)
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
            return insertUser(user).catch(err => console.log(err))
        })

        return Promise.all(insertPromises)
    } catch (err) {
        console.log(err)
    }
}

const messageAllUsers = async (message = 'Global') => {
    const getAllQuery = 'SELECT * FROM users'
    let dbUsers
    try {
        const { rows } = await pool.query(getAllQuery)
        if (rows) dbUsers = rows
    } catch (err) {
        console.log(err)
    }

    if (!dbUsers || !dbUsers.length) {
        console.log("NO USER IN DB!")
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
        console.log(data)
    } catch (err) {
        console.log(err)
    }
}

const updateAndSendMessage = async () => {
    await getUpdates()
    await messageAllUsers()
    console.log('done!')
}
// ==================== tel bot functions ==================== //


bot.launch().then(() => {
    console.log('Bot launched successfully');
}).catch(err => {
    console.error('Error launching bot:', err.message);
});
// app.listen(PORT, () => {
//     console.log(`LISTENING ON PORT ${PORT} ...`)
// })