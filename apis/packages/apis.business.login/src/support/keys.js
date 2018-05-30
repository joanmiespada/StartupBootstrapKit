import {keys} from 'apis-core'; 

let myKeys = {  
    errNotUserFoundByEmail: 'errNotUserFoundByEmail',
    errNoEmailandPassword: 'errNoEmailandPassword'
};

const result = Object.assign({}, keys, myKeys);

export default result;
