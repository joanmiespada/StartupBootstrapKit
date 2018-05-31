import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppBar, Layout, NavDrawer, Panel, FontIcon, Snackbar } from 'react-toolbox'
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  BrowserRouter,
} from 'react-router-dom'
import PropTypes from 'prop-types'

import {View as UserView} from 'backoffice-users'


import Login from '../login/Login';
import MenuOption from './drawer/MenuOption';

console.log(UserView)


const UserModel = {
  name: { type: String },
  twitter: { type: String },
  birthdate: { type: Date, title: 'Date of Birth' },
  cats: { type: Number },
  dogs: { type: Number },
  active: { type: Boolean },
};

const users = [{
    name: 'Javi Jimenez', twitter: '@soyjavi', birthdate: new Date(1980, 3, 11), cats: 1,
},
  { name: 'Javi Velasco', twitter: '@javivelasco', birthdate: new Date(1987, 1, 1), dogs: 1, active: true }
];

const Home = () => (
  <div>
  <p>Welcome to Backoffice.</p>
  <Table>
    <TableHead>
      <TableCell>Name</TableCell>
      <TableCell>Surname</TableCell>
    </TableHead>
    {users.map((item,idx) => {
      <TableRow key={idx}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.surname}</TableCell>
      </TableRow>
    })}
  </Table>
  <p>....</p>
  </div>
);

const NoMatch = () => (
  <div>
    <h3>
      No matched component
    </h3>
    
  </div>
);

class App extends Component {
  static defaultProps = {
    error: undefined,
  }
  constructor(props) {
    super(props);
    this.state = {
      drawerActive: false,
      loginDialog: false,
      errMessageBar: false,
    };
  }

  toggleDrawerActive = () => {
    this.setState({ drawerActive: !this.state.drawerActive });
  };

  toggleLoginWindow = () => {
    this.setState({ loginDialog: !this.state.loginDialog });
  }

  handleSnackbarClick = () => {
    this.setState({ errMessageBar: false });
  };

  checkErrorMessage = () => {
    if (this.props.error !== undefined) {
      this.setState({ errMessageBar: true });
      return true;
    }
    return false;
  }

  render() {
    return (
      <BrowserRouter>
        <Router>
          <Layout>
            <Login
              showme={this.state.loginDialog}
              handleToggle={this.toggleLoginWindow}
            />
            <NavDrawer
              active={this.state.drawerActive}
              permanentAt="xxxl"
              onOverlayClick={this.toggleDrawerActive}
            >
              <MenuOption close={this.toggleDrawerActive} label="User List" url="/users" />

            </NavDrawer>
            <Panel>
              <AppBar
                title="Back-Office"
                leftIcon="menu"
                rightIcon={<FontIcon value="account_circle" />}
                onLeftIconClick={this.toggleDrawerActive}
                onRightIconClick={this.toggleLoginWindow}
              />
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/users" component={UserView} />
                  <Route component={NoMatch} />
                </Switch>
              </div>
            </Panel>
            <Snackbar
              action="Dismiss"
              active={this.state.errMessageBar}
              label={this.props.error}
              timeout={2000}
              onClick={this.handleSnackbarClick}
              onTimeout={this.handleSnackbarClick}
              type="cancel"
            />
          </Layout>
        </Router>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  error: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

// const mapStateToProps = state => ({ error: state.error });
const mapStateToProps = (state) => {
  let result;
  if (state.length > 1) {
    if (state[state.length - 1].error !== undefined) {
      result = state[state.length - 1].error;
    }
  }
  return { error: result };
};

export default connect(mapStateToProps)(App);
