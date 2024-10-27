import { User } from "../types/types";
import { logger } from "../log/logger";
import { api } from "../api/api";
import { insertUser, getAllUsers, getOneUserByUsername } from "../db/db";
import { dailyQuoteUrl } from "../config/config";

export const getUpdates = async () => {
    try {
        const { data } = await api.get('/getUpdates');
        const userIds: number[] = [];
        const users: User[] = data.result.map((item: any) => {
            const from = item.message.from;
            if (!userIds.includes(from.id)) {
                userIds.push(from.id);
                return { ...from, chat_id: from.id };
            }
        }).filter((item: User | undefined) => item) as User[];

        const insertPromises = users.map(user => {
            return insertUser(user).catch(err => logger.error('Catch Error', err.message));
        });

        await Promise.all(insertPromises);
    } catch (err) {
        logger.error('Catch Error', err.message);
    }
}

export const messageAllUsers = async (message = 'Global') => {
    let dbUsers = await getAllUsers()


    if (!dbUsers || !dbUsers.length) {
        logger.warn('No user in db!', { message: 'There is no user in database to notify!' })
        return
    }

    const promises = dbUsers.map(user => {
        return api.post(`/sendMessage?chat_id=${user.chat_id}&text=${message}`).catch(err => console.log(err))
    })

    await Promise.all(promises)
}

export const messageOneUserByUsername = async (uName: string, message: string) => {
    try {
        const user = await getOneUserByUsername(uName)
        if (!user) return

        await api.post(`/sendMessage?chat_id=${user.chat_id}&text=${message}`)
    } catch (err) { }
}

export const getMe = async () => {
    try {
        const { data } = await api.get('getMe')
    } catch (err) {
        logger.error('Catch Error', err.message)
    }
}

export const escapeMarkdown = (text) => {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

export const getQuote = async () => {
    return (await api.get(dailyQuoteUrl)).data.quote.body
}

// customized
export const checkIfHasNobat = async () => {
    const url = 'http://nobat.dfm.tehranedu.ir/QueueWeb/SimpleQ/GetDates?ItemId=176'
    try {
        const response = await fetch(url);
        const text = await response.text();
        
        const count = (text.match(/اتمام نوبت/g) || []).length;
        const date = new Date()

        if (count < 12) {
            await messageOneUserByUsername('josephosan', `At: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}, Filled: ${count}, Remains: ${12 - count}`)
            await messageOneUserByUsername('Asfas72', `At: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}, Filled: ${count}, Remains: ${12 - count}`)
        } else {
            await messageOneUserByUsername('josephosan', `At: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}, Filled: ${count}, Remains: ${12 - count}`)
        }
    } catch (err) {}
}

export const getCurrencies = async () => {
    const url = 'https://api.nobitex.ir/market/stats'
    try {
        const response = await fetch(url)
        const data = await response.json()
        const date = new Date()

        await messageOneUserByUsername(
            'josephosan', 
            `Dollar best sell at ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}: ${data["usdt-rls"]?.bestSell} Toman`
        )
    } catch (err) {}
}