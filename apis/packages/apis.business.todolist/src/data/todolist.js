import {utils as _u, data} from 'apis-core'
import todoListModel from '../models/todolist'
import uuid from 'uuid/v1'
import messages from '../support/messages'
import keys from '../support/keys'
import errCodes from '../support/errorcodes'


export class todoListData extends data
{
    constructor(storage)
    {
        super(storage)
        this.todoListMetaData = {
            todolist: 'array',
            todo:{
                title : 'string',
                description : 'string',
                owner : 'uuid',
                //changes:  'array of todo',
                id: 'uuid'
            }
        };
    
    }

    mappingFromStorageToTodoListModel(ttdList)
    {
        const todoList = new todoListModel()   
        todoList.Id = ttdList.id
        todoList.Title = ttdList.title
        todoList.Description = ttdList.description
        todoList.Owner = ttdList.owner
        //todoList.todoList = ...ttdList.changes
        return todoList
    }

    

    getAllTodoLists(params)
    {
        return new Promise( (resolve, reject) => {

            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists )
            //const query = this.storage.pagedQuery(todoListRef,'data.surname',params)
            
            this.storage.executePagedQueryAndFetch(todoListRef,'data.owner',params) 
                .then( (snapshot) => {  
                    const finalList = snapshot.pageItems.map( (x)=>{
                        const item =  this.mappingFromStorageToTodoListModel(x.data) 
                        return item
                        })
                    
                    resolve( _u.jsonOK({todoList:finalList.toArray(), totalTodos:snapshot.totalItems}))
                })
                .catch( (err) => { reject(_u.jsonError(err) ) } )
        });
    }

    createNewTodoList(todoListModel)
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
                    meta: this.todoListMetaData,
                    data:todoListModel
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

    updateTodoListById(id, todoListModel)
    {
        return new Promise( (resolve,reject)=>{
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoList );

            this.storage.findById(todoListRef, id)
                .then(async (doc) => {

                    const todoLstInDbList = await this.storage.fetch(doc) 

                    if(todoLstInDbList.length!==1){ reject( _u.jsonError( keys.errNoUserExistWithId,errCodes, messages))}

                    const todoListInDb = todoLstInDbList[0];
                    
            
                    if(todoListModel.Title != undefined)
                        todoListInDb.data.title = todoListModel.Title;
                    if(todoListModel.Description != undefined)
                        todoListInDb.data.description = todoListModel.Description;
                    if(todoListModel.Owner != undefined)
                        todoListInDb.data.owner = todoListModel.Owner;
                    
                    
                    this.storage.updateById(todoListRef,id,todoListInDb )

                    resolve( _u.jsonOK({updated:true},{updated:'bool'}) );
                }).catch(err=> reject( _u.jsonError(err)));
        });
    }

    checkIfTodoListExists(title)
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

    deleteTodoListById(id)
    {
        return new Promise( (resolve, reject) => {
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoList )
           
            this.storage.deleteById(todoListRef, id)
                .then(()=> resolve( _u.jsonOK({deleted:true}, {deleted:'bool'}) ) )
                .catch(err=>reject( _u.jsonError(err)))
        });
    }
    
    getTodoListById(id)
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

    getTodoListByTitle(title)
    {
        return new Promise( (resolve, reject) => {
            if(this.storage.db === undefined){
                reject( _u.jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoList )
            const query = this.storage.where(todoListRef,'data.title','==',title  )
            
            this.storage.executeAndFetch(todoListRef,query).then( (users) => {  

                const finalList = users.map( x=>this.mappingFromStorageToTodoListModel(x.data))
                
                resolve( _u.jsonOK( finalList.toArray() ,  { data:'array',userType: this.todoListMetaData} ) )
            }).catch( (err) => reject( _u.jsonError(err) ) )
            
        });
    }

}
