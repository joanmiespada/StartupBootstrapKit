import {
  LOGIN_REQUEST,
  LOGIN_RESPONSE,
  LOGIN_FAIL,
} from './actions';

import {state as initialState  } from './state'



export const reducers = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return [
        ...state,
        {
          email: action.email,
          loginSpining: true
        },
      ];
    case LOGIN_RESPONSE:
      return [
        ...state,
        {
          email: action.email,
          loginSpining: false,
          apiToken: action.token,
          userId: action.id,
          loginTimeStamp: Date.now(),
        },
      ];
    case LOGIN_FAIL:
      return [
        ...state,
        {
          loginSpining: false,
          error: action.error,
        },
      ];
    default:
      return state;
  }
};

