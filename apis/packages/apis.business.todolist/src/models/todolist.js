import {model} from 'apis-core'

/**
 * TodoList class model implementation
 * @param {Array} todoList - list of instances todo stored in this collection
 * @param {uuid} Owner - user's id owner of this collection 
 * @param {string} Title - collection's title
 * @param {string} Description - collection's description 
 */
class todoList extends model
{
    constructor() {
        super();
        this.todos   = undefined
        this.owner      = undefined
        this.title      = undefined
        this.description = undefined
    }

    get ToDos(){ return this.todos}
    set ToDos(value) { this.todos=value}

    get Owner(){ return this.owner}
    set Owner(value) { this.owner=value}

    get Title(){ return this.title}
    set Title(value) { this.title=value}

    get Description(){ return this.description}
    set Description(value) { this.description=value}

}

export default todoList; 