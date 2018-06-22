import React from 'react';
//import { connect } from 'react-redux';
//import { Dialog, Input, ProgressBar } from 'react-toolbox';
//import PropTypes from 'prop-types';
//import { login } from './actions';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
//import withMobileDialog from '@material-ui/core/withMobileDialog';


class Login extends React.Component {
  constructor(props) {
    super(props);
  }
/*
  handleChange = name => (value) => {
    this.setState({ ...this.state, [name]: value }, () => {
      const validate = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  //eslint-disable-line no-useless-escape
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
*/
  handleLogin = () => {
    console.log('s111111111')
  }
  handleClose = () => {
    console.log('s2222222222')
  }

  render() {
    const errorMessage = [];
    const red = { color: 'red' };

    /*if (this.state.formErrors.email !== undefined) {
      errorMessage.push((<span style={red}>{this.state.formErrors.email} </span>));
    }
    if (this.state.formErrors.passw !== undefined) {
      errorMessage.push((<span style={red}> {this.state.formErrors.email} </span>));
    }*/

    /*let progressbar = null;
    if (this.props.isFetching) {
      progressbar = (<ProgressBar type="circular" mode="indeterminate" multicolor />);
    }*/

    /*const actions = [
      {
        label: 'Login',
        disabled: !this.state.formValid,
        raised: true,
        primary: true,
        onClick: this.login,
      },
      { label: 'Close', onClick: this.props.handleToggle },
    ];*/
    const showed = this.props.state.showed
    //console.log(aux)
    //let compo = undefined
    //if(!showed)
    //  compo = null
    //else
    
    return (
      <div>
          <Dialog
          open={showed}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Login</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleLogin} color="primary">
              Login
            </Button>
          </DialogActions>
          {errorMessage}
        </Dialog>
      </div>
      );
  }
}

/*Login.propTypes = {
  handleClose: PropTypes.func.isRequired
};*/


export default Login
//export default withMobileDialog(Login)

/*




*/