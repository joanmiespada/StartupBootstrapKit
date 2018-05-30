import { combineReducers } from 'redux';
import login from './login/Reducers';

import * as userReducers  from 'backoffice-users'

console.log(userReducers)

export default combineReducers({
  login,
  userReducers
});
