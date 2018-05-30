import log4js from 'log4js'
import fs from 'fs'

import config from '../config/log4js.json'

try{
  fs.mkdirSync('./log')
}catch(err){
  if(err.code != 'EEXIST') {
    console.error('Could not set up log directory, error was: ', err) //eslint-disable-line
    process.exit(1)
  }
}

log4js.configure(config)

const loggerApp = log4js.getLogger('app')
const loggerHttp = log4js.getLogger('http')

export const log = log4js;
export const app = loggerApp;
export const http = loggerHttp;

/*
logger.app.trace('Entering cheese testing');
logger.app.debug('Got cheese.');
logger.app.info('Cheese is Gouda.');
logger.app.warn('Cheese is quite smelly.');
logger.app.error('Cheese is too ripe!');
logger.app.fatal('Cheese was breeding ground for listeria.');

by decorators!!!!
function log(target, name, descriptor) {
        
            console.log(descriptor)
            console.log(arguments)

            let fn = descriptor.value;
            let newFn  = function() {
                //console.log(custompagarm, name);
                fn.apply(target, arguments);
                //console.log(custompagarm, name);
            };
            descriptor.value = newFn;
            return descriptor;
            
    
}
*/