
import todoListModel from '../models/todolist'
import messages from '../support/messages'
import errCodes from '../support/errorcodes'
import keys from '../support/keys'
import {business, utils as _u} from 'apis-core'


export class todoListLogic extends business
{
    constructor(dataaccess)
    {
        super();
        this.data = dataaccess
    }

    mappingFromRequestToTodoListModel(params)
    {
        let todoList = new todoListModel() 
        todoList.Id = params.id
        todoList.Title = params.title
        todoList.Description = params.description
        todoList.Owner = params.owner
        //todoList.list = params.list
        return todoList
    }

    getAllTodoLists(uToken,params,filter)
    {
        return new Promise( (resolve,reject) => {
            
            let validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            validation = _u.extracPageNumberPageSize(params)  
            if(!validation.result) { reject(validation); return } 
            
            this.data.getAllTodoLists(validation.data,filter)
                .then( result => resolve(result) )
                .catch( err => reject(err) )
               
            }
         );
         
    }

    createNewTodoList(uToken,params, userTokenRequired = true)
    {
        return new Promise( (resolve,reject) => {

            let validation = _u.checkUserToken(uToken)
            
            if(userTokenRequired && !validation.result) { reject(validation); return }
            
            if(params.title === undefined) 
                { 
                    reject( _u.jsonError(keys.errTitleIsMandatory,errCodes,messages ) ) 
                    return
                }
            
            if(params.owner === undefined) 
                { 
                    reject( _u.jsonError(keys.errOwnerIsMandatory,errCodes,messages ) ) 
                    return
                }
            
            this.data.checkIfTodoListExists(params.title, params.owner )
                .then( (result) => {
                    
                    if(result.result && result.data.exists){
                        reject( _u.jsonError(keys.errTitleAlreadyExists,errCodes,messages) )
                        return
                    }
                    
                    let newTodoList = this.mappingFromRequestToTodoListModel(params)
                    
                    this.data.createNewTodoList(newTodoList)
                        .then( result => resolve(result) )
                        .catch( err => reject(err) )
    
                })
                .catch( err => reject(err) )

        })
    }

    getTodoListById(uToken,id)
    {
        return new Promise( (resolve,reject) => {

            const validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            this.data.getTodoListById(id)
                .then( result => resolve(result) )
                .catch( err => reject(err) )
        })
    }

    getTodoListByTitle(uToken,title,userId)
    {
        return new Promise( (resolve,reject) => {

            const validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            this.data.getTodoListByTitle(title,userId)
                .then( result => resolve(result) )
                .catch( err => reject(err) )
        })
    }

    deleteTodoListById(uToken,id,userTokenRequired = true)
    {
        return new Promise((resolve,reject)=>{

            const validation = _u.checkUserToken(uToken)
            if(userTokenRequired && !validation.result) { reject(validation); return }

            this.data.deleteTodoListById(id)
                .then( result => resolve(result) )
                .catch( err  => reject(err) )
        })
        
    }

    checkIfTodoListExists(uToken,title,userid)
    {
        return new Promise( (resolve,reject) => {
            const validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            this.data.checkIfTodoListExists(title, userid)
                .then( result => resolve(result) )
                .catch( err  => reject(err) )
        })
    }

    updateTodoListById(uToken,id,params)
    {
        return new Promise( (resolve,reject) => {
            const validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            const todolistmod =  this.mappingFromRequestToTodoListModel(params);
            this.data.updateTodoListById(id,todolistmod)
                .then( result => resolve(result) )
                .catch( err  => reject(err) )
        })
    }

}
