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
        this.changes     = []
    }

    get Title(){ return this.title}
    set Title(value) { this.title=value}

    get Description(){ return this.description}
    set Description(value) { this.description=value}

    get DateCreation(){ return this.dateCreation}
    set DateCreation(value) { this.dateCreation=value}

    get Changes(){ return this.changes}
    set Changes(value) { this.changes=value}

    static get Meta()  {
        const obj = super.Meta
        obj['title'] = 'string'
        obj['description'] = 'string'
        obj['dateCreation'] = 'date'
        obj['changes'] = 'array of'
        return obj
    }

    plainObject()
    {
        let obj= super.plainObject()
        obj['title'] = this.title
        obj['description'] = this.description
        obj['dateCreation'] = this.dateCreation
        obj['changes'] = this.changes

        return obj
    
    }

    static mappingToModel(ttd)
    {
        const todo = new todo()   
        todo.Id = ttd.id
        todo.Vers = ttd.vers
        todo.Title = ttd.title
        todo.Description = ttd.description
        todo.DateCreation = ttd.dateCreation
        todo.Changes = Object.assign({}, ttd.changes)
        return todo
    }
}

export default todo; 