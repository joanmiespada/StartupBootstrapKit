import { connect } from 'react-redux';
import {actions} from 'stateManagement';
import App from './Dashboard'

const mapDispatchToProps = { ...actions };

const mapStateToProps = (state) => { return { state: state } };

const container = connect(mapStateToProps, mapDispatchToProps);

export default container(App)
