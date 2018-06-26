import { 
    LOGIN_OPEN,
    LOGIN_CLOSE
} from '../types/login'
  
export const LoginOnOpen = () =>  ({
        type: LOGIN_OPEN
})

export const LoginOnClose = () => ({
    type: LOGIN_CLOSE
})