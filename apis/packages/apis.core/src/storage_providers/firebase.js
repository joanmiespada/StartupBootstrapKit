import * as admin from 'firebase-admin'
import fs from 'fs'
import {storage } from './definition'

export class firebase extends storage
{

  start()
  {
    if(process.env.FIREBASE_PRIVATE_KEY_CERT_FILE === undefined )//or else env variable is not defined
    {
        throw new Error('missing ENV config')  
    }

    let cert = fs.readFileSync( process.env.FIREBASE_PRIVATE_KEY_CERT_FILE  ,'utf8')

    let config ={
      "type": "service_account",
      "project_id": "pmp-empowered-d1e1e",
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
      "private_key": cert,
      "client_email": "firebase-adminsdk-lmfei@pmp-empowered-d1e1e.iam.gserviceaccount.com",
      "client_id": process.env.FIREBASE_CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ja8r7%40pmp-empowered.iam.gserviceaccount.com"
    }

    admin.initializeApp({
      credential: admin.credential.cert(config),
      databaseURL: 'https://pmp-empowered.firebaseio.com'
    })

    this._db = admin.firestore()
  }

  close()
  {
    //nothing to do, just for compatibility
    return 0; 
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

  execute(collection,query)
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

