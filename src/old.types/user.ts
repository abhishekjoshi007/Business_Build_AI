import { OpenAIModel } from './openai'

export interface User {
  _id: string
  email: string
  password: string
  model: OpenAIModel
  role: 'admin' | 'user'
  credits: number
}

export interface UserUpdates {
  email: string
  model: OpenAIModel
  credits?: number
}
