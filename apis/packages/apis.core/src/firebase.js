import * as admin from 'firebase-admin';
import fs from 'fs';

let db = undefined; // = admin.firestore();
let tables = { users:'users' } //add all collections here! 

export function start()
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
  });

  db = admin.firestore();
  return { db, tables};
}




