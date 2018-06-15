import {utils as _u, data} from 'apis-core'
import uuid from 'uuid/v1'
import todoModel from '../models/todo'
import messages from '../support/messages'
import keys from '../support/keys'
import errCodes from '../support/errorcodes'
import moment from 'moment'

const jsonError = (key) => _u.jsonError(key,errCodes,messages)


export class todoData extends data
{
    constructor(storage)
    {
        super(storage)
    }

    

    
    getAllTodos(todoListId, params)
    {
        return new Promise( (resolve, reject) => {

            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
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
                .catch( (err) => { reject(jsonError(err) ) } )
        });
    }

    createNewTodo(todoListId,todoMdl)
    {
        return new Promise( async (resolve,reject)=>{

            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists )
            const query = this.storage.where(todoListRef, 'data.id', '==', todoListId  )
            
            this.storage.executeAndFetch(todoListRef,query).then((snapshot) => {
                    
                    if(snapshot.size !== 1)
                    {
                        reject( jsonError(keys.errNoTodoListExistWithId))
                        return
                    }else{

                            const docFound = snapshot.first()

                            if(docFound.data.todos == null )
                                docFound.data.todos = []
                            const id = uuid()
                            todoMdl.Id= id
                            todoMdl.DateCreation = moment().format()
                            docFound.data.todos.push({
                                data: todoMdl.plainObject(),
                                meta: todoModel.Meta
                            })
                            
                            this.storage.updateById(todoListRef,todoListId,docFound )
                                .then(()=> resolve(_u.jsonOK({id:id}, {id:'uuid'} )))
                                .catch(err=> reject(jsonError(err)))
                                
                    }
            }).catch(err => reject(jsonError(err)) )
        })
    }

    updateTodoById(todoListId, id, todoModel)
    {
        return new Promise( (resolve,reject)=>{
            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists );

            this.storage.findById(todoListRef, todoListId)
                .then(async (doc) => {

                    const todoLstInDbList = await this.storage.fetch(doc) 

                    if(todoLstInDbList.length!==1){ reject( jsonError( keys.errNoUserExistWithId,errCodes, messages))}

                    const todoListInDb = todoLstInDbList[0];
                    
            
                    if(todoModel.Title != undefined)
                        todoListInDb.data.title = todoModel.Title;
                    if(todoModel.Description != undefined)
                        todoListInDb.data.description = todoModel.Description;
                    if(todoModel.Owner != undefined)
                        todoListInDb.data.owner = todoModel.Owner;
                    
                    
                    this.storage.updateById(todoListRef,id,todoListInDb )

                    resolve( _u.jsonOK({updated:true},{updated:'bool'}) );
                }).catch(err=> reject( jsonError(err)));
        });
    }

    checkIfTodoExists(todoListId,title)
    {
        return new Promise( (resolve,reject) => {

            if(this.storage.db === undefined) {
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists )
            const query = this.storage.where(todoListRef, 'data.id', '==', todoListId  )
            
            this.storage.executeAndFetch(todoListRef,query).then((snapshot) => {
                    if(snapshot.size !== 1)
                    {
                        reject( jsonError(keys.errNoTodoListExistWithId))
                        return
                    }else{
                            const docFound = snapshot.first()
                            
                            if(docFound.todos == null) 
                                { resolve(_u.jsonOK( {exists:false}, {exists:'bool'} )); return }
                            
                            docFound.todos.forEach(item=>{
                                if(item.data.title === title)
                                    {resolve(_u.jsonOK( {exists:true}, {exists:'bool'})); return }
                            })
                        
                            resolve(_u.jsonOK( {exists:false}, {exists:'bool'} ));
                    }
            }).catch(err =>{
                 reject(jsonError(err))
            })
        });
    }

    deleteTodoListById(todoListId,id)
    {
        return new Promise( (resolve, reject) => {
            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists )
           
            this.storage.deleteById(todoListRef, id)
                .then(()=> resolve( _u.jsonOK({deleted:true}, {deleted:'bool'}) ) )
                .catch(err=>reject( jsonError(err)))
                
        });
    }
    
    getTodoById(todoListId,id)
    {
        return new Promise( (resolve, reject) => {
            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists )
            this.storage.findById(todoListRef, id)
                .then(async (doc)=>{
                    const todoLstList = await this.storage.fetch(doc)
                    const todoListDataMeta = todoLstList[0]
                    const todoList = this.mappingFromStorageToTodoListModel(todoListDataMeta.data )
                    resolve( _u.jsonOK( todoList, this.todoListMetaData ) )
                    }).catch(err => reject( jsonError(err) ))
            })
    }


}
