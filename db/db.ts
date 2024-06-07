import { Pool } from 'pg'
import { User } from '../types/types'
import { logger } from '../log/logger'


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sportreport',
    password: '12345678',
    port: 5432,
})

export const insertUser = async (user: User) => {
    let sameUser = false
    const findUser = `SELECT * FROM users WHERE username = '${user.username}'`
    try {
        const { rows } = await pool.query(findUser)
        sameUser = rows.length !== 0
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

export const insertUsersDailyInfo = async (user: User, info: string) => {
    try {
        const date = new Date().toISOString().split('T')[0]
        const insertQuery = `
        INSERT INTO status (user_id, date, info)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, date)
        DO UPDATE SET info = EXCLUDED.info
        `;
        const { rows } = await pool.query(insertQuery, [user.id, date, info])
    } catch (err) {
        logger.error('Catch Error', { message: err.message })
    }
}

export const updateUsersDailyState = async (username: string) => {
    let userData: User | undefined = undefined
    const getUserQuery = `SELECT * FROM users WHERE username = '${username}'`

    try {
        const { rows } = await pool.query(getUserQuery)
        userData = rows[0]
    } catch (err) {
        logger.error('Catch Error', { message: err.message })
    }

    if (!userData) {
        logger.warn('USER NOT FOUND', { message: "requested user not found!" })
        return
    }

    // insert users info
    await insertUsersDailyInfo(userData, 'Done')
}

export const getAllUsers = async () => {
    try {
        const getAllQuery = 'SELECT * FROM users'
        const { rows } = await pool.query(getAllQuery)
        if (rows) return rows
    } catch (err) {
        logger.error('Catch Error', err.message)
    }
}