import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {api} from './../utils/Api';

const queryString = require('query-string');

class LoginTwitter extends Component {

    componentWillMount(){
        const parsed = queryString.parse(location.search);
        api.saveTwitterTokens(parsed.user_oauth_token, parsed.user_oauth_verifier, parsed.user)
        window.open('', '_self', ''); window.close();
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}

LoginTwitter.propTypes = {
    className: PropTypes.string,
};

export default LoginTwitter;
