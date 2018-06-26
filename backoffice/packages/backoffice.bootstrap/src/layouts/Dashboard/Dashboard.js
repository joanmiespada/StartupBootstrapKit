import { connect } from 'react-redux';
import {actions} from 'stateManagement';
import Dashboard from './Dashboard.jsx'

//const mapDispatchToProps = () => { return { methods: Object.assign({}, actions )  } };
const mapDispatchToProps = (dispatch) => { 
    return {
        methods:{
         LoginOnOpen: ()=> dispatch(actions.LoginOnOpen() ),
         LoginOnClose: () => dispatch(actions.LoginOnClose())
        }
    }
 };

const mapStateToProps = (state) => { return { state: state } };

const container = connect(mapStateToProps, mapDispatchToProps);

export default  connect(mapStateToProps, mapDispatchToProps)(Dashboard);

