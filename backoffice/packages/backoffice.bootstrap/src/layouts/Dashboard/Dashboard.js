import { connect } from 'react-redux';
import {actions} from 'stateManagement';
import App from './Dashboard'

const mapDispatchToProps = () => { return { methods: Object.assign({}, actions )  } };

const mapStateToProps = (state) => { return { state: state } };
console.log(connect)
const container = connect(mapStateToProps, mapDispatchToProps);
console.log(container)
export default container(App)
