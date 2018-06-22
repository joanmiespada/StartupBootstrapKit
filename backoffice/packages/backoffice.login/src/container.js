import { connect } from 'react-redux';
import * as actions from './actions';
import {stateKey} from './state';

const mapDispatchToProps = { ...actions };

const mapStateToProps = (state) => { return { state: state[stateKey] } };

export default connect(mapStateToProps, mapDispatchToProps);