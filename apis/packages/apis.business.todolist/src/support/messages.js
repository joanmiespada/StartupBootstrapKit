import {messages} from 'apis-core'; 

let myMessages = {  
    errNoTodoListExistWithId: 'no todolist exists with id',
    errTitleIsMandatory: 'title is mandatory',
    errTitleAlreadyExists: 'title already exists',
    errTodoListIdIsMandatory: 'todo list id is mandatory',
    errOwnerIsMandatory: 'user id as owner\'s list is mandatory',
    errNoTodoExistWithId: 'no todo item exists with id'
};

const result = Object.assign({}, messages, myMessages);

export default result;
