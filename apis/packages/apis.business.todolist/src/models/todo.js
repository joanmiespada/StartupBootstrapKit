import {model} from 'apis-core'

/**
 * Todo class model implementation
 * @param {string} Title - collection's title
 * @param {string} Description - collection's description 
 * @param {timestamp} DateCreation - Date of creation
 * @param {array} Changes - historic of changes
 */
class todo extends model
{
    constructor() {
        super();
        this.title       = undefined
        this.description = undefined
        this.dateCreation= undefined
        this.changes     = undefined
    }

    get Title(){ return this.title}
    set Title(value) { this.title=value}

    get Description(){ return this.description}
    set Description(value) { this.description=value}

    get DateCreation(){ return this.dateCreation}
    set DateCreation(value) { this.dateCreation=value}

    get Changes(){ return this.changes}
    set Changes(value) { this.changes=value}

}

export default todo; 