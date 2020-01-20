import {encrypt, utils as _u, data } from 'apis-core'
import keys from '../support/keys'

export class loginData extends data
{
    constructor(storage)
    {
        super(storage)
    }

    login(email,passwordPlain)
    {
        return new Promise( (resolve, reject) => {
            
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            let userRef = this.storage.db.collection( this.storage.tables.users )

             
            const query = this.storage.where(userRef,'data.email','==', email )
            

            this.storage.executeAndFetch(userRef,query).then( (snapshot) => {  

                
                if(snapshot.isEmpty()) 
                    {  
                        resolve( {login:false} ) 
                        return
                    }
 
                const result = snapshot.first();
               

                encrypt.compareToHash(passwordPlain, result.data.password)
                        .then( (canIlogin) => {
                            if(canIlogin)
                                resolve( {login:true, user: result.data, id:result.data.id} )
                            else
                                resolve( {login:false} )
                        })
                        .catch( (err) =>  reject(err)  )
            }).catch( (err) => { reject(err); } )
        })
    }
}
