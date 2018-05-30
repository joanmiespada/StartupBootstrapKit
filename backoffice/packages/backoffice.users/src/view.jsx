import React from 'react';
//import { connect } from 'react-redux';
// import { Dialog, Input, ProgressBar } from 'react-toolbox';
//import { Table } from 'react-toolbox';
// import PropTypes from 'prop-types';
// import { login } from './actions';

/*
const UserModel = {
  name: { type: String },
  twitter: { type: String },
  birthdate: { type: Date, title: 'Date of Birth' },
  cats: { type: Number },
  dogs: { type: Number },
  active: { type: Boolean },
};
*/
const users = [{
    name: 'Javi Jimenez', twitter: '@soyjavi', birthdate: new Date(1980, 3, 11), cats: 1,
},
  { name: 'Javi Velasco', twitter: '@javivelasco', birthdate: new Date(1987, 1, 1), dogs: 1, active: true }
];


export class View extends React.Component {
    constructor() {
        super()
        this.state = { selected: [], source: users }
    }/*
    handleChange = (row, key, value) => {
        const source = this.state.source;
        source[row][key] = value;
        this.setState({source});
    };

    handleSelect = (selected) => {
        this.setState({selected});
    };
*/
    render() {
        return (
            <div>pepepe</div>
        )
    }
}


/*

<Table
            model={UserModel}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
            selectable
            multiSelectable
            selected={this.state.selected}
            source={this.state.source}
        />

*/