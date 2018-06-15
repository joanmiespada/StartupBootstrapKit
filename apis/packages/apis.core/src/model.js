export class model
{
    constructor() {
        this.id=undefined;
        this.version = '0.0.0';
    }

    get Id(){ return this.id}
    set Id(value) { this.id=value} 

    get Vers(){ return this.version}
    set Vers(value) { this.version=value} 

    plainObject()
    {
        return {
                id:     this.id, 
                vers:   this.version
             }
    }

    static get Meta()  {

        return {
            id:     'uuid',
            vers:   'version number'
        }
    }

}
