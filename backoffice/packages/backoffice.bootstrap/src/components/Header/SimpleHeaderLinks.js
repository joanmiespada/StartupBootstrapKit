import { connect } from 'react-redux';
import {actions} from 'stateManagement';
import SimpleHeaderLinks from './SimpleHeaderLinks.jsx'

const mapDispatchToProps = () => { return { methods: Object.assign({},actions )  } };

const mapStateToProps = (state) => { return { state: state.login } };

const container = connect(mapStateToProps, mapDispatchToProps);

export default container(SimpleHeaderLinks)