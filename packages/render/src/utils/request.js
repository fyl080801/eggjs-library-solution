import axios from 'axios'
import { prefix } from './app'

export const request = axios.create({
  baseURL: prefix,
})
