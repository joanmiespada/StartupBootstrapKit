
import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import methodOverride from 'method-override'
import helmet from 'helmet'
import compression from 'compression'
import cluster from 'cluster'
import os from 'os'

import {logsys as logger } from 'apis-core'
import {shutdown} from 'apis-core'

const isProduction = process.env.NODE_ENV === 'production'

export const bootstrap = (config) =>
{
    if(process.env.ENVFILE)
    {
        const aux = path.join(__dirname,process.env.ENVFILE) 
        dotenv.config({ path: aux })
    }
    const message = `Boostraping microservice ${config.description} with env: ${process.env.NODE_ENV}`
    logger.app.info(message)
    console.log(message) //eslint-disable-line

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
        });
        
        cluster.on('disconnect', (worker) => {
            const aux = `Process ${worker.process.pid} disconnected, restarting...`
            logger.app.info(aux)
            console.log(aux)//eslint-disable-line
            cluster.fork();
        });
        

    } else {

        const app = express()
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json({ type: 'application/json' }))
        app.use(bodyParser.text({ type: 'text/html' }))
        if(isProduction){
            app.use(morgan('combined', {stream: { write: (str) =>{ logger.app.error(str) }}} ))
        }else{
            app.use(morgan('dev'))
        }
        app.use(methodOverride())
        app.use(helmet())
        app.use(compression())
        app.use(logger.log.connectLogger(logger.http, { level: 'auto' }))
        app.use( (req,res,next) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin')
            next()
        })

        const logic = config.logic(express.Router() );
        app.use(config.version + logic.urlbase, logic.router)

        const server = app.listen(config.port, () => { 
            const aux= `Child process with PID: ${process.pid} - Server ${config.description} api is running at http://127.0.0.1:${config.port}`
            logger.app.info(aux)
            console.log(aux)//eslint-disable-line
        })

        const closeServer = () => {
            const aux = `Child process with PID: ${process.pid} - Server ${config.description} api has been stopped`
            logger.app.info(aux)
            console.log(aux)//eslint-disable-line
        }

        process.on ('SIGTERM', shutdown.gracefulShutdown(server,closeServer))
        process.on ('SIGINT',  shutdown.gracefulShutdown(server,closeServer))

    }

}


