import {keys} from 'apis-core'; 

let myKeys = {  
    errNoTodoListExistWithId:'errNoTodoListExistWithId',
    errTitleIsMandatory:'errTitleIsMandatory',
    errTitleAlreadyExists: 'errTitleAlreadyExists',
    errTodoListIdIsMandatory: 'errTodoListIdIsMandatory',
    errOwnerIsMandatory: 'errOwnerIsMandatory'
};

const result = Object.assign({}, keys, myKeys);

export default result;
