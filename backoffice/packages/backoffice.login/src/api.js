
export const login = (email, password) => (
    dispatch => new Promise((resolve, reject) => {
      dispatch(LoginOnRequest(email, password));
      console.log(params)
      fetch('http://127.0.0.1:8080/v1/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => {
          if (res.ok === false) {
            const answer = { status: res.status, statusText: res.statusText }
            dispatch(LoginOnError(answer))
            reject(answer)
          }
          return res.json()
        })
        .then((response) => {
          
          if (response == null) {
            const err = 'No data received'
            dispatch(LoginOnError(err))
            reject(err)
            return;
          }
  
          if(!response.result){
            dispatch(LoginOnError( response.error ))
            reject(response.error)
            return;
          }
  
          if(!response.data.login){
            dispatch(LoginOnError( response.error ))
            reject(response.error)
            return;
          }
  
          dispatch(LoginOnReceived(email,response.data.id , response.data.token))
          resolve(true)
           
          
        })
        .catch((err) => {
          dispatch(LoginOnError(err))
          reject(err)
        });
    })
  )