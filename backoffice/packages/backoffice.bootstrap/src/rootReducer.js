import { combineReducers } from 'redux';
import login from './login/Reducers';

import * as users  from 'backoffice-users'

console.log(users.reducers)
const aux = users.reducers

export default combineReducers({
  login,
  aux
  //users.reducers
});
