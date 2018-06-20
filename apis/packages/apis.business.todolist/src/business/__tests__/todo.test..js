
import expect from 'expect'
import chance from 'chance'
import uuid from 'uuid/v1'
import path from 'path'
import dotenv from 'dotenv'

import {encrypt, firebase, mongodb, apiParams } from 'apis-core'
import {userLogic, userData} from 'apis-business-users'

import {todoLogic} from '../todo'
import {todoData} from '../../data/todo'
import {todoListLogic} from '../todolist'
import {todoListData} from '../../data/todolist'

import mongo from 'mongodb'

const isTravis = process.env.TRAVIS === true

if(!isTravis)
{
    const aux = path.join(__dirname,'../../../../../.env/env02.env')
    dotenv.config({ path: aux })
}

describe('todo testing', ()=>{

    let storage = undefined;
    let todoLayer, todoListlayer, userLayer, uToken

    

    beforeAll( async ()=> 
    {
         
        let client=undefined, database=undefined
        if(isTravis)
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
        
        todoLayer = new todoLogic( new todoData( storage ) )
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
    
    let todoListId = undefined // '6a42d0b0-72de-11e8-9eef-c3ed311ffb8b'
    let newTodo= undefined
    let newTodoList = undefined
    let userId = undefined

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
            
            newTodoList = {title:random.sentence() , description: random.paragraph(), owner: userId }
            const result = await todoListlayer.createNewTodoList(uToken, newTodoList)
            
            todoListId = result.data.id
            
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.id).toBeTruthy()
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })
    
    
    let firstTodoId = undefined

    it('create new todo', async ()=>{
        try{

            newTodo = {title:random.sentence() , description: random.paragraph() }
            const result = await todoLayer.createNewTodo(uToken, todoListId, newTodo)
            
            firstTodoId = result.data.id
            
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.id).toBeTruthy()
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('create new todo with same title', async()=>{
        
        try{
            await todoLayer.createNewTodo(uToken,todoListId, newTodo)
        }catch(err){
            expect(err.result).toEqual(false)
            expect(err.error.codeError).toBeTruthy()
            expect(err.error.messageError).toBeTruthy()
        }

    })

    it('create new todo missing info ', async()=>{
        
        try{
            await todoLayer.createNewTodo(uToken,todoListId,{})
        }catch(err){
            expect(err.result).toEqual(false)
            expect(err.error.codeError).toBeTruthy()
            expect(err.error.messageError).toBeTruthy()
        }

    })
    
  
    it('check if todo exist', async()=>{ 
        try{
            //const title= 'Bar nepus kos vudgim lusfehkos forwun buzzetbo we wufla bic idguv asadaw bineliw ap odu.'
            const result = await todoLayer.checkIfTodoExists(uToken, todoListId, newTodo.title) //newTodo.title
            //const result = await todoListlayer.checkIfTodoListExists(uToken, title, userId)
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.exists).toEqual(true)
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('adding 2n todo', async ()=>{
        try{
            
            const secondTodo = {title:random.sentence() , description: random.paragraph() }
            const result = await todoLayer.createNewTodo(uToken, todoListId, secondTodo)
            
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.id).toBeTruthy()
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })
    

    it('get todo by id', async()=>{ 
        try{
            //const newId = 'bcabe830-6f11-11e8-b3a2-f7bd6abed726'
            const result = await todoLayer.getTodoById(uToken,todoListId,firstTodoId)
            expect(result).toBeDefined()
            expect(result.result).toEqual(true) 
            expect(result.data.id).toEqual(firstTodoId)
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('get todo by wrong  id', async()=>{ 
        try{
            //const newId = 'bcabe830-6f11-11e8-b3a2-f7bd6abed726'
            await todoLayer.getTodoById(uToken,todoListId,'gsdfgsdg-235ertwg')
            
        }catch(err){    
            expect(err.result).toEqual(false)
            expect(err.error.codeError).toBeTruthy()
            expect(err.error.messageError).toBeTruthy()
        }
    })

    it('get all todos from one list', async()=>{ 
        try{
            
            //const todoListId2='fd04d430-72fb-11e8-b807-095db1c7dc34'
            const params = {pageSize: 10, pageNumber:1}

            let result = await todoLayer.getAllTodos (uToken,todoListId,params)
           
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.todos).toBeDefined()
           // expect(result.data.totalTodoLists).toBeDefined()
            
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('update todo by id', async()=>{ 
        try{
            //const newId = 'bcabe830-6f11-11e8-b3a2-f7bd6abed726'
            const result = await todoLayer.updateTodoById (uToken,todoListId,firstTodoId,{title:random.sentence() })
        
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

     it('delete existing todo', async()=>{ 
        try{
            //const newId = 'bcabe830-6f11-11e8-b3a2-f7bd6abed726'
            const result = await todoLayer.deleteTodoById(uToken,todoListId,firstTodoId)
        
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.deleted).toBeDefined()
            expect(result.data.deleted).toEqual(true)

        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    

    it('delete original todo list', async()=>{ 
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