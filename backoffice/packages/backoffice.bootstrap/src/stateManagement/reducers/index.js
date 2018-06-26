import {
    LOGIN_OPEN,
    LOGIN_CLOSE
  } from '../types';
  
import {state as initialState  } from '../state'
  

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
  
  