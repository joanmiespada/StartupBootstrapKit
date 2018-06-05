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

    }
    if(result === undefined)
        throw Error('operator not yet implemented in mongodb')
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

    async close()
    {
        if(this._client !== undefined )
        {
            //await this._db.close()
            await this._client.close()
            this.message('connection with mongodb closed')
        }
    }


    pagedQuery(obj, condition, params)
    {
        return obj.orderBy(condition).startAfter(params.pageSize * (params.pageNum-1) ).limit(params.pageSize)
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
            collection.find(query).toArray( (err,data)=>{
                const sdata = Immutable.Set(data)
                resolve(sdata)
            }) 
            
        })
        
        
    }

    findById(collection, id)
    {
        //const elemRef = collection.find({_id: id })
        //return elemRef.get()

        return new Promise( (resolve) => {
            const cursor = collection.find({_id: id })
            resolve(cursor)
        })
    }

    //Estoy aqui!!!!!!!
    fetch(cursor)
    {
        return doc.data()

    }

    updateById(collection,id, values)
    {
        const elemRef = collection.doc(id)
        return elemRef.set(values)
    }

    deleteById(collection, id)
    {
        const doc = collection.doc(id)
        return doc.delete()
    }

}
