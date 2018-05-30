import React from 'react';
import { connect } from 'react-redux';
import { Dialog, Input, ProgressBar } from 'react-toolbox';
import PropTypes from 'prop-types';
import { login } from './Actions';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'ahese@non.bh',
      passw: 'pepe',
      formValid: true,
      formErrors: { email: undefined, passw: undefined },
    };
  }

  handleChange = name => (value) => {
    this.setState({ ...this.state, [name]: value }, () => {
      const validate = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      };
      const valid = (validate(this.state.email) && this.state.passw.length > 0) ? true : false;
      this.setState({ ...this.state, formValid: valid });
    });
  }

  login = () => {
    this.props.loginMethod(this.state.email, this.state.passw)
      .then((res) => {
        if (res) this.props.handleToggle();
      })
      .catch((err) => { alert(err); });
  }

  render() {
    const errorMessage = [];
    const red = { color: 'red' };

    if (this.state.formErrors.email !== undefined) {
      errorMessage.push((<span style={red}>{this.state.formErrors.email} </span>));
    }
    if (this.state.formErrors.passw !== undefined) {
      errorMessage.push((<span style={red}> {this.state.formErrors.email} </span>));
    }

    let progressbar = null;
    if (this.props.isFetching) {
      progressbar = (<ProgressBar type="circular" mode="indeterminate" multicolor />);
    }

    const actions = [
      {
        label: 'Login',
        disabled: !this.state.formValid,
        raised: true,
        primary: true,
        onClick: this.login,
      },
      { label: 'Close', onClick: this.props.handleToggle },
    ];

    return (
      <Dialog
        actions={actions}
        active={this.props.showme}
        onEscKeyDown={this.props.handleToggle}
        onOverlayClick={this.props.handleToggle}
        title="Login"
      >
        <Input
          type="email"
          label="Email address"
          required
          value={this.state.email}
          maxLength={50}
          onChange={this.handleChange('email')}
        />
        {progressbar}
        <Input
          type="password"
          label="Password"
          required
          value={this.state.passw}
          maxLength={50}
          onChange={this.handleChange('passw')}
        />
        {errorMessage}
      </Dialog>);
  }
}

Login.propTypes = {
  showme: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  loginMethod: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  let { loginSpining } = state;

  if (loginSpining === undefined) { loginSpining = false; }

  return { isFetching: loginSpining };
};

const mapLoginOnRequestToProps = dispatch => ({
  loginMethod: (email, pass) => dispatch(login(email, pass)),
});

export default connect(mapStateToProps, mapLoginOnRequestToProps)(Login);

