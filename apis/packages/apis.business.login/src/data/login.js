import {firebase as _s, encrypt, utils as _u } from 'apis-core'
import keys from '../support/keys'


export class loginData
{
    constructor()
    {
        this.storage = _s.start()
        this.isProduction = process.env.NODE_ENV === 'production'
    }

    login(email,passwordPlain)
    {
        return new Promise( async (resolve, reject) => {
            
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            let userRef = this.storage.db.collection( this.storage.tables.users )

            const hashemail = await encrypt.obfuscateEmail(email)
            let query = userRef.where('data.login','==', hashemail )

            query.get().then( (snapshot) => {  

                let result, id
                if(snapshot.empty || snapshot.size >1) 
                    {  
                        resolve( {login:false} ) 
                        return
                    }

                snapshot.forEach((doc) => {           
                    result =  doc.data()
                    id = doc.id
                });
                
                encrypt.compareToHash(passwordPlain,result.data.password)
                        .then( (canIlogin) => {
                            if(canIlogin)
                                resolve( {login:true, user: result.data, id:id} )
                            else
                                resolve( {login:false} )
                        })
                        .catch( (err) =>  reject(err)  )
            }).catch( (err) => { reject(err); } )
        })
    }
}
