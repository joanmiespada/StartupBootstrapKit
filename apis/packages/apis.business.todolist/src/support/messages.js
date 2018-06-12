import {messages} from 'apis-core'; 

let myMessages = {  
    errNoTodoListExistWithId: 'no todo list exist with id',
    errTitleIsMandatory: 'title is mandatory',
    errTitleAlreadyExists: 'title already exists',
    errTodoListIdIsMandatory: 'todo list id is mandatory',
    errOwnerIsMandatory: 'user id as owner\'s list is mandatory'
};

const result = Object.assign({}, messages, myMessages);

export default result;
