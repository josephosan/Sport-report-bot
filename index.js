const axios = require('axios')
const express = require('express')
const { Pool } = require('pg')


// ==================== base constants ==================== //
const api_token = '7225296585:AAEhMD18-ORk0At8_POKvStNTzOPFCr9xdk'
const baseURL = `https://api.telegram.org/bot${api_token}/`


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
const app = express()
app.use(express.json())



// ==================== base variables ==================== //
let users


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

// ==================== tel bot functions ==================== //
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

const updateAndSendMessage = async () => {
    await getUpdates()
    await messageAllUsers()
    console.log('done!')
}


updateAndSendMessage()