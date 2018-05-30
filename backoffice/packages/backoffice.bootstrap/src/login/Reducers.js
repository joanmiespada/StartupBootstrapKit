import {
  LOGIN_REQUEST,
  LOGIN_RESPONSE,
  LOGIN_FAIL,
} from './Actions';

const reducers = (state = [], action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return [
        ...state,
        {
          email: action.email,
          loginSpining: true,
          //token: undefined,
          //loginTimeStamp: undefined,
        },
      ];
    case LOGIN_RESPONSE:
      return [
        ...state,
        {
          email: action.email,
          loginSpining: false,
          token: action.token,
          userid: action.id,
          loginTimeStamp: Date.now(),
        },
      ];
    case LOGIN_FAIL:
      return [
        ...state,
        {
          //email: undefined,
          loginSpining: false,
          //token: undefined,
          //loginTimeStamp: undefined,
          error: action.error,
        },
      ];
    default:
      return state;
  }
};
export default reducers;
