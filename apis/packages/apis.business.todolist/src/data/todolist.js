import {utils as _u, data} from 'apis-core'
import todoListModel from '../models/todolist'
import uuid from 'uuid/v1'
import messages from '../support/messages'
import keys from '../support/keys'
import errCodes from '../support/errorcodes'

const jsonError = (key) => _u.jsonError(key,errCodes,messages)

export class todoListData extends data
{
    constructor(storage)
    {
        super(storage)
        this.todoListsMetaData = {
            todos: 'array of todo',
            title : 'string',
            description : 'string',
            owner : 'uuid',
            id: 'uuid'
        }
    }

    mappingFromStorageToTodoListModel(ttdList)
    {
        const todoList = new todoListModel()   
        todoList.Id = ttdList.id
        todoList.Title = ttdList.title
        todoList.Description = ttdList.description
        todoList.Owner = ttdList.owner
        todoList.ToDos = Object.assign({}, ttdList.todos)
        return todoList
    }

    

    getAllTodoLists(params,filter)
    {
        return new Promise( (resolve, reject) => {

            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists )
            //const query = this.storage.pagedQuery(todoListRef,'data.surname',params)
            const filterObj = { field:'data.owner', operator:'==', value: filter }
            
            this.storage.executePagedQueryAndFetch(todoListRef,'data.title', params, filterObj) 
                .then( (snapshot) => { 
                    
                    const finalList = snapshot.pageItems.map( (x)=>{
                        const item =  this.mappingFromStorageToTodoListModel(x.data) 
                        return item
                        })
                    
                    resolve( _u.jsonOK({todoLists:finalList.toArray(), totalTodoLists:snapshot.totalItems}))
                })
                .catch( (err) => { reject(jsonError(err) ) } )
        });
    }

    createNewTodoList(todoListModel)
    {
        return new Promise( async (resolve,reject)=>{

            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists );
            const id = uuid();
            todoListModel.Id = id
            
            try{
                
                let obj={
                    meta: this.todoListsMetaData,
                    data: {
                        id: todoListModel.Id,
                        title: todoListModel.Title,
                        description: todoListModel.Description,
                        todos: todoListModel.ToDos,
                        owner: todoListModel.Owner 
                    }
                    
                };
                
                this.storage.createById(todoListRef, id, obj)
                    .then (  ()  => resolve(_u.jsonOK({id:id}, {id:'uuid'} ) ) ) 
                    .catch( err  => reject (jsonError(err) ) )
                
            }catch(err)
            {
                reject(jsonError(err))
            }
            
        });
    }

    updateTodoListById(id, todoListModel)
    {
        return new Promise( (resolve,reject)=>{
            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists );

            this.storage.findById(todoListRef, id)
                .then(async (doc) => {

                    const todoLstInDbList = await this.storage.fetch(doc) 

                    if(todoLstInDbList.length!==1){ reject( jsonError( keys.errNoUserExistWithId,errCodes, messages))}

                    const todoListInDb = todoLstInDbList[0];
                    
            
                    if(todoListModel.Title != undefined)
                        todoListInDb.data.title = todoListModel.Title;
                    if(todoListModel.Description != undefined)
                        todoListInDb.data.description = todoListModel.Description;
                    if(todoListModel.Owner != undefined)
                        todoListInDb.data.owner = todoListModel.Owner;
                    
                    
                    this.storage.updateById(todoListRef,id,todoListInDb )

                    resolve( _u.jsonOK({updated:true},{updated:'bool'}) );
                }).catch(err=> reject( jsonError(err)));
        });
    }

    checkIfTodoListExists(title,userid)
    {
        return new Promise( (resolve,reject) => {
            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }
            
            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists )
            
            const conditions =  [ {field:'data.title',
                                  operator: '==',
                                  value: title },
                                  'and',
                                  {field:'data.owner',
                                  operator: '==',
                                  value: userid }, 
                                ]
            const query = this.storage.whereList(todoListRef, conditions )
            
            this.storage.executeAndFetch(todoListRef,query).then((snapshot) => {
                    if(snapshot.size === 0)
                        resolve(_u.jsonOK( {exists:false}, {exists:'bool'} ))
                    else{
                        resolve(_u.jsonOK( {exists:true}, {exists:'bool'}))
                    }
            }).catch(err =>{
                 reject(jsonError(err))
            })
        });
    }

    deleteTodoListById(id)
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
    
    getTodoListById(id)
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
                    resolve( _u.jsonOK( todoList, this.todoListsMetaData ) )
                })
                .catch(err => reject( jsonError(err) ))
            })
    }

    getTodoListByTitle(title)
    {
        return new Promise( (resolve, reject) => {
            if(this.storage.db === undefined){
                reject( jsonError(keys.errServerDataIsUnavailable))
                return
            }

            const todoListRef = this.storage.db.collection( this.storage.tables.todoLists )
            const query = this.storage.where(todoListRef,'data.title','==',title  )
            
            this.storage.executeAndFetch(todoListRef,query)
            .then( (users) => {  

                const finalList = users.map( x=>this.mappingFromStorageToTodoListModel(x.data))
                
                resolve( _u.jsonOK( finalList.toArray() ,  { data:'array',userType: this.todoListsMetaData} ) )
            })
            .catch( (err) => reject( jsonError(err) ) )
            
        });
    }

}
