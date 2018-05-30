import { isNumber } from 'util'

import * as encrypt from './encrypt'
import messages from './messages'
import errCodes from './errorcodes'
import keys from './keys'
import apiParams from './apiparams'

const checkUserToken = (uToken) => 
{
    try{
        const aux= encrypt.verifyJWTtoken(uToken)
        return jsonOK(aux) //{result: true, data:aux}
    }catch(err){ 
        return jsonError(keys.errTokenUserIdentification) //{result: false, error: buildError( ) }
    } 
}

const buildError = (key, errorCodes = errCodes , messageStrings= messages) =>
{
    return {
        codeError: errorCodes[key], 
        messageError: messageStrings[key]
    }
}

const jsonError = (key, errorCodes = errCodes , messageStrings= messages) =>
{
    return {
        result: false, 
        error: buildError( key, errorCodes, messageStrings )
    }
}

const jsonOK = (data, meta=undefined) =>
{
    let aux= {
        result:true,
        data:data
    }
    if(meta !== undefined)
    {
        aux = Object.assign({}, aux, {meta:meta})
    }
    return aux;
}

const extracPageNumberPageSize = (params) =>
{
    let pageSize= params.pageSize;
    let pageNumber= params.pageNumber;

    pageSize = Number.parseInt(pageSize);
    pageNumber = Number.parseInt(pageNumber);
    if( !isNumber(pageSize) || !isNumber(pageNumber))
        return jsonError(keys.errPageSizePageNum) //{ result:false, error: buildError(keys.errPageSizePageNum) };
    else
    {
        if (pageSize >= apiParams.pageSizeMin &&
            pageSize <= apiParams.pageSizeMax)
                return jsonOK({pageSize:pageSize,pageNumber:pageNumber }) //{ result:true, data:{pageSize:pageSize,pageNumber:pageNumber } }
        else
                return jsonError(keys.errPageSizePageNum) // { result:false, error: buildError(keys.errPageSizePageNum) };   
    }

}

export {jsonOK, jsonError, buildError, checkUserToken, extracPageNumberPageSize}