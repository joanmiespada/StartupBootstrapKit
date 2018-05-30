import {model} from 'apis-core'

class user extends model
{
    constructor() {
        super();
        this.name   =undefined
        this.surname=undefined
        this.email  =undefined
        this.password= undefined
    }

    get Name(){ return this.name}
    set Name(value) { this.name=value}

    get Surname(){ return this.surname}
    set Surname(value) { this.surname=value}

    get Email(){ return this.email}
    set Email(value) { this.email=value}

    get Password(){ return this.password}
    set Password(value) { this.password=value}
}

export default user; 