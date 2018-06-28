
import { 
  LOGIN_REQUEST,
  LOGIN_RESPONSE,
  LOGIN_FAIL } from './types'

export const LoginOnRequest = (email, pass) => ({
  type: LOGIN_REQUEST,
  email,
  pass,
})

export const LoginOnReceived = (email, id, token) => ({
  type: LOGIN_RESPONSE,
  token,
  id,
  email,
})

export const LoginOnError = err => ({
  type: LOGIN_FAIL,
  error: err,
})



