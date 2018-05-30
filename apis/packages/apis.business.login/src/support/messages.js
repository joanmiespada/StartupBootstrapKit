import {messages} from 'apis-core'

let myMessages = {
    errNotUserFoundByEmail:'not user found by email or password incorrect',
    errNoEmailandPassword: 'no email and/or password defined'
};

const result = Object.assign({}, messages, myMessages)

export default result