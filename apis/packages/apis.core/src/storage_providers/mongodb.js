import mongo from 'mongodb'
import params from '../apiparams'
import {storage} from './definition'

export class mongodb extends storage
{
    constructor()
    {
        super()
        this._client = undefined
    }
  
    async start()
    {
        //const url = `mongodb://${params.mongo.user}:${params.mongo.pass}@${params.mongo.host}:${params.mongo.port}/${params.mongo.path}`
        const url = `mongodb://${params.mongo.host}:${params.mongo.port}/${params.mongo.path}`

        await mongo.MongoClient.connect(url, (err, client) => {
            if (err) {
                console.log(err) //eslint-disable-line
                throw err;
            }
            this._client = client
            this._db = client.db(params.mongo.path)

            this.message('connection with mongodb ok')
            //console.log(this._client)
            //console.log(this._db)

        })
        
    }

    close()
    {
        if(this._client !== undefined )
        {
            this._client.close()
            this.message('connection with mongodb closed')
        }
    }


    pagedQuery(obj, condition, params)
    {
        return obj.orderBy(condition).startAfter(params.pageSize * (params.pageNum-1) ).limit(params.pageSize)
    }

    createById(collection, id,obj)
    {
        return collection.doc(id).set(obj)
    }

    where(collection, field, condition, value)
    {
        return collection.where(field,condition,value )
    }

    execute(query)
    {
        return query.get()
    }

    findById(collection, id)
    {
        const elemRef = collection.doc(id)
        return elemRef.get()
    }

    fetch(doc)
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
