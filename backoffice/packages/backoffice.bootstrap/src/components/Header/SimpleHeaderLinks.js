import { connect } from 'react-redux';
import {actions} from 'stateManagement';
import SimpleHeaderLinks from './SimpleHeaderLinks.jsx'

const mapDispatchToProps = (dispatch) => { 
   return {
       methods:{
        LoginOnOpen: ()=> dispatch(actions.LoginOnOpen() ),
       // LoginOnClose: () => dispatch(actions.LoginOnClose())
       }
   }
};

const mapStateToProps = (state) => { return { state: state.login } };

export default connect(mapStateToProps, mapDispatchToProps)(SimpleHeaderLinks); 