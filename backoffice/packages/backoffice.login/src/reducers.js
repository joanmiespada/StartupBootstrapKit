import {
  LOGIN_REQUEST,
  LOGIN_RESPONSE,
  LOGIN_FAIL,
} from './types';

import {state as initialState  } from './state'

export const reducers = (state = initialState, action) => {
  
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({},state,
        {
          email: action.email,
          loginSpining: true,
          error: undefined
        },
      )
    case LOGIN_RESPONSE:
      return Object.assign({},state,
        {
          email: action.email,
          loginSpining: false,
          apiToken: action.token,
          userId: action.id,
          loginTimeStamp: Date.now(),
        },
      )
    case LOGIN_FAIL:
      return Object.assign({},state,
        {
          loginSpining: false,
          error: action.error,
        },
      )
    default:
      return state;
  }
};

