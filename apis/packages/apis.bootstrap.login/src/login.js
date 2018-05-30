
import {endpoint} from 'apis-core'
import messages from 'apis-core'
import {logsys as logger} from 'apis-core'

class loginapi
{
    constructor(router,business)
    {
        this.router= router
        this.urlbase = '/login'
        this.router.post('/', this.login(business))
        
    }

    login(businessLogic)
    {
        let business = businessLogic
        return (req,res) =>
        {
                //console.log(req.body)
                business.login(req.body.email,req.body.password )
                    .then((opResult)=>{

                        if(opResult.result)
                        {
                            logger.app.info(`pid: ${process.pid} user with email: ${req.body.email} and id: ${opResult.id} has been logged sucessefully`)
                            res.writeHead(endpoint.Http200, endpoint.ContentTextJson);
                            
                        } else {
                            logger.app.info(`pid: ${process.pid} user with email: ${req.body.email} and passworf:*** doesn't exist`)
                            res.writeHead(endpoint.Http403, endpoint.ContentTextPlain);
                            
                        }
                        res.end( JSON.stringify(opResult));
                    })
                    .catch((err)=>{
                        //console.log(`login err: ${messages.errNoEmailandPassword}`, err);
                        logger.app.error(`pid: ${process.pid} user ${req.body.email} hasn't been logged properly`,err)
                        res.writeHead(endpoint.Http500, endpoint.ContentTextPlain);
                        res.end( messages.errInternalServer);
                    } );
        }
    }
}

export default loginapi;

