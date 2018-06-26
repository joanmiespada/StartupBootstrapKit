import {
    LOGIN_OPEN,
    LOGIN_CLOSE
  } from '../types/login';
  
import {state as initialState  } from '../state/login'
  

export const reducers = (state = initialState, action) => {

  switch (action.type) {
    case LOGIN_OPEN:
      return Object.assign({},state,{loginShowed:true});
    case LOGIN_CLOSE:
      return Object.assign({},state,{loginShowed:false});
      
    default:
      return state;
  }
};
  
  