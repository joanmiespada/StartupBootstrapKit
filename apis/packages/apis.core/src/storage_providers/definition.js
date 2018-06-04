




export class storage
{

    constructor()
    {
      this._db = undefined

      this._tables = { 
                        users:'users' 
                    } //add all collections here! 
    }

    get db() { return this._db}
    get tables () { return this._tables }


}
