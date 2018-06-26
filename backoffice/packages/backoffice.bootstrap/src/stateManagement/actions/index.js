import { 
    LOGIN_OPEN,
    LOGIN_CLOSE
} from '../types'
  
export const LoginOnOpen = () =>  ({
        type: LOGIN_OPEN
})

export const LoginOnClose = () => ({
    type: LOGIN_CLOSE
})

