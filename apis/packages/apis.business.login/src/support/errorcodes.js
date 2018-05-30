import {errCodes} from 'apis-core'; 

const base = 100

let myErrorCodes = {  
    errNotUserFoundByEmail:   base,
    errNoEmailandPassword:    base + 1
};

const result = Object.assign({}, errCodes, myErrorCodes);

export default result;
