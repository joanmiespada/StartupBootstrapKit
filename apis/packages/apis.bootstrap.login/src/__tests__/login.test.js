import expect from 'expect'
import request from 'request'

describe('login api testing', ()=>{

    const options = {
        url:'http://127.0.0.1:8080/v1/login',
        method: 'POST',
        json: {
            email:'repefi@nej.hr',
            password:'pepe'
        }
    }

    it('login ok', async()=>{ 
        try{
            request(options ,(err,res, body ) => {
                if (err) { 
                    console.log(err); 
                    
                    return; }
                expect(body.result).toEqual(true)
                expect(body.data.login).toEqual(true)
                expect(body.data.token).toBeTruthy()
                expect(body.data.id).toBeTruthy()
            })

        }catch(err){
            console.log(err)
            expect(false).toEqual(true)
        }
    })
})