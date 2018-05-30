
import userModel from '../models/user'
import messages from '../support/messages'
import errCodes from '../support/errorcodes'
import keys from '../support/keys'
import {business, utils as _u} from 'apis-core'


export class userLogic extends business
{
    constructor(dataaccess)
    {
        super();
        this.userdata = dataaccess
    }

    mappingFromRequestToUserModel(params)
    {
        let use = new userModel() 
        use.Id = params.id
        use.Email = params.email
        use.Name = params.name
        use.Surname = params.surname
        use.Password = params.password
        return use
    }

    getAllUsers(uToken,params)
    {
        return new Promise( (resolve,reject) => {
            
            let validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            validation = _u.extracPageNumberPageSize(params)  
            if(!validation.result) { reject(validation); return } 
            
            this.userdata.getAllUsers(validation.data)
                .then( result => resolve(result) )
                .catch( err => reject(err) )
               
            }
         );
         
    }

    createNewUser(uToken,params, userTokenRequired = true)
    {
        return new Promise( (resolve,reject) => {

            let validation = _u.checkUserToken(uToken)
            
            if(userTokenRequired && !validation.result) { reject(validation); return }
            
            if(params.email === undefined) 
                { reject( _u.jsonError(keys.errEmailIsMandatory,errCodes,messages ) ) }

            if(params.password === undefined) 
                { reject( _u.jsonError(keys.errPasswordIsMandatory,errCodes,messages) ) }
            
            this.userdata.checkIfMailExists(params.email)
                .then( (result) => {
                    
                    if(result.result && result.data.exists){
                        reject( _u.jsonError(keys.errEmailAlreadyExists,errCodes,messages) )
                        return
                    }
                    
                    let newuser = this.mappingFromRequestToUserModel(params);
                    
                    this.userdata.createNewUser(newuser)
                        .then( result => resolve(result) )
                        .catch( err => reject(err) )
    
                })
                .catch( err => reject(err) )

        })
    }

    getUserById(uToken,id)
    {
        return new Promise( (resolve,reject) => {

            const validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            this.userdata.getUserById(id)
                .then( result => resolve(result) )
                .catch( err => reject(err) )
        })
    }

    getUsersByEmail(uToken,email)
    {
        return new Promise( (resolve,reject) => {

            const validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            this.userdata.getUsersByEmail(email)
                .then( result => resolve(result) )
                .catch( err => reject(err) )
        })
    }

    deleteUserById(uToken,id,userTokenRequired = true)
    {
        return new Promise((resolve,reject)=>{

            const validation = _u.checkUserToken(uToken)
            if(userTokenRequired && !validation.result) { reject(validation); return }

            this.userdata.deleteUserById(id)
                .then( result => resolve(result) )
                .catch( err  => reject(err) )
        })
        
    }

    checkIfMailExists(uToken,email)
    {
        return new Promise( (resolve,reject) => {
            const validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            this.userdata.checkIfMailExists(email)
                .then( result => resolve(result) )
                .catch( err  => reject(err) )
        })
    }

    updateUserById(uToken,id,params)
    {
        return new Promise( (resolve,reject) => {
            const validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            const usermod =  this.mappingFromRequestToUserModel(params);
            this.userdata.updateUserById(id,usermod)
                .then( result => resolve(result) )
                .catch( err  => reject(err) )
        })
    }

}
