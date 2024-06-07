import axios from "axios"
import { baseURL } from "../config/config"

export const api = axios.create({
    baseURL
})
