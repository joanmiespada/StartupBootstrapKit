import { connect } from 'react-redux';
import {stateKey} from '../stateManagement/state';
import {login} from '../api'

const mapDispatchToProps = (dispatch) => { 
    return {
         Login: (email,pass)=> dispatch(login(email,pass) )
        }
 };

const mapStateToProps = (state) => { return { state: state[stateKey] } };

export default connect(mapStateToProps, mapDispatchToProps);