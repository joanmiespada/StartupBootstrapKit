import expect from 'expect'
import path from 'path'
import dotenv from 'dotenv'
import mongo from 'mongodb'
import chance from 'chance'

import {firebase, mongodb,apiParams } from 'apis-core'
import {userLogic, userData} from 'apis-business-users'


import {loginLogic} from '../login'
import {loginData} from '../../data/login'

if(process.env.PASSWORD_JWT === undefined)
{
    const aux = path.join(__dirname,'../../../../../.env/env02.env')
    dotenv.config({ path: aux })
}

describe('login testing', ()=>{

    let storage = undefined;
    let loginLayer,userLayer

    beforeAll( async ()=> 
    {
         
        let client=undefined, database=undefined

        const dbengine = process.env.DBENGINE | 'mongo'

        if(dbengine === 'firebase')
        {
            storage = new firebase();
            storage.start()
        }
        else {
            storage = new mongodb();

            client = await mongo.MongoClient.connect(`mongodb://${apiParams.mongo.host}:${apiParams.mongo.port}`); 
            database = await client.db(apiParams.mongo.database);

            storage.start( {client, database})
        }
        
        loginLayer = new loginLogic( new loginData( storage ) )
        userLayer = new userLogic( new userData( storage ) )

        

    })

    afterAll( ()=>
    {
        storage.close()
    })

    let user// = {email:'fol@he.ni' , password: 'pepe'}
    let newId

    it('create new user', async ()=>{
        try{
            //let password = generator.generate({
            //    length: 10,
            //    numbers: true
            //});
            const password = 'pepe'
            const random = new chance()

            user = {email:random.email() , name: random.name() , surname: random.name(), password: password}
            //const newuser = {email:'pepe5@notemail.uk.com' , name: 'josé' , surname: 'popo', password: 'pepe'}
            

            const result = await userLayer.createNewUser(undefined, user, false)
            
            newId = result.data.id;
            expect(result).toBeDefined()
            expect(result.result).toEqual(true)
            expect(result.data.id).toBeTruthy()
        }catch(err){
            console.log(err) //eslint-disable-line
            expect(false).toEqual(true)
        }
    })
    
    it('login ok', async()=>{ 
        const result = await loginLayer.login(user.email, user.password)
        
        expect(result.result).toEqual(true)
        expect(result.data.login).toEqual(true)
        expect(result.data.token).toBeTruthy()
        expect(result.data.id).toBeTruthy()
    })
    
    it('login fail', async()=>{ 
        const result = await loginLayer.login(user.email, user.password+'password')
        
        expect(result.result).toEqual(true)
        expect(result.data.login).toEqual(false)
    })

    it('login missing params', async()=>{ 
        
        try{
            await loginLayer.login(undefined, undefined)
        }catch(err)
        {
            expect(err.result).toEqual(false)
            expect(err.error.codeError).toBeTruthy()
            expect(err.error.messageError).toBeTruthy()
            
        }
    })

    it('delete existing user', async()=>{ 
        try{
            const result = await userLayer.deleteUserById(undefined,newId,false)
        
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