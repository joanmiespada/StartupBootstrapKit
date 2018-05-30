### APIS

Here you'll be able to explore a complete API build with NODE.JS from scratch. 

The technical stack is: 

| Element       | Description                     | 
| --------------|:-------------------------------:| 
| Node          | Node runtime to execute the API |
| Babel         | Javascript last features        |   
| Webpack       | Build and bundle js files       | 
| Jest          | Unit testing                    |
| Firebase      | Database NoSQL                  |
| Express       | API Routing                     |
| Travis CI     | Travis configuration            |
| Eslint        | Linting for code style quality  |
| log4js        | Loggin errors and app's messages|
| JWT           | Json Web Tokens to protect you API |
| Docker        | Api Dockerized                     |
| Lerna         | Local packages dependencies        |
| Webpack       | Bundle all local packages in a unique file per microservice |

To install dependencies:
```
yarn global add lerna 
lerna bootstrap
``` 
If you are running with Node 10, please, use yarn with `--ignore-engines`

Once all modules are in node_modules folder (in apis folder) you should run every API in unique terminal.
First of all, starting with `loginapi` with command: `yarn nodemon-loginapi`.
If you want execute CRUD operations to create users then run `yarn nodemon-userapi`. 
However, if you want start all apis at the same time, execute: `yarn nodemon`.

Please, check `package.json` script section for details.


### Setup

1) Create an account on Google Firebase.
2) Download credentials file with API keys. It's a json file with all info together. 
3) Create new forlder with name `.env` in apis forlder following this structure:
```
FIREBASE_PRIVATE_KEY_CERT_FILE=<file name with the Firebase cert content>
FIREBASE_PRIVATE_KEY_ID=<copy here firebase private key ID>
FIREBASE_CLIENT_ID=<client id>
PASSWORD_SALT=<write a number between 5 to 100>
PASSWORD_JWT=....
<please, check file ./env/template.env in 'apis.core' package to find other env variables>
```

You should create one file per environtment (test, prouduction,etc...). 
For example, create a file with name: env01.env for production and env02.env for test.

4) Create new folder with name `certs` in apis folder. Then add `apicert.pem` file sourced by firebase here.

### Bootstrap the KIT

Inside apis folder write `yarn bootstrap`. All dependencies will be resolved.

### Test

Execute `yarn test` and all tests in every package will be executed.
Execute `yarn test-easy` and all tests in every package will be executed with few details.    

### Add new packages

If you need add more dependencies in one package, then you should do:
1) Go to the package, example `apis.core`
2) Write `lerna add crypto-js` if you want add cryptoJS library. Lerna will check all graph dependencies and will add it for you. 

### Compile

Please, read package.json scripts section. You'll be able to find some interesting options such as `yarn start` or `yarn nodemon`.

### Code structure

Apis folder has been split by 5 projects:

|Component | Description | Details |
|----------|-------------|------|
|apis.bootstrap.login| microservice for login features| [readme](./packages/apis.bootstrap.login/readme.md) |
|apis.bootstrap.users| microservice related with user's CRUD| |
|apis.business.login| business logic to provide login and tests| |
|apis.business.users| business logic with features related CRUD operations for users| |
|apis.core| shared components for bootstrap and business packages| |

### Docker

If you want to run all apis together: 

- docker-compose up -d

### TODO

- Several improvements 


