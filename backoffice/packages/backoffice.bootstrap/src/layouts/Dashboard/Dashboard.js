import { connect } from 'react-redux';
import {actions} from 'stateManagement';
import Dashboard from './Dashboard.jsx'

const mapDispatchToProps = (dispatch) => { 
    return {
        methods:{
         LoginOnOpen: ()=> dispatch(actions.login.LoginOnOpen() ),
         LoginOnClose: () => dispatch(actions.login.LoginOnClose())
        }
    }
 };

const mapStateToProps = (state) => { return { state: state } };

const container = connect(mapStateToProps, mapDispatchToProps);

export default  connect(mapStateToProps, mapDispatchToProps)(Dashboard);

