import {firebase as _f, encrypt, utils as _u} from 'apis-core'
import userModel from '../models/user'
import uuid from 'uuid/v1'
import messages from '../support/messages'
import keys from '../support/keys'
import errCodes from '../support/errorcodes'


export class userData
{
    constructor()
    {
        this.isProduction = process.env.NODE_ENV === 'production'
        this.userMetaData = {
            email : 'string',
            name : 'string',
            surname : 'string',
            password:  'string',
            login: 'string'
        };
        this.firebase = _f.start()
        
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

            if(this.firebase.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userRef = this.firebase.db.collection( this.firebase.tables.users )
            const query = userRef.orderBy('data.surname')
                                .startAfter(params.pageSize * (params.pageNum-1) )
                                .limit(params.pageSize);
            
            query.get()
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

    createNewUser(usermodel)
    {
        return new Promise( async (resolve,reject)=>{
            if(this.firebase.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            const userRef = this.firebase.db.collection( this.firebase.tables.users );
            const id = uuid();
            const newUserDocRef = userRef.doc(id);
            
            try{
                const pass_hash = await encrypt.cryptToHash(usermodel.password) 
                const login_hash = await encrypt.obfuscateEmail(usermodel.email)
                
                let obj={
                    meta: this.userMetaData,
                    data:{  
                        email: this.checkEncriptation(usermodel.email, encrypt.cryptoText), 
                        name: this.checkEncriptation(usermodel.name, encrypt.cryptoText), 
                        surname : this.checkEncriptation(usermodel.surname, encrypt.cryptoText), 
                        password: pass_hash,
                        login: login_hash
                    }
                };
                
                newUserDocRef.set(obj)
                    .then(  ()  => resolve(_u.jsonOK({id:id}, {id:'uuid'} ) ) ) 
                    .catch( err => reject (_u.jsonError(err) ) )
                
            
            }catch(err)
            {
                reject(_u.jsonError(err))
            }
            
        });
    }

    updateUserById(id, usermodel)
    {
        return new Promise( (resolve,reject)=>{
            if(this.firebase.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userRef = this.firebase.db.collection( this.firebase.tables.users );
            const newUserDocRef = userRef.doc(id);
            newUserDocRef.get().then(async (doc) => {

                if(!doc.exists){ reject( _u.jsonError( keys.errNoUserExistWithId,
                                                            errCodes, messages))}

                let userInDb = doc.data();

                if(usermodel.email != undefined && 
                    usermodel.email !== userInDb.data.email ) {
                        const res = await this.checkIfMailExists(usermodel.email)
                        if(res.result && res.data === false) //it doesn't exist
                            userInDb.data.email = usermodel.email;                   
                }
                if(usermodel.name != undefined)
                    userInDb.data.name = usermodel.name;
                if(usermodel.surname != undefined)
                    userInDb.data.surname = usermodel.surname;

                newUserDocRef.set(userInDb);
                resolve( _u.jsonOK({updated:true},{updated:'bool'}) );
            }).catch(err=> reject( _u.jsonError(err)));
        });
    }

    checkIfMailExists(email)
    {
        return new Promise( (resolve,reject) => {
            if(this.firebase.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userRef = this.firebase.db.collection( this.firebase.tables.users )
            const query = userRef.where('data.email','==',email )
            
            query.get().then((snapshot) => { 
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
            if(this.firebase.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userRef = this.firebase.db.collection( this.firebase.tables.users )
            const doc = userRef.doc(id)
            //console.log(doc)
            doc.delete()
                .then(()=> resolve( _u.jsonOK({deleted:true}, {deleted:'bool'}) ) )
                .catch(err=>reject( _u.jsonError(err)))
        });
    }
    
    getUserById(id)
    {
        return new Promise( (resolve, reject) => {
            if(this.firebase.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userRef = this.firebase.db.collection( this.firebase.tables.users ).doc(id)
            userRef.get().then((doc)=>{
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
            if(this.firebase.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const userRef = this.firebase.db.collection( this.firebase.tables.users )
            const query = userRef.where('data.email','==',email )

            query.get().then( (snapshot) => {  

                let users = []
                if(!snapshot.empty) 
                {
                    snapshot.forEach((doc) => {
                        const userDataMeta = doc.data()           
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
