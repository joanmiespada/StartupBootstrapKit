import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DialogContentText from '@material-ui/core/DialogContentText';
//import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
//import withMobileDialog from '@material-ui/core/withMobileDialog';

import {style} from "./style.jsx";

const isProduction = process.env.NODE_ENV === 'production';

class Login extends React.Component {
  constructor(props) {
    super(props);

    if(!isProduction)
      this.state = {
        email:'ocrat@mafcusi.af',
        passw:'pepe'
      }
    else
      this.state = {
        email:'',
        passw:''
      }
  }

  handleLogin = () => {
    
    this.props.Login(this.state.email,this.state.passw).then((loginOk)=>{
        if(loginOk)
          this.props.onClose();
      }).catch(err=> console.log(err) )

  }
  handleClose = () => {
    
    const {state} = this.props
    
    if(!state.loginSpining)
        this.props.onClose();
  }

  bindModel = (context)=> {
    return (key) => {
      return { 
        value: context.state[key],
          
        onChange(event) {
          const newValue = {}
          newValue[key]= event.target.value
          context.setState( Object.assign({},this.state,newValue) )
          
        }
      };
    }
  }

  render() {
    //const errorMessage = [];
    //const red = { color: 'red' };
    const model = this.bindModel(this);

    

    /*if (this.state.formErrors.email !== undefined) {
      errorMessage.push((<span style={red}>{this.state.formErrors.email} </span>));
    }
    if (this.state.formErrors.passw !== undefined) {
      errorMessage.push((<span style={red}> {this.state.formErrors.email} </span>));
    }*/

        
    const {render,state,classes} = this.props
    
    const errsToShow = state.error !== undefined ?  (<DialogContentText className={classes.red}>{state.error}</DialogContentText>): null
    //const spin = state.loginSpining === true ?  (<CircularProgress className={classes.progress} size={50} color="secondary"/>) : null
    const spin = state.loginSpining === true ?  (<div className={classes.root}><LinearProgress /></div>) : null

    return (
      <div>
          <Dialog
          open={render}
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
              {...model('email')}
            />
            <TextField
              
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              {...model('passw')}
            />
            {errsToShow}
            {spin}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary"
              disabled={state.loginSpining } >
              Cancel
            </Button>
            <Button onClick={this.handleLogin} color="primary"
              disabled={state.loginSpining }>
              Login
            </Button>
          </DialogActions>
          
        </Dialog>
      </div>
      );
  }
}

Login.propTypes = {
  onClose: PropTypes.func.isRequired,
  render: PropTypes.bool.isRequired,
};



export default withStyles(style)(Login)
//export default withMobileDialog(Login)

/*




*/