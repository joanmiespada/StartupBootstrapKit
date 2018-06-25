import React from "react";
import classNames from "classnames";
import { Manager, Target, Popper } from "react-popper";
import {
  withStyles,
  IconButton,
  MenuItem,
  MenuList,
  Grow,
  Paper,
  ClickAwayListener,
  Hidden
} from "material-ui";
import { Person, Notifications, Dashboard, Search } from "@material-ui/icons";

import { CustomInput, IconButton as SearchButton } from "components";

import headerLinksStyle from "assets/jss/material-dashboard-react/headerLinksStyle";

class SimpleHeaderLinks extends React.Component {
  
  handleClick = () => {
    console.log('asdasdadasd')

    console.log(this.props)

    this.props.methods.LoginOnOpen()
    
  };
  
  render() {

    const { classes } = this.props;
    //const { open } = this.state;
    return (
      <div>
        <IconButton
          onClick={this.handleClick}
          color="inherit"
          aria-label="Person"
          className={classes.buttonLink}
        >
          <Person className={classes.links} />
          <Hidden mdUp>
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </IconButton>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(SimpleHeaderLinks);
