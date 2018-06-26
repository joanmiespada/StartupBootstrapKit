import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import * as _login from 'backoffice-login';

import "assets/css/material-dashboard-react.css?v=1.2.0";

import indexRoutes from "routes/index.jsx";
import {store as DashboardStore} from 'stateManagement';
import {reducers as DashboardReducers} from 'stateManagement';
import {state as DashboardState} from 'stateManagement';

const hist = createBrowserHistory();

const globalReducers = {};
globalReducers[_login.stateKey] = _login.reducers
globalReducers[DashboardState.stateKey] = DashboardReducers.reducers


const storeApp = DashboardStore.CreateAppStore(  
                    DashboardStore.CombineReducers(globalReducers) );

ReactDOM.render(
  <Provider store={storeApp}>
    <Router history={hist}>
      <Switch>
        {indexRoutes.map((prop, key) => {
          return <Route path={prop.path} component={prop.component} key={key} />;
        })}
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);
