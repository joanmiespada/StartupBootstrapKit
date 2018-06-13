
import todoModel from '../models/todo'
import messages from '../support/messages'
import errCodes from '../support/errorcodes'
import keys from '../support/keys'
import {business, utils as _u} from 'apis-core'


export class todoLogic extends business
{
    constructor(dataaccess)
    {
        super();
        this.data = dataaccess
    }

    mappingFromRequestToTodoListModel(params)
    {
        let todo = new todoModel() 
        todo.Id = params.id
        todo.Title = params.title
        todo.Description = params.description
        todo.DateCreation = params.dateCreation
        //todoList.list = params.list
        return todo
    }

    getAllTodos(uToken,todoListId,params)
    {
        return new Promise( (resolve,reject) => {
            
            let validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            validation = _u.extracPageNumberPageSize(params)  
            if(!validation.result) { reject(validation); return } 
            
            this.data.getAllTodos(todoListId,validation.data)
                .then( result => resolve(result) )
                .catch( err => reject(err) )
               
            }
         );
         
    }

    createNewTodo(uToken,params, userTokenRequired = true)
    {
        return new Promise( (resolve,reject) => {

            let validation = _u.checkUserToken(uToken)
            
            if(userTokenRequired && !validation.result) { reject(validation); return }
            
            if(params.todoListId === undefined) 
                { reject( _u.jsonError(keys.errTodoListIdIsMandatory,errCodes,messages ) ); return }
            if(params.title === undefined) 
                { reject( _u.jsonError(keys.errTitleIsMandatory,errCodes,messages ) ); return }
            
            this.data.checkIfTodoExists(params.todoListId, params.title)
                .then( (result) => {
                    
                    if(result.result && result.data.exists){
                        reject( _u.jsonError(keys.errTitleAlreadyExists,errCodes,messages) )
                        return
                    }
                    
                    let newTodo = this.mappingFromRequestToTodoModel(params);
                    
                    this.data.createNewTodo(newTodo)
                        .then( result => resolve(result) )
                        .catch( err => reject(err) )
    
                })
                .catch( err => reject(err) )

        })
    }

    getTodoById(uToken,todoListId,id)
    {
        return new Promise( (resolve,reject) => {

            const validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            this.data.getTodoById(id)
                .then( result => resolve(result) )
                .catch( err => reject(err) )
        })
    }

    
    deleteTodoById(uToken,todoListId,id,userTokenRequired = true)
    {
        return new Promise((resolve,reject)=>{

            const validation = _u.checkUserToken(uToken)
            if(userTokenRequired && !validation.result) { reject(validation); return }

            this.data.deleteTodoById(todoListId,id)
                .then( result => resolve(result) )
                .catch( err  => reject(err) )
        })
        
    }

    checkIfTodoExists(uToken,todoListId,title)
    {
        return new Promise( (resolve,reject) => {
            const validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            this.data.checkIfTodoExists(todoListId,title)
                .then( result => resolve(result) )
                .catch( err  => reject(err) )
        })
    }

    updateTodoById(uToken,todoListId,id,params)
    {
        return new Promise( (resolve,reject) => {
            const validation = _u.checkUserToken(uToken)
            if(!validation.result) { reject(validation); return }

            const todoMod =  this.mappingFromRequestToTodoModel(params)
            this.data.updateTodoById(todoListId,id,todoMod)
                .then( result => resolve(result) )
                .catch( err  => reject(err) )
        })
    }

}
