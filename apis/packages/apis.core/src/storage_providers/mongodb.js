import mongo from 'mongodb'
import params from '../apiparams'
import {tables} from './definition'
//const MongoClient = require('mongodb').MongoClient

let db = undefined

export async function start()
{
  
    console.log(params)
    const url = `mongodb://${params.mongo.user}:${params.mongo.pass}@${params.mongo.host}:${params.mongo.port}/${params.mongo.path}`

    console.log(url)

    await mongo.MongoClient.connect(url, (err, client) => {
    
        if (err) {
            console.log(err) //eslint-disable-line
            throw err;
        }
        console.log(client)
        db = client //client.db('star-wars-quotes') 

    })

    return {
        db,
        tables
    }
}


export function pagedQuery(obj, condition, params)
{
  //return obj.orderBy(condition).startAfter(params.pageSize * (params.pageNum-1) ).limit(params.pageSize)
}

export function createById(collection, id,obj)
{
  //return collection.doc(id).set(obj)
}

export function where(collection, field, condition, value)
{
  //return collection.where(field,condition,value )
}

export function execute(query)
{
  //return query.get()
}

export function findById(collection, id)
{
  //const elemRef = collection.doc(id)
  //return elemRef.get()
}

export function fetch(doc)
{
  //return doc.data()
}

export function updateById(collection,id, values)
{
  //const elemRef = collection.doc(id)
  //return elemRef.set(values)
}

export function deleteById(collection, id)
{
 // const doc = collection.doc(id)
 // return doc.delete()
}

