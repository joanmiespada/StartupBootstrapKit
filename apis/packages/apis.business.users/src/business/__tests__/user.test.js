
import expect from 'expect'
import chance from 'chance'
import uuid from 'uuid/v1'
import path from 'path'
import dotenv from 'dotenv'

import {encrypt, firebase, mongodb, apiParams } from 'apis-core'

import {userLogic} from '../user'
import {userData} from '../../data/user'

import mongo from 'mongodb'

const isTravis = process.env.TRAVIS === true

if(!isTravis)
{
    const aux = path.join(__dirname,'../../../../../.env/env02.env')
    dotenv.config({ path: aux })
}

describe('user testing', ()=>{

    let storage = undefined;
    let userlayer, uToken, newuser

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
        
        userlayer = new userLogic( new userData( storage ) )

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
    let newId = undefined
    
    it('create new user', async ()=>{
        try{
            //let password = generator.generate({
            //    length: 10,
            //    numbers: true
            //});
            const password = 'pepe'

            newuser = {email:random.email() , name: random.name() , surname: random.name(), password: password}
            //const newuser = {email:'pepe5@notemail.uk.com' , name: 'josé' , surname: 'popo', password: 'pepe'}
            

            const result = await userlayer.createNewUser(uToken, newuser)
            
            newId = result.data.id;
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.id).toBeTruthy()
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })
    
    

    it('create new user with same email', async()=>{
        
        try{
            await userlayer.createNewUser(uToken, newuser)
        }catch(err){
            expect(err.result).toEqual(false)
            expect(err.error.codeError).toBeTruthy()
            expect(err.error.messageError).toBeTruthy()
        }

    })

    it('create new user missing info ', async()=>{
        
        try{
            await userlayer.createNewUser(uToken,{})
        }catch(err){
            expect(err.result).toEqual(false)
            expect(err.error.codeError).toBeTruthy()
            expect(err.error.messageError).toBeTruthy()
        }

    })
    
  
    it('check if email exist', async()=>{ 
        try{
            const result = await userlayer.checkIfMailExists(uToken, newuser.email)
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.exists).toEqual(true)
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('get user by id', async()=>{ 
        try{
            const result = await userlayer.getUserById(uToken,newId)
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.id).toEqual(newId)
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('get users by email', async()=>{ 
        try{
            const result = await userlayer.getUsersByEmail(uToken,newuser.email)
            
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data[0]).toBeDefined()
            expect(result.data[0].email).toEqual(newuser.email)
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('update users by id', async()=>{ 
        try{
            const result = await userlayer.updateUserById (uToken,newId,{email:random.email() })
        
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

     it('delete existing user', async()=>{ 
        try{
            const result = await userlayer.deleteUserById(uToken,newId)
        
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.deleted).toBeDefined()
            expect(result.data.deleted).toEqual(true)

        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('delete non existing user', async()=>{ 
        try{
            await userlayer.deleteUserById(uToken,'sdfsdfsdfsdf')
         
        }catch(result){
            expect(result).toBeDefined()
            expect(result.result).toEqual(false)
            expect(result.data.deleted).toBeDefined()
            expect(result.data.deleted).toEqual(false)
        }
    })

    it('get all users', async()=>{ 
        try{
            const params = {pageSize: 10, pageNumber:1}
            let result = await userlayer.getAllUsers (uToken,params)
            
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.users).toBeDefined()
            

        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })

    it('get all users with wrong page size', async()=>{ 
        try{
            const params = {pageSize: 10, pageNumber:1}
            await userlayer.getAllUsers (uToken,params)
            
        }catch(result){
            expect(result).toBeDefined()
            expect(result.result).toEqual(false)
            expect(result.error.codeError).toBeDefined()
            expect(result.error.messageError).toBeDefined()
            
        }
    })

    
})