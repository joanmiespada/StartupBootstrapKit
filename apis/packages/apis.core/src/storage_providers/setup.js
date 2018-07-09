import {firebase } from './firebase'
import {mongodb } from './mongodb'
import * as logger from '../logsys'

export const setupStorage = (argv) =>{
    
    let storage = undefined

    if(argv.storage ==='firebase')
        storage = new firebase();
    else if(argv.storage ==='mongodb' )
        storage = new mongodb(); 
    else{
        const aux = `Master ${process.pid}: storage loaded by default: mongodb` 
        console.log(aux)//eslint-disable-line
        logger.app.info(aux)
        storage = new mongodb();
    }
            
    storage.start()

    return storage

}

