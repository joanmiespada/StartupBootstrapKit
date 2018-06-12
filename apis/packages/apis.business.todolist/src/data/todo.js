import {utils as _u, data} from 'apis-core'
import todoModel from '../models/todo'
import uuid from 'uuid/v1'
import messages from '../support/messages'
import keys from '../support/keys'
import errCodes from '../support/errorcodes'


export class todoData extends data
{
    constructor(storage)
    {
        super(storage)
        this.todoMetaData = {
        
                title : 'string',
                description : 'string',
                dateCreation : 'timestamp',
                //changes:  'array of todo',
                id: 'uuid'    
        }
    
    }

    mappingFromStorageToTodoModel(ttd)
    {
        const todo = new todoModel()   
        todo.Id = ttd.id
        todo.Title = ttd.title
        todo.Description = ttd.description
        todo.DateCreation = ttd.dateCreation
        //todo.Changes = ...ttd.changes
        return todo
    }

    
    getAllTodos(todoListId, params)
    {
        return new Promise( (resolve, reject) => {

            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists )
            //const query = this.storage.pagedQuery(todoListRef,'data.surname',params)
            
            this.storage.executePagedQueryAndFetch(todoListRef,'data.id',params) 
                .then( (snapshot) => {  
                    const finalList = snapshot.pageItems.map( (x)=>{
                        const item =  this.mappingFromStorageToTodoModel(x.data) 
                        return item
                        })
                    
                    resolve( _u.jsonOK({todoList:finalList.toArray(), totalTodos:snapshot.totalItems}))
                })
                .catch( (err) => { reject(_u.jsonError(err) ) } )
        });
    }

    createNewTodo(todoListId,todoModel)
    {
        return new Promise( async (resolve,reject)=>{

            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            const todoListRef = this.storage.db.collection( this.storage.tables.todoList );
            const id = uuid();
            
            try{
                
            
                let obj={
                    meta: this.todoMetaData,
                    data:todoModel
                };
                
                this.storage.createById(todoListRef, id, obj)
                    .then(  ()  => resolve(_u.jsonOK({id:id}, {id:'uuid'} ) ) ) 
                    .catch( err => reject (_u.jsonError(err) ) )
                
            
            }catch(err)
            {
                reject(_u.jsonError(err))
            }
            
        });
    }

    updateTodoById(todoListId, id, todoModel)
    {
        return new Promise( (resolve,reject)=>{
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoList );

            this.storage.findById(todoListRef, todoListId)
                .then(async (doc) => {

                    const todoLstInDbList = await this.storage.fetch(doc) 

                    if(todoLstInDbList.length!==1){ reject( _u.jsonError( keys.errNoUserExistWithId,errCodes, messages))}

                    const todoListInDb = todoLstInDbList[0];
                    
            
                    if(todoModel.Title != undefined)
                        todoListInDb.data.title = todoModel.Title;
                    if(todoModel.Description != undefined)
                        todoListInDb.data.description = todoModel.Description;
                    if(todoModel.Owner != undefined)
                        todoListInDb.data.owner = todoModel.Owner;
                    
                    
                    this.storage.updateById(todoListRef,id,todoListInDb )

                    resolve( _u.jsonOK({updated:true},{updated:'bool'}) );
                }).catch(err=> reject( _u.jsonError(err)));
        });
    }

    checkIfTodoExists(todoListId,title)
    {
        return new Promise( (resolve,reject) => {
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            const todoListRef = this.storage.db.collection( this.storage.tables.todoList )
            const query = this.storage.where(todoListRef,'data.title','==',title  )
            
            this.storage.executeAndFetch(todoListRef,query).then((snapshot) => {
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

    deleteTodoListById(todoListId,id)
    {
        return new Promise( (resolve, reject) => {
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoList )
           
            /*this.storage.deleteById(todoListRef, id)
                .then(()=> resolve( _u.jsonOK({deleted:true}, {deleted:'bool'}) ) )
                .catch(err=>reject( _u.jsonError(err)))
                */
        });
    }
    
    getTodoById(todoListId,id)
    {
        return new Promise( (resolve, reject) => {
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoList )
            this.storage.findById(todoListRef, id)
                .then(async (doc)=>{
                    const todoLstList = await this.storage.fetch(doc)
                    const todoListDataMeta = todoLstList[0]
                    const todoList = this.mappingFromStorageToTodoListModel(todoListDataMeta.data )
                    resolve( _u.jsonOK( todoList, this.todoListMetaData ) )
                    }).catch(err => reject( _u.jsonError(err) ))
            })
    }


}
