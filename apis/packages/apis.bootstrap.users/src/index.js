import {bootstrap} from 'apis-core'
import {userLogic, userData} from 'apis-business-users'
import userapi from './user'

const obj = (routing)=> { return  new userapi(routing, new userLogic( new userData())) }

bootstrap({
  port: 8081,
  version:'/v1',
  logic: obj,
  description: 'users'
})
