import fetch from 'cross-fetch'
import mapping from './mapping'

export const USER_GETALL_REQUEST = 'USER_GETALL_REQUEST';
export const USER_GETALL_RESPONSE = 'USER_GETALL_RESPONSE';
export const USER_GETALL_FAIL = 'USER_GETALL_FAIL';

const GetAllOnRequest = (pageSize, pageNum) => ({
  type: 'USER_GETALL_REQUEST',
  pageSize, 
  pageNum,
});

const GetAllOnReceived = (users) => ({
  type: 'USER_GETALL_RESPONSE',
  users,
});

const GetAllOnError = (err) => ({
  type: 'USER_GETALL_FAIL',
  error: err,
});

export const getAllUsers = (config, pageSize, pageNum) => (
  dispatch => new Promise((resolve, reject) => {
    dispatch(GetAllOnRequest(pageSize, pageNum))
    const url = config.Url + `/users/${pageSize}/${pageNum}`
    console.log(url)
    fetch( url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'token': config.apiToken
      }
    })
      .then((res) => {
        if (res.ok === false) {
          const answer = { status: res.status, statusText: res.statusText };
          dispatch(GetAllOnError(answer));
          reject(answer);
        }
        return res.json();
      })
      .then((response) => {
        
        if (response == null) {
          const err = 'No data received';
          dispatch(GetAllOnError(err));
          reject(err);
          return;
        }

        if(!response.result){
          dispatch(GetAllOnError( response.error ));
          reject(response.error);
          return;
        }

        console.log(response.data)

        const users = mapping.listOfUserFromApiToModel(response.data)
       
        console.log(users)

        dispatch(GetAllOnReceived( users ));
        resolve(true);
         
        
      })
      .catch((err) => {
        dispatch(GetAllOnError(err));
        reject(err);
      });
  })
);
