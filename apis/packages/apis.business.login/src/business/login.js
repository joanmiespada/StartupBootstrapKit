
import {encrypt, utils as _u } from 'apis-core'
import messages from '../support/messages'
import errCodes from '../support/errorcodes'
import keys from '../support/keys'

export class loginLogic
{
    constructor( dataaccess)
    {
        this.userdata = dataaccess
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //Just for test
    loginErr()
    {
        return new Promise(async (resolve) => {

            await this.sleep(2000)
            resolve( _u.jsonOK( {login:false, 
                message: messages.errNotUserFoundByEmail,
                code: errCodes.errNotUserFoundByEmail
             },{login:'bool', message:'string', code:'number' } )) 

        })
    }

    login(email, password)
    {
        return new Promise( (resolve,reject) => {

            if(email === undefined || password === undefined )
            {    // throw new Error(messages.errNoEmailandPassword)   
                reject( _u.jsonError(keys.errNoEmailandPassword,errCodes,messages ) )
                return
            }
            
            this.userdata.login(email, password).then( (result) =>{
                
                if(result.login)
                    {
                        const info = {
                            //name: result.data.name,
                            id: result.id ,
                            profiles:['admin', 'user'] //add roles here 
                        }    
                        let token = encrypt.createJWTtoken(info)
                        resolve(  _u.jsonOK( {login:true, token:token, id:result.id }, {login:'bool', token:'string', id:'uuid'} ) )
                    }
                else
                    resolve( _u.jsonOK( {login:false, 
                                        message: messages.errNotUserFoundByEmail,
                                        code: errCodes.errNotUserFoundByEmail
                                     },{login:'bool', message:'string', code:'number' } )) 
            }).catch(err=>reject(err))
        })  
    }
    
}