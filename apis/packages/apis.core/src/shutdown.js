import * as logger from './logsys'

const gracefulShutdown = (srv, customClose)=> {
    const server = srv
    return ()=>{
        
        logger.app.info("Received kill signal, shutting down gracefully.")
        server.close((err)=>{
            if(err){
                logger.app.info("Error: " + err)
                process.exit(1)
            }
            customClose()
            process.exit(0)
        })
            
        // if after 
        setTimeout(()=> {
            logger.app.info("Could not close connections in time, forcefully shutting down");
            process.exit()
        }, 10*1000);
    }
}

export {gracefulShutdown} 