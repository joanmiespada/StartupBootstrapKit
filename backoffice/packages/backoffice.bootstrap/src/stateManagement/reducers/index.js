import {
    LOGIN_OPEN,
    LOGIN_CLOSE
  } from '../actions';
  
  import {state as initialState  } from '../state'
  
  
  
  export const reducers = (state = initialState, action) => {
      console.log(state)
    switch (action.type) {
      case LOGIN_OPEN:
        return [
          ...state
        ];
      case LOGIN_CLOSE:
        return [
          ...state
        ];
      default:
        return state;
    }
  };
  
  