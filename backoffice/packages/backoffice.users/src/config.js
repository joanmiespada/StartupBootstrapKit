

export class config
{
    constructor() {
        
        this._apiToken  = undefined
        this._protocol  = undefined
        this._address   = undefined
        this._port  = undefined
        this._apiVersion  = undefined
    }

    get ApiToken(){ return this._apiToken}
    set ApiToken(value) { this._apiToken=value}

    get Protocol(){ return this._protocol}
    set Protocol(value) { this._protocol=value}

    get Address(){ return this._address}
    set Address(value) { this._address=value}

    get Port(){ return this._port}
    set Port(value) { this._port=value}

    get ApiVersion(){ return this._apiVersion}
    set ApiVersion(value) { this._apiVersion=value}

    get Url()
    {
        return `${config._protocol}://${config._address}:${config._port}/${config._apiVersion}`
    }
}