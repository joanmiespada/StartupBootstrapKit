import {keys} from 'apis-core'; 

let myKeys = {  
    errNoUserExistWithId:'errNoUserExistWithId',
    errEmailIsMandatory:'errEmailIsMandatory',
    errPasswordIsMandatory:'errPasswordIsMandatory',
    errEmailAlreadyExists:'errEmailAlreadyExists'
};

const result = Object.assign({}, keys, myKeys);

export default result;
