import mongo from 'mongodb'
import params from '../apiparams'
import {storage} from './definition'

import Immutable from 'immutable'

const queryPattern = (field, operator, value)=> `{"${field}": { "${operator}": "${value}"} }`
const queryPatternOperators = (left, operator, right) => `{ "${operator}": [ ${left}, ${right} ] }`

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
        case 'and': result= '$and'; break
        case 'or': result= '$or'; break
        case 'not': result= '$not'; break
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

                    this._client = await mongo.MongoClient.connect(url, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                      })    
                    this._db = await this._client.db(params.mongo.database)
                
                }else{
                    this._client = config.client
                    this._db = config.database
                }

                //this.message(`Pid:${process.pid} - Connection with mongo database ok`)

            }catch(err)
            {
                this.message(`Pid:${process.pid} - Error connecting to mongo: ` + err)
            }
    
    }

    close()
    {
        if(this._client !== undefined )
        {
        
            this._client.close().then(()=>{}
                //this.message('connection with mongodb closed')
            ).catch( (err=>{
                this.message(`Pid:${process.pid} - Error closing mongo connection: ` + err)
            } ) )
        }
    
    }

    pagedQuery(collection, order, params, condition = undefined)
    {
        return collection.find(condition).skip(params.pageSize*(params.pageNum-1))
                                         .limit(params.pageSize)
                                         .sort( JSON.parse(`{ "${order}": 1 }`) )
    }

    executePagedQueryAndFetch(collection, order, params, filter = undefined)
    {
        return new Promise(async (resolve) => {

            let condition = {}
            if(filter)
                condition = queryPattern(filter.field, translateOperators(filter.operator), filter.value)
            
            const totalItems = await collection.find(condition).count()
            if(totalItems===0)
            {
                resolve({pageItems: Immutable.Set([]),totalItems:0 })
            }
            const cursor =  this.pagedQuery(collection,order, params, condition )
            cursor.toArray( (err,data)=>{
                //console.log(data)
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
        //console.log(obj)
        const aux = JSON.parse(obj)
        return aux; 
    }

    whereList(collection, conditions)
    {
        let obj=undefined
     
        for(let i=0; i<conditions.length; i+=3) 
        {
            const leftValue = conditions[i]
            let translate = translateOperators(leftValue.operator)
            const left = queryPattern(leftValue.field, translate, leftValue.value)

            const rightValue= conditions[i+2]
            translate = translateOperators(rightValue.operator)
            const right = queryPattern(rightValue.field, translate, rightValue.value)
            
            const operator = translateOperators(conditions[i+1])
 
            obj = queryPatternOperators(left, operator, right)
        }
        
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
        return new Promise( (resolve, reject)=>{

            collection.updateOne({_id:id},{ $set: values } ).then( (res) =>{
                    const result = res.result
                    if(result.n===1 && result.ok===1 )
                        resolve(true)
                    else   
                        reject(res)
            })
        
        })
        
    }

    deleteById(collection, id)
    {
        return collection.deleteOne({_id:id})
        
    }

}

/*

>mongo-express -U mongodb://localhost:27017/db
 */
