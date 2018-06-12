
import {app} from '../logsys'

export class storage
{

    constructor()
    {
      this._db = undefined

      this._tables = { 
                        users:'users',
                        todoLists:'todolists' 
                    } //add all collections here! 
    }

    get db() { return this._db}
    get tables () { return this._tables }


    message(str){
        console.log(str) //eslint-disable-line
        app.info(str)
    }

}
