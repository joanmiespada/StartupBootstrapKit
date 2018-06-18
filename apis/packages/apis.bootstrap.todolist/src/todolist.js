import {endpoint} from 'apis-core'
import {messages} from 'apis-core'

class todolistapi extends endpoint
{

    constructor(router, business)
    {
        super(router,business)
        this._urlbase = '/todolist'
    }

   
    createNew(business){
        return (req,res)=>
        {   
            business.createNewTodoList(req.headers.token,req.body).then( (opResult)=> {
                if(opResult.result === true)
                {
                    this._log.debug(`new TodoList created`)
                    res.writeHead(endpoint.Http201, endpoint.ContentTextJson)
                    res.end( JSON.stringify(opResult))
                }else
                {
                    res.writeHead(endpoint.Http400, endpoint.ContentTextPlain)
                    res.end()
                }
            }).catch( (err)=>{
                //console.log( messages.errGettingUsers, err);
                this._log.error(`error creating new user`,err)
                res.writeHead(endpoint.Http500, endpoint.ContentTextPlain)
                res.end( messages.errinternalServer)
            }); 
            
        }
    }

    getById(business)
    {
        return (req,res)=>
        {           
            business.getTodoListById(req.headers.token,req.params.id)
            .then((opResult)=>{
                res.writeHead(endpoint.Http201, endpoint.ContentTextJson);
                res.end( JSON.stringify(opResult));  
            })
            .catch( (err)=>{
                //console.log( messages.errGettingUsers, err)
                this._log.error(`error getting TodoList by id: ${req.params.id}`,err)
                res.writeHead(endpoint.Http500, endpoint.ContentTextPlain);
                res.end( messages.errinternalServer);
            });         
        }
    }

    updateById(business){
        return (req,res)=>
        {
            business.updateTodoListById(req.headers.token,req.params.id,req.body)
            .then((opResult)=> {
                res.writeHead(endpoint.Http201, endpoint.ContentTextJson);
                res.end( JSON.stringify(opResult)); 
            })
            .catch( (err)=>{
                //console.log( messages.errGettingUsers, err);
                this._log.error(`error updating TodoList by id: ${req.params.id}`,err)
                res.writeHead(endpoint.Http500, endpoint.ContentTextPlain);
                res.end( messages.errinternalServer);
            });      
        }
    }

    deleteById(business){
        return (req,res)=>
        {
            business.deleteTodoListById(req.headers.token,req.params.id)
            .then( opResult =>  res.status(endpoint.Http201).json(opResult) )
            .catch( err => res.status(endpoint.Http403).json(err) )
            .finally( () => { res.end() } );
        }
    }

    getAll(business){
        return (req,res)=>
        {          
            business.getAllTodoLists(req.headers.token,req.params )
                .then( listOfusers =>  res.status(endpoint.Http200).json(listOfusers) )
                .catch( err => res.status(endpoint.Http403).json(err) )
                .finally( () => { res.end() } );
        }
    }
}

export default todolistapi;

