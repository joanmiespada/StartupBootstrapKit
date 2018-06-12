import {errCodes} from 'apis-core'; 

const base = 300

let myErrorCodes = {  
    errNoTodoListExistWithId:   base,
    errTitleIsMandatory:        base+1,
    errTitleAlreadyExists:      base+2,
    errTodoListIdIsMandatory:   base+3,
    errOwnerIsMandatory:        base+4
};

const result = Object.assign({}, errCodes, myErrorCodes);

export default result;
