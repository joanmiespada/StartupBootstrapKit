import expect from 'expect'
import path from 'path'
import dotenv from 'dotenv'
import mongo from 'mongodb'

import {firebase, mongodb } from 'apis-core'

import {loginLogic} from '../login'
import {loginData} from '../../data/login'

const isTravis = process.env.TRAVIS === true

if(!isTravis)
{
    const aux = path.join(__dirname,'../../../../../.env/env02.env')
    dotenv.config({ path: aux })
}

describe('login testing', ()=>{

    let storage = undefined;
    let loginLayer

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

            client = await mongo.MongoClient.connect('mongodb://localhost:27017'); 
            database = await client.db('db');

            storage.start( {client, database})
        }
        
        loginLayer = new loginLogic( new loginData( storage ) )

    })

    afterAll( ()=>
    {
        storage.close()
    })

    const user = {email:'fol@he.ni' , password: 'pepe'}
    
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

})