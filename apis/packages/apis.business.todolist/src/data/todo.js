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
            const query = this.storage.where(todoListRef, 'data.id', '==', todoListId  )
            
            this.storage.executeAndFetch(todoListRef,query)
                .then( (snapshot) => {
                    const doc = snapshot.first()
                    const todos = doc.data.todos  

                    const result = []
                    let initPosition=0
                    let j=0
                    initPosition = Number(params.pageSize) * ( Number(params.pageNumber)-1)
                    
                    for(let i=initPosition; i < todos.length && j< params.pageSize; i++ )
                    {
                        const item = todos[i]
                        j++;
                        const aux = todoModel.mappingToModel(item.data)
                        result.push(aux)
                    }
                    resolve( _u.jsonOK({todos:result, totalTodos:todos.length }))
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

    updateTodoById(todoListId, id, changesTodoModel)
    {
        return new Promise( (resolve,reject)=>{
            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists );

            const conditions =  [ {field:'data.id',
                                operator: '==',
                                value: todoListId },
                                'and',
                                {field:'data.todos.data.id',
                                operator: '==',
                                value: id }, 
                            ]
            const query = this.storage.whereList(todoListRef, conditions )
            
            this.storage.executeAndFetch(todoListRef,query)
                .then(async (doc) => {

                    const info = doc.first()
                    
                    if(info === undefined)
                    {
                        reject( jsonError(keys.errNoTodoExistWithId)) 
                        return
                    }
                    info.data.todos.forEach(item=>{
                        if(item.data.id === id)
                        {
                        
                            if(changesTodoModel.Title != undefined)
                                item.data.title = changesTodoModel.Title;
                            if(changesTodoModel.Description != undefined)
                                item.data.description = changesTodoModel.Description

                            this.storage.updateById(todoListRef,todoListId, item )
                                .then(()=>{
                                    resolve( _u.jsonOK({updated:true},{updated:'bool'}) )
                                })
                                .catch(err=>reject(err))
                            
                            
                           

                        }

                    })

                    

                   
                    
            
                   
                    
                    
                   
                }).catch(err=> reject( jsonError(err)));
        });
    }

    checkIfTodoExists(todoListId,title)
    {
        return new Promise( (resolve,reject) => {

            //console.log(`${todoListId} ${title}`)
            if(this.storage.db === undefined) {
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists )

            const conditions =  [ {field:'data.id',
                                operator: '==',
                                value: todoListId },
                                'and',
                                {field:'data.todos.data.title',
                                operator: '==',
                                value: title }, 
                            ]
            let query = this.storage.whereList(todoListRef, conditions )
            
            this.storage.executeAndFetch(todoListRef,query).then((snapshot) => {
                    //debug(snapshot)
                    if(snapshot.size === 1)
                        resolve(_u.jsonOK( {exists:true}, {exists:'bool'}))
                    else
                        resolve(_u.jsonOK( {exists:false}, {exists:'bool'} ))
                    
            }).catch(err =>{
                 reject(jsonError(err))
            })
        });
    }

    deleteTodoById() //todoListId,id
    {
        return new Promise( (resolve, reject) => {
            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }

            //TODO: to be implemented
            resolve( _u.jsonOK({deleted:true}, {deleted:'bool'}) ) 
            /*
            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists )
           
            this.storage.deleteById(todoListRef, id)
                .then(()=> resolve( _u.jsonOK({deleted:true}, {deleted:'bool'}) ) )
                .catch(err=>reject( jsonError(err)))
              */  
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

            const conditions =  [ {field:'data.id',
                                operator: '==',
                                value: todoListId },
                                'and',
                                {field:'data.todos.data.id',
                                operator: '==',
                                value: id }, 
                            ]
            const query = this.storage.whereList(todoListRef, conditions )
            
            this.storage.executeAndFetch(todoListRef,query)
                .then(async (doc)=>{
                    const info = doc.first()
                    
                    if(info === undefined)
                    {
                        reject( jsonError(keys.errNoTodoExistWithId)) 
                        return
                    }
                    info.data.todos.forEach(item=>{
                        if(item.data.id === id)
                        {
                            const result = todoModel.mappingToModel(item.data)
                            resolve( _u.jsonOK( result, todoModel.Meta ) )
                            return
                        }
                    })
                    
                }).catch(err => reject( jsonError(err) ))
            })
    }


}
