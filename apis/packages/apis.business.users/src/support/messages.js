import {messages} from 'apis-core'; 

let myMessages = {  
    errNoUserExistWithId: 'no user exist with id',
    errEmailIsMandatory: 'email is mandatory',
    errPasswordIsMandatory: 'password is mandatory',
    errEmailAlreadyExists: 'email already exists'
};

const result = Object.assign({}, messages, myMessages);

export default result;
