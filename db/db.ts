import { Pool } from 'pg';
import { User } from '../types/types';
import { logger } from '../log/logger';
import { dbPassword, dbUser } from '../config/config';

const pool = new Pool({
  user: dbUser,
  host: 'localhost',
  database: 'sportreport',
  password: dbPassword,
  port: 5432,
});

export const insertUser = async (user: User) => {
  let sameUser = false;
  const findUser = `SELECT * FROM users WHERE username = '${user.username}'`;
  try {
    const { rows } = await pool.query(findUser);
    sameUser = rows.length !== 0;
  } catch (err) {
    console.log(err.message);
  }

  if (sameUser) {
    logger.warn('User exists', { message: 'This user already exists on db!' });
    return;
  }

  logger.info('New User', user);

  const query = `
        INSERT INTO users (username, chat_id, is_bot, language_code)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;

  try {
    const { rows } = await pool.query(query, [
      user.username,
      user.id,
      user.is_bot,
      user.language_code,
    ]);
  } catch (err) {
    logger.error('Catch Error', err);
  }
};

export const insertUsersDailyInfo = async (user: User, info: string) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const insertQuery = `
        INSERT INTO status (user_id, date, info)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, date)
        DO UPDATE SET info = EXCLUDED.info
        `;
    const { rows } = await pool.query(insertQuery, [user.id, date, info]);
  } catch (err) {
    logger.error('Catch Error', { message: err.message });
  }
};

export const updateUsersDailyState = async (
  username: string,
  info = 'Done'
) => {
  let userData: User | undefined = undefined;
  const getUserQuery = `SELECT * FROM users WHERE username = '${username}'`;

  try {
    const { rows } = await pool.query(getUserQuery);
    userData = rows[0];
  } catch (err) {
    logger.error('Catch Error', { message: err.message });
  }

  if (!userData) {
    logger.warn('USER NOT FOUND', { message: 'requested user not found!' });
    return;
  }

  // insert users info
  await insertUsersDailyInfo(userData, info);
};

export const getAllUsers = async () => {
  try {
    const getAllQuery = 'SELECT * FROM users';
    const { rows } = await pool.query(getAllQuery);
    return rows;
  } catch (err) {
    logger.error('Catch Error', err.message);
  }
};

export const getOneUserByUsername: (username: string) => Promise<User> = async (
  username: string
) => {
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  try {
    const { rows } = await pool.query(query);
    return rows[0];
  } catch (err) {
    logger.error('Fetch user', { message: 'Error on Fetch single user', err });
  }
};

export const initializeDailyStatus = async () => {
  const query = `
        INSERT INTO status (user_id, date, info)
        SELECT id, CURRENT_DATE, 'Not Done'
        FROM users,
        ON CONFLICT (user_id, date)
        DO NOTHING;
    `;
  try {
    const { rows } = await pool.query(query);
  } catch (err) {
    logger.error('Catch Error', err.message);
  }
};

export const getSingleUserReport = async (username: string) => {
  if (!username || username === '') return [];

  const query = `
        SELECT 
            u.id,
            u.username,
            u.chat_id,
            u.is_bot,
            u.language_code,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', s.id,
                        'date', s.date,
                        'info', s.info
                    )
                ) FILTER (WHERE s.id IS NOT NULL), '[]'
            ) AS statuses
        FROM users u 
        LEFT JOIN status s ON u.id = s.user_id
        WHERE u.username = '${username}'
        GROUP BY 
            u.id, u.username, u.chat_id, u.is_bot, u.language_code;
    `;
  try {
    const { rows } = await pool.query(query);
    return rows[0];
  } catch (err) {
    logger.error('Catch Error', err);
  }
};

export const getAllUsersReports = async () => {
  const query = `
        SELECT 
            u.id,
            u.username,
            u.chat_id,
            u.is_bot,
            u.language_code,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', s.id,
                        'date', s.date,
                        'info', s.info
                    )
                ) FILTER (WHERE s.id IS NOT NULL), '[]'
            ) AS statuses
        FROM users u 
        LEFT JOIN status s ON u.id = s.user_id
        GROUP BY 
            u.id, u.username, u.chat_id, u.is_bot, u.language_code;
    `;

  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (err) {
    logger.error('Catch Error', err);
  }
};

export const insertUsersMessage = async (
  uId: number,
  username,
  message: string
) => {
  const query = `
        INSERT INTO messages (user_id, username, message) 
        VALUES ($1, $2, $3);
    `;

  try {
    const { rows } = await pool.query(query, [uId, username, message]);
    return rows;
  } catch (err) {
    logger.error('Catch Error', {
      message: 'Failed to insert users message',
      err,
    });
  }
};

export const setDailyCurrencyCronString = async (
  userId: number,
  cron: string
) => {
  const query = `
    INSERT INTO settings (daily_currency_job_cron, user_id)
    VALUES ($1, $2)
  `;

  try {
    const { rows } = await pool.query(query, [cron, userId]);
    return rows;
  } catch (err) {
    logger.error('Catch Error on setting daily cron, on query', {
      message: `Failed to add cron for user ${userId} with cron ${cron}`,
      err,
    });
  }
};

export const getUsersMessagesByUsername: (
  username: string
) => Promise<any[] | undefined> = async (username: string) => {
  const query = `
        SELECT * FROM messages WHERE username = '${username}'
    `;

  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (err) {
    logger.error('Users messages', {
      message: 'Failed to get users messages',
      err,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                              database creation                             */
/* -------------------------------------------------------------------------- */
/*
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    chat_id BIGINT,
    is_bot BOOLEAN DEFAULT FALSE,
    language_code VARCHAR(10)
);
CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    info VARCHAR(255),
    UNIQUE (user_id, date),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    message TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    daily_currency_job_cron VARCHAR(255)
);
*/
