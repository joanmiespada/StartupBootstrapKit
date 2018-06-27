
export const params = {

    environments:{
        container:0,
        local:1,
        gateway:2    
    },

    loginService:{
        0:{
            protocol: 'http',
            server: 'localhost',
            port: '5080', //local docker container
            version: 'v1',
            endPoint: 'login'
        },
        1:{
            protocol: 'http',
            server: 'localhost',
            port: '8080', //local debug
            version: 'v1',
            endPoint: 'login'
        },
        2:{
            protocol: 'http',
            server: 'localhost',
            port: '9090', //nginx gateway
            version: '',
            endPoint: 'login'
        }
    },
    userService:{},
    todoListService:{}
}
