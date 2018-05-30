import {errCodes} from 'apis-core'; 

const base = 200

let myErrorCodes = {  
    errNoUserExistWithId:   base,
    errEmailIsMandatory:    base + 1,
    errPasswordIsMandatory: base + 2,
    errEmailAlreadyExists:  base + 3
};

const result = Object.assign({}, errCodes, myErrorCodes);

export default result;
