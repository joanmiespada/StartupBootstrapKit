import {bootstrap} from 'apis-core'

import {todoListLogic, todoListData, todoLogic, todoData} from 'apis-business-todolist'


import todolistapi from './todolist'
import todoapi from './todo'


//const obj = (routing, storage)=> { return  new todolistapi(routing, new userLogic( new userData( storage  ))) }
const obj1 = (routing, storage)=> { return  new todolistapi(routing, new todoListLogic( new todoListData( storage  ))) }
const obj2 = (routing, storage)=> { return  new todoapi(routing, new todoLogic( new todoData( storage  ))) }

bootstrap({
  port: 8082,
  version:'/v1',
  logic: [obj1, obj2],
  description: 'todolist'
})
