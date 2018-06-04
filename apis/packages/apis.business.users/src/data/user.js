import {encrypt, utils as _u} from 'apis-core'
import userModel from '../models/user'
import uuid from 'uuid/v1'
import messages from '../support/messages'
import keys from '../support/keys'
import errCodes from '../support/errorcodes'


export class userData
{
    constructor(storage)
    {
        this.isProduction = process.env.NODE_ENV === 'production'
        this.userMetaData = {
            email : 'string',
            name : 'string',
            surname : 'string',
            password:  'string',
            login: 'string',
            id: 'uuid'
        };
        this.storage = storage
    }

    mappingFromStorageToUserModel(id,user)
    {
        const use = new userModel()   
        use.Id = id
        use.Email = user.email
        use.Name = user.name
        use.Surname = user.surname
        use.Password = user.password
        return use
    }

    checkEncriptation(text, func)
    {
        return this.isProduction ? func(text): text
    }

    getAllUsers(params)
    {
        return new Promise( (resolve, reject) => {

            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userRef = this.storage.db.collection( this.storage.tables.users )
            const query = this.storage.pagedQuery(userRef,'data.surname',params)
            
            this.storage.execute(query) 
                .then( (snapshot) => {  

                    let result = [];
                    if(snapshot.empty) return result

                    snapshot.forEach((doc) => {           
                        const userInfo = doc.data()
                        const user = this.mappingFromStorageToUserModel(doc.id, userInfo.data )
                        user.password='****'
                        user.email = this.checkEncriptation(user.email, encrypt.decryptoText), 
                        user.name = this.checkEncriptation(user.name, encrypt.decryptoText), 
                        user.surname = this.checkEncriptation(user.surname, encrypt.decryptoText), 
                        result.push(user)
                    });
                    resolve( _u.jsonOK(result))
                })
                .catch( (err) => { reject(_u.jsonError(err) ) } )
        });
    }

    createNewUser(userModel)
    {
        return new Promise( async (resolve,reject)=>{
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            const userRef = this.storage.db.collection( this.storage.tables.users );
            const id = uuid();
            
            try{
                const pass_hash = await encrypt.cryptToHash(userModel.password) 
                const login_hash = await encrypt.obfuscateEmail(userModel.email)
                
                let obj={
                    meta: this.userMetaData,
                    data:{  
                        email: this.checkEncriptation(userModel.email, encrypt.cryptoText), 
                        name: this.checkEncriptation(userModel.name, encrypt.cryptoText), 
                        surname : this.checkEncriptation(userModel.surname, encrypt.cryptoText), 
                        password: pass_hash,
                        login: login_hash,
                        id: id
                    }
                };
                this.storage.createById(userRef, id, obj)
                    .then(  ()  => resolve(_u.jsonOK({id:id}, {id:'uuid'} ) ) ) 
                    .catch( err => reject (_u.jsonError(err) ) )
                
            
            }catch(err)
            {
                reject(_u.jsonError(err))
            }
            
        });
    }

    updateUserById(id, userModel)
    {
        return new Promise( (resolve,reject)=>{
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userRef = this.storage.db.collection( this.storage.tables.users );

            this.storage.findById(userRef, id)
                .then(async (doc) => {

                    if(!doc.exists){ reject( _u.jsonError( keys.errNoUserExistWithId,
                                                                errCodes, messages))}

                    let userInDb = doc.data();

                    if(userModel.email != undefined && 
                        userModel.email !== userInDb.data.email ) {
                            const res = await this.checkIfMailExists(userModel.email)
                            if(res.result && res.data === false) //it doesn't exist
                                userInDb.data.email = userModel.email;                   
                    }
                    if(userModel.name != undefined)
                        userInDb.data.name = userModel.name;
                    if(userModel.surname != undefined)
                        userInDb.data.surname = userModel.surname;
                    
                    
                    this.storage.updateById(userRef,id,userInDb )
                    
                    resolve( _u.jsonOK({updated:true},{updated:'bool'}) );
                }).catch(err=> reject( _u.jsonError(err)));
        });
    }

    checkIfMailExists(email)
    {
        return new Promise( (resolve,reject) => {
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            const userRef = this.storage.db.collection( this.storage.tables.users )
            const query = this.storage.where(userRef,'data.email','==',email  )
            
            this.storage.execute(query).then((snapshot) => { 
                    if(snapshot.size === 0)
                        resolve(_u.jsonOK( {exists:false}, {exists:'bool'} ))
                    else
                        resolve(_u.jsonOK( {exists:true}, {exists:'bool'}))
            }).catch(err => reject(_u.jsonError(err)))
        });
    }

    deleteUserById(id)
    {
        return new Promise( (resolve, reject) => {
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userRef = this.storage.db.collection( this.storage.tables.users )
           
            this.storage.deleteById(userRef, id)
                .then(()=> resolve( _u.jsonOK({deleted:true}, {deleted:'bool'}) ) )
                .catch(err=>reject( _u.jsonError(err)))
        });
    }
    
    getUserById(id)
    {
        return new Promise( (resolve, reject) => {
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userCollect = this.storage.db.collection( this.storage.tables.users )
            this.storage.findById(userCollect, id)
                .then((doc)=>{
                    const userDataMeta = doc.data()
                    const user = this.mappingFromStorageToUserModel(doc.id,userDataMeta.data )
                    user.password='****'
                    resolve( _u.jsonOK( user, this.userMetaData ) )
                }).catch(err => reject( _u.jsonError(err) ))
        });
    }

    getUsersByEmail(email)
    {
        return new Promise( (resolve, reject) => {
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userRef = this.storage.db.collection( this.storage.tables.users )
            const query = this.storage.where(userRef,'data.email','==',email  )
            
            this.storage.execute(query).then( (snapshot) => {  

                let users = []
                if(!snapshot.empty) 
                {
                    snapshot.forEach((doc) => {
                        const userDataMeta = this.storage.fetch(doc)             
                        const user = this.mappingFromStorageToUserModel(doc.id, userDataMeta.data)
                        user.password='****'
                        users.push(user)
                    });
                }
                
                resolve( _u.jsonOK( users ,  { data:'array',userType: this.userMetaData} ) )
            }).catch( (err) => reject( _u.jsonError(err) ) )
            
        });
    }

}
