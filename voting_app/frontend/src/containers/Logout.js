import React, { Component } from 'react';
import Redirect from 'react-router-dom/Redirect';

import {api} from './../utils/Api';

class Logout extends Component {

    constructor(props) {
        super(props);
        api.handleLogout();
    }

    render() {
        return (
            <Redirect to="/"/>
        );
    }
}

export default Logout;
