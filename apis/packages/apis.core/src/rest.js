
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import methodOverride from 'method-override'
import helmet from 'helmet'
import compression from 'compression'
import * as logger from './logsys'
import cors from 'cors'

const isProduction = process.env.NODE_ENV === 'production'

export const startup = (config,storage) => {

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
    app.use( cors({ origin:true }) )


    if(Array.isArray(config.logic))
    {
        config.logic.forEach(item=>{
            const logic = item(express.Router(), storage  )
            app.use(config.version + logic.urlbase, logic.router)    
        })
    }else{
        const logic = config.logic(express.Router(), storage  )
        app.use(config.version + logic.urlbase, logic.router)
    }

    return app;

}

