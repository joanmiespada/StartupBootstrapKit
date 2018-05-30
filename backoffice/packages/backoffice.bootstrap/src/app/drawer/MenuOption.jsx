import React from 'react';
import { MenuItem } from 'react-toolbox';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

class menuOption extends React.Component {
  click = (e) => {
    e.preventDefault();
    this.props.history.push(this.props.url);
    this.props.close();
  }

  render() {
    return (
      <MenuItem value="download" icon="get_app" caption={this.props.label} onClick={this.click} />
    );
  }
}

menuOption.propTypes = {
  history: PropTypes.isRequired,
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
};

export default withRouter(menuOption);
