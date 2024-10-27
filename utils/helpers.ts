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
        const res = await fetch(url)
        const jsonRes = res.json()
        const count = JSON.stringify(jsonRes).match(/اتمام نوبت/g)
        await messageOneUserByUsername('josephosan', `${count} hi`)
    } catch (err) {}
}