import { combineReducers } from 'redux';
import login from './login/Reducers';

//import {reducers as userReducers} from 'backoffice-user'

console.log(userReducers)

export default combineReducers({
  login,
  userReducers
});
