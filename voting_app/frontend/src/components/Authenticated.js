import React from 'react';
import PropTypes from 'prop-types';

import { Route, Redirect } from 'react-router-dom';

import {api} from './../utils/Api';

const Authenticated = ({ component, ...rest }) => {
    return (
        <Route {...rest} render={(props) =>{
            if(api.isLoggedIn()){
                return (
                    React.createElement(component, {...props})
                )
            }
            else{
                return(
                    <Redirect to="/" />
                )
            }
            }} />
    );
};

Authenticated.propTypes = {
    className: PropTypes.string,
};

export default Authenticated;
