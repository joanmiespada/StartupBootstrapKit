import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import crypto  from 'crypto-js'


if(process.env.PASSWORD_SALT === undefined )//or else env variable is not defined
{
    const aux = __dirname+'/../../.env/production.env'
    dotenv.config({ path: aux })
}

const cryptToHash= (password) =>{ 
    
    return new Promise( (resolve, reject) =>{
        bcrypt.genSalt( parseInt(process.env.PASSWORD_SALT) , (err, salt) => {
            if (err) reject(err)
            bcrypt.hash(password, salt, (err, hash)=> { resolve(hash)  })
        });
    });
}

const compareToHash = (password, hash) =>{ 
        return new Promise((resolve, reject ) =>{
            bcrypt.compare(password, hash, (err, isPasswordMatch) => {
                return err === undefined ? resolve(isPasswordMatch) : reject(err)
            });
        });
}

const createJWTtoken = (data) =>{
    return jwt.sign(data, process.env.PASSWORD_JWT, { expiresIn: '1h' })
}

const verifyJWTtokenAsync = (token) =>{
    return new Promise((resolve ) =>{
        jwt.verify(token,process.env.PASSWORD_JWT, (err) => {
            err === null ? resolve(true) : resolve(false) //reject(err)
        });
    });
}

const verifyJWTtoken = (token) =>{
    return jwt.verify(token,process.env.PASSWORD_JWT) 
}

const cryptoText = (text) =>  { 
    const res = crypto.AES.encrypt(text, process.env.PASSWORD_AES) 
    const finalText = `${res}`;
    return finalText
}

const decryptoText = (text) => {
    const bytes = crypto.AES.decrypt(text,process.env.PASSWORD_AES)
    const plaintext = bytes.toString(crypto.enc.Utf8)
    return plaintext
}

const obfuscateEmail = (e) =>
    {
        var n = 0;
        var r = '';

        e = e.replace( /@/, " [at] ");
        e = e.replace( /\./g, " [dot] ");

        for( var i=0; i < e.length; i++ )
        {
            n = e.charCodeAt( i );
            if( n >= 8364 )
            {
                n = 128;
            }
            r += String.fromCharCode(n+1);
        }
        return r;
    }

    function deobfuscateEmail( s )
    {
        var n = 0;
        var r = '';
        for( var i = 0; i < s.length; i++)
        {
            n = s.charCodeAt( i );
            if( n >= 8364 )
            {
                n = 128;
            }
            r += String.fromCharCode( n - 1 );
        }
        return r;
    }

export 
{
    cryptToHash,
    compareToHash,
    createJWTtoken,
    verifyJWTtokenAsync,
    verifyJWTtoken,
    cryptoText,
    decryptoText,
    obfuscateEmail,
    deobfuscateEmail
}