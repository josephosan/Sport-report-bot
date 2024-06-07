export interface User {
    id?: number
    username: string
    chat_id: string
    is_bot: boolean
    language_code: string
}

export interface Status {
    id?: number
    user_id: number
    date: string
    info: string
}