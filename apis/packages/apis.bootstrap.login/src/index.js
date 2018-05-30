import {bootstrap} from 'apis-core'
import loginapi from './login'
import {loginData, loginLogic} from 'apis-business-login'

const obj = (routing)=> { return  new loginapi(routing, new loginLogic( new loginData())) }

bootstrap({
  port: 8080,
  version:'/v1',
  logic: obj,
  description: 'login'
})
