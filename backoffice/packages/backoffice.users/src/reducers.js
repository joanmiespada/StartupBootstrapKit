import {
    USER_GETALL_REQUEST, 
    USER_GETALL_RESPONSE, 
    USER_GETALL_FAIL
} from './actions';
  
export const reducers = (state = [], action) => {
    switch (action.type) {
      case USER_GETALL_REQUEST:
        return [
          ...state,
          {          
            loadingSpining: true,
          },
        ];
      case USER_GETALL_RESPONSE:
        return [
          ...state,
          {
            usersPage: action.users,
            loadingSpining: false,
          },
        ];
      case USER_GETALL_FAIL:
        return [
          ...state,
          {
            loadingSpining: false,
            error: action.error,
          },
        ];
      default:
        return state;
    }
  };
 