import React from "react";
import PropTypes from "prop-types";
import { List, ListItem, withStyles } from "material-ui";

import footerStyle from "assets/jss/material-dashboard-react/footerStyle";

function SimpleFooter({ ...props }) {
  const { classes } = props;
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
         &nbsp;
        </div>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "} Acme Inc.
          </span>
        </p>
      </div>
    </footer>
  );
}

SimpleFooter.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(footerStyle)(SimpleFooter);
