
import expect from 'expect'
import chance from 'chance'
import uuid from 'uuid/v1'
import path from 'path'
import dotenv from 'dotenv'

import {encrypt, firebase, mongodb, apiParams } from 'apis-core'
import {userLogic, userData} from 'apis-business-users'

import {todoListLogic} from '../todolist'
import {todoListData} from '../../data/todolist'

import mongo from 'mongodb'

if(process.env.PASSWORD_JWT === undefined)
{
    const aux = path.join(__dirname,'../../../../../.env/env02.env')
    dotenv.config({ path: aux })
}

describe('todoList testing', ()=>{

    let storage = undefined;
    let todoListlayer, userLayer, uToken, newTodoList

    beforeAll( async ()=> 
    {
         
        let client=undefined, database=undefined
        const dbengine = process.env.DBENGINE | 'mongo'

        if(dbengine === 'firebase')
        {
            storage = new firebase();
            storage.start()
        }
        else{
            storage = new mongodb();

            client = await mongo.MongoClient.connect(`mongodb://${apiParams.mongo.host}:${apiParams.mongo.port}`); 
            database = await client.db(apiParams.mongo.database);

            storage.start( {client, database})
        }
        
        todoListlayer = new todoListLogic( new todoListData( storage ) )
        userLayer = new userLogic( new userData( storage ) )

        const userLogged = {
            id: uuid(),
            profiles:['admin', 'user'] //add roles here 
        }    
        uToken = encrypt.createJWTtoken(userLogged)

       
    })

    afterAll( ()=>
    {
        storage.close()
    })

    const random = new chance()
    let userId = undefined, todoListId =undefined
    //const userId = 'b0b62410-697f-11e8-a306-0707e0b7a7f3'
    
    it('create new user', async ()=>{
        try{
            
            const password = 'pepe'
            const random = new chance()

            const user = {email:random.email() , name: random.name() , surname: random.name(), password: password}
            
            

            const result = await userLayer.createNewUser(uToken, user)
            
            userId = result.data.id;
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.id).toBeTruthy()
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })
    
    it('create new todoList', async ()=>{
        try{
            newTodoList = { title:random.sentence() , 
                            description: random.paragraph(), 
                            owner: userId }
            const result = await todoListlayer.createNewTodoList(uToken, newTodoList)
            
            todoListId = result.data.id
            //console.log(newId)//eslint-disable-line
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.id).toBeTruthy()
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('create new todo list with same title', async()=>{
        
        try{
            await todoListlayer.createNewTodoList(uToken, newTodoList)
        }catch(err){
            expect(err.result).toEqual(false)
            expect(err.error.codeError).toBeTruthy()
            expect(err.error.messageError).toBeTruthy()
        }

    })

    it('create new todo list missing info ', async()=>{
        
        try{
            await todoListlayer.createNewTodoList(uToken,{})
        }catch(err){
            expect(err.result).toEqual(false)
            expect(err.error.codeError).toBeTruthy()
            expect(err.error.messageError).toBeTruthy()
        }

    })
    
  
    it('check if todo list exist', async()=>{ 
        try{
            //const title= 'Wij omowiivo vagas lipadav goc ki lutapa ucakkep um ado ut das humotvot pigema caraap opagasze.'
            const result = await todoListlayer.checkIfTodoListExists(uToken, newTodoList.title, userId)
            //const result = await todoListlayer.checkIfTodoListExists(uToken, title, userId)
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.exists).toEqual(true)
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('get todo list by id', async()=>{ 
        try{
            //const newId = 'bcabe830-6f11-11e8-b3a2-f7bd6abed726'
            const result = await todoListlayer.getTodoListById(uToken,todoListId)
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.id).toEqual(todoListId)
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('update todo list by id', async()=>{ 
        try{
            //const newId = 'bcabe830-6f11-11e8-b3a2-f7bd6abed726'
            const result = await todoListlayer.updateTodoListById (uToken,todoListId,{title:random.sentence() })
        
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

     it('delete existing todo list', async()=>{ 
        try{
            //const newId = 'bcabe830-6f11-11e8-b3a2-f7bd6abed726'
            const result = await todoListlayer.deleteTodoListById(uToken,todoListId)
        
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.deleted).toBeDefined()
            expect(result.data.deleted).toEqual(true)

        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('delete non existing todo list', async()=>{ 
        try{
            await todoListlayer.deleteTodoListById(uToken,'sdfsdfsdfsdf')
         
        }catch(result){
            expect(result).toBeDefined()
            expect(result.result).toEqual(false)
            expect(result.data.deleted).toBeDefined()
            expect(result.data.deleted).toEqual(false)
        }
    })

    it('get all todo lists', async()=>{ 
        try{
            
            const params = {pageSize: 10, pageNumber:1}
            let result = await todoListlayer.getAllTodoLists (uToken,params,todoListId)
            
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.todoLists).toBeDefined()
           // expect(result.data.totalTodoLists).toBeDefined()
            
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('delete user', async()=>{ 
        try{
            const result = await userLayer.deleteUserById(uToken,userId)
        
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.deleted).toBeDefined()
            expect(result.data.deleted).toEqual(true)

        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

})