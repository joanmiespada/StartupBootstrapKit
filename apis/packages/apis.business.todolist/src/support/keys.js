import {keys} from 'apis-core'; 

let myKeys = {  
    errNoTodoListExistWithId:'errNoTodoListExistWithId',
    errNoTodoExistWithId:'errNoTodoExistWithId',
    errTitleIsMandatory:'errTitleIsMandatory',
    errTitleAlreadyExists: 'errTitleAlreadyExists',
    errTodoListIdIsMandatory: 'errTodoListIdIsMandatory',
    errOwnerIsMandatory: 'errOwnerIsMandatory'
};

const result = Object.assign({}, keys, myKeys);

export default result;
