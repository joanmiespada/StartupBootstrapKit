import mongo from 'mongodb'
import params from '../apiparams'
import {storage} from './definition'

import Immutable from 'immutable'

const queryPattern = (field, operator, value)=> `{"${field}": { "${operator}": "${value}"} }`
const recursiveQueryPattern = (fields, operator, value) =>{

    if(fields.length===1) 
        return queryPattern(fields[0],operator,value )
    else
    {
        const others = fields.slice(1, fields.length)
        const aux = recursiveQueryPattern(others,operator,value) 
        return `{"${fields[0]}":${aux}}`
    }
}

const translateOperators = (value) =>{

    let result=undefined
    switch(value)
    {
        case '==': result ='$eq'; break
        case '>': result ='$gt'; break
        case '>=': result ='$gte'; break
        case '<': result ='$lt'; break
        case '<=': result ='$lte'; break
        default:  throw Error('operator not yet implemented in mongodb')
    }
    return result
}



export class mongodb extends storage
{
    constructor()
    {
        super()
        this._client = undefined
    }
  
    async start(config = undefined)
    {
        
        try{
                if(config === undefined )
                {
                    //const url = `mongodb://${params.mongo.user}:${params.mongo.pass}@${params.mongo.host}:${params.mongo.port}/${params.mongo.path}`
                    const url = `mongodb://${params.mongo.host}:${params.mongo.port}`

                    this._client = await mongo.MongoClient.connect(url)    
                    this._db = await this._client.db(params.mongo.database)
                
                }else{
                    this._client = config.client
                    this._db = config.database
                }

                this.message(`Pid:${process.pid} - Connection with mongo database ok`)

            }catch(err)
            {
                this.message(`Pid:${process.pid} - Error connecting to mongo:` + err)
            }
    
    }

    close()
    {
        if(this._client !== undefined )
        {
        
            this._client.close().then(()=>
                this.message('connection with mongodb closed')
            )
        }
    
    }


    pagedQuery(collection, condition, params)
    {
        return collection.find().skip(params.pageSize*(params.pageNum-1)).limit(params.pageSize).sort(  JSON.parse(`{ "${condition}": 1 }`) )
    }

    executePagedQueryAndFetch(collection, condition, params)
    {
        return new Promise(async (resolve) => {
            const totalItems = await collection.find().count()
            const cursor =  this.pagedQuery(collection,condition, params )
            cursor.toArray( (err,data)=>{
                const pageItems = Immutable.Set(data)
                resolve( {pageItems,totalItems })
            }) 
        })
    }

    createById(collection, id,obj)
    {
        const finalObj ={
            _id: id, //mongo internal key by default
            data: obj.data,
            meta: obj.meta
        }
        return collection.insert(finalObj)
    }

    where(collection, field, condition, value)
    {
        let obj=undefined
        const translate = translateOperators(condition)
        
        //obj = recursiveQueryPattern(field.split('.') ,translate, value)
        obj = queryPattern(field,translate, value)
    
        const aux = JSON.parse(obj)
        return aux; 
    }

    execute(collection,query)
    {
        return new Promise( (resolve) => {
            const cursor = collection.find(query)
            resolve(cursor)  
        })
    }

    executeAndFetch(collection,query)
    {
        return new Promise( (resolve) => {
            const cursor = collection.find(query)
            cursor.toArray( (err,data)=>{
                const setData = Immutable.Set(data)
                resolve(setData)
            }) 
        })
    }

    findById(collection, id)
    {
        return new Promise( (resolve) => {
            const cursor = collection.find({_id: id })
            resolve(cursor)
        })
    }

    async fetch(cursor)
    {
        return await cursor.toArray()
    }

    updateById(collection,id, values)
    {
        collection.updateOne({_id:id},{ $set: values } )
    }

    deleteById(collection, id)
    {
        return collection.deleteOne({_id:id})
        
    }

}

/*

>mongo-express -U mongodb://localhost:27017/db
 */
