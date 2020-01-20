
import path from 'path'
import dotenv from 'dotenv'
import cluster from 'cluster'
import os from 'os'
import minimist from 'minimist'
import {setupStorage} from './storage_providers/setup'
import {startup} from './rest'
import * as logger from './logsys'

import {gracefulShutdown} from './shutdown'

const isProduction = process.env.NODE_ENV === 'production'

const welcomeMessage =(config)=>{
    const message = `Boostraping microservice ${config.description} with env: ${process.env.NODE_ENV}`
    logger.app.info(message)
    console.log(message) //eslint-disable-line
}

export const bootstrap = (config, commandLineParams) =>
{
    var argv = minimist(commandLineParams.slice(2));

    if(process.env.ENVFILE)
    {
        const aux = path.join(__dirname,process.env.ENVFILE) 
        dotenv.config({ path: aux })
    }
    
    welcomeMessage(config)
    
    const storage = setupStorage( config.db || argv)

    if( cluster.isMaster && isProduction ) {

        const numCpus = os.cpus().length
        const aux = `Master process for ${config.description} is running, PID: ${process.pid}`
        logger.app.info(aux)
        console.log(aux)//eslint-disable-line

        for (let i = 0; i < numCpus; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker) => {
            const aux = `Process ${worker.process.pid} died`
            logger.app.info(aux)
            console.log(aux)//eslint-disable-line

            storage.close()

        });
        
        cluster.on('disconnect', (worker) => {
            const aux = `Process ${worker.process.pid} disconnected, restarting...`
            logger.app.info(aux)
            console.log(aux)//eslint-disable-line
            cluster.fork();
        });
        

    } else {

        const restApi = startup(config,storage);

        const server = restApi.listen(config.port, () => { 
            const aux= `Child process with PID: ${process.pid} - Server ${config.description} api is running at http://127.0.0.1:${config.port}`
            logger.app.info(aux)
            console.log(aux)//eslint-disable-line
        })

        const closeServer = () => {
            const aux = `Child process with PID: ${process.pid} - Server ${config.description} api has been stopped`
            logger.app.info(aux)
            console.log(aux)//eslint-disable-line

        }


        process.on ('SIGTERM', gracefulShutdown(server,closeServer))
        process.on ('SIGINT',  gracefulShutdown(server,closeServer))

    }

}


