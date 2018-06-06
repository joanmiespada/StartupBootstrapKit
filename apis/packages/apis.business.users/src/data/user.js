import {encrypt, utils as _u, data} from 'apis-core'
import userModel from '../models/user'
import uuid from 'uuid/v1'
import messages from '../support/messages'
import keys from '../support/keys'
import errCodes from '../support/errorcodes'

const isProduction = process.env.NODE_ENV === 'production'

const checkEncriptation = (text, func) => isProduction ? func(text): text

export class userData extends data
{
    constructor(storage)
    {
        super(storage)
        this.userMetaData = {
            email : 'string',
            name : 'string',
            surname : 'string',
            password:  'string',
            id: 'uuid'
        };
    
    }

    mappingFromStorageToUserModel(user)
    {
        const use = new userModel()   
        use.Id = user.id
        use.Email = user.email
        use.Name = user.name
        use.Surname = user.surname
        use.Password ='****'// user.password
        return use
    }

    

    getAllUsers(params)
    {
        return new Promise( (resolve, reject) => {

            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userRef = this.storage.db.collection( this.storage.tables.users )
            //const query = this.storage.pagedQuery(userRef,'data.surname',params)
            
            this.storage.executePagedQueryAndFetch(userRef,'data.surname',params) 
                .then( (snapshot) => {  
                    const finalList = snapshot.pageItems.map( (x)=>{
                        const item =  this.mappingFromStorageToUserModel(x.data) 
                        item.email = checkEncriptation(item.email, encrypt.decryptoText), 
                        item.name = checkEncriptation(item.name, encrypt.decryptoText), 
                        item.surname = checkEncriptation(item.surname, encrypt.decryptoText) 
                        return item
                        })
                    
                    resolve( _u.jsonOK({users:finalList.toArray(), totalUsers:snapshot.totalItems}))
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
            
                let obj={
                    meta: this.userMetaData,
                    data:{  
                        email: checkEncriptation(userModel.email, encrypt.cryptoText), 
                        name: checkEncriptation(userModel.name, encrypt.cryptoText), 
                        surname : checkEncriptation(userModel.surname, encrypt.cryptoText), 
                        password: pass_hash,
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

                    const userInDbList = await this.storage.fetch(doc) 

                    if(userInDbList.length!==1){ reject( _u.jsonError( keys.errNoUserExistWithId,errCodes, messages))}

                    const userInDb = userInDbList[0];
                    
                    if(userModel.email != undefined && 
                        userModel.email !== userInDb.data.email ) {

                            const res = await this.checkIfMailExists(userModel.email)
                            if(res.result && res.data.exists === false) //it doesn't exist
                                userInDb.data.email = userModel.email; 
                            else{
                                reject( _u.jsonError( keys.errEmailAlreadyExists,
                                                                errCodes, messages ) )                 
                                return
                                }
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
            
            this.storage.executeAndFetch(userRef,query).then((snapshot) => {
                    if(snapshot.size === 0)
                        resolve(_u.jsonOK( {exists:false}, {exists:'bool'} ))
                    else{
                        resolve(_u.jsonOK( {exists:true}, {exists:'bool'}))
                    }
            }).catch(err =>{
                 reject(_u.jsonError(err))
            })
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
                .then(async (doc)=>{
                    const userList = await this.storage.fetch(doc)
                    const userDataMeta = userList[0]
                    const user = this.mappingFromStorageToUserModel(userDataMeta.data )
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
            
            this.storage.executeAndFetch(userRef,query).then( (users) => {  

                const finalList = users.map( x=>this.mappingFromStorageToUserModel(x.data))
                
                resolve( _u.jsonOK( finalList.toArray() ,  { data:'array',userType: this.userMetaData} ) )
            }).catch( (err) => reject( _u.jsonError(err) ) )
            
        });
    }

}
