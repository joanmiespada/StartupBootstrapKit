

export class user
{
    constructor() {
    
        this._id     = undefined
        this._name   = undefined
        this._surname= undefined
        this._email  = undefined

        this.meta = {
            _id      : 'uuid',
            _name    : 'string',
            _surname : 'string',
            _email   : 'string'
        }
    }

    get Id(){ return this._id}
    set Id(value) { this._id=value}

    get Name(){ return this._name}
    set Name(value) { this._name=value}

    get Surname(){ return this._surname}
    set Surname(value) { this._surname=value}

    get Email(){ return this._email}
    set Email(value) { this._email=value}

}