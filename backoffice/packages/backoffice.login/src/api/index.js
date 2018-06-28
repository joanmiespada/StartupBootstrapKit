import fetch from 'cross-fetch'
import {params} from 'backoffice-core'

import {LoginOnRequest, LoginOnError, LoginOnReceived  } from '../stateManagement/actions'


export const login = (email, password) => (
    dispatch => new Promise((resolve, reject) => {
        dispatch(LoginOnRequest(email, password));
        const env = params.environments.local
        const envParams = params.loginService[env]
        const url = `${envParams.protocol}://${envParams.server}:${envParams.port}/${envParams.version}/${envParams.endPoint}/`
        fetch(url, {
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
            res.json().then((response) => {
                    
                    if(response === null) {
                        const err = 'No data received'
                        dispatch(LoginOnError(err))
                        reject(err)
                        return;
                    }
            
                    if(!response.result) {
                        dispatch(LoginOnError( response.data.message ))
                        reject(response.message)
                        return;
                    }
            
                    if(!response.data.login) {
                        dispatch(LoginOnError( response.data.message ))
                        reject(response.message)
                        return;
                    }
        
                    dispatch(LoginOnReceived(email,response.data.id , response.data.token))
                    resolve(true)
                })
          
        })/*
        .catch((err) => {
          dispatch(LoginOnError(err))
          reject(err)
        });*/
    })/*).catch((err) => {
        dispatch(LoginOnError(err))
        reject(err)
      })*/
  )