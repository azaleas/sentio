import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Redirect from 'react-router-dom/Redirect';

import {api} from './../utils/Api';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldRedirect: false,
            wrongCredentials: false,
            fieldErrorsLogin: {
                'username': false,
                'password': false,
            },
        }
    }

    handleLogin = (event) => {
        event.preventDefault();
        let fieldErrorsLogin = {};
        let username = event.target['username'].value;
        let password = event.target['password'].value;
        if(username !== '' && password !== ''){
            this.setState({
                fieldErrorsLogin,
            });
            return api.handleLogin(username, password)
                    .then((response) =>{
                        if(response === 'success'){
                            this.setState({
                                shouldRedirect: true,
                            })
                        }
                        /*Wrong credentials*/
                        else if(response === 400){
                            this.setState({
                                wrongCredentials: true,
                            });
                        }
                    });
        }
        else{
            if(username === ''){
                fieldErrorsLogin.username = true;
            }
            if(password === ''){
                fieldErrorsLogin.password = true;
            }
            this.setState({
                fieldErrorsLogin,
            });
        }
    }

    render() {
        return (this.state.shouldRedirect)
        ?(
            <Redirect to="/" />
        )
        :(
            <div className="ui centered grid">
                <div className="row">
                    <div className="six wide tablet six wide computer column">
                        <div className="ui segment">
                            <div className="ui top attached label green">Login</div>
                            <form 
                                onSubmit={this.handleLogin}
                                className="ui form">
                                <div className={"field " + 
                                    (this.state.fieldErrorsLogin.username ? "error" : "")}>
                                    <input 
                                        type="text"
                                        name="username"
                                        placeholder="Username"/>
                                </div>
                                <div className={"field " + 
                                    (this.state.fieldErrorsLogin.password ? "error" : "")}>
                                    <input 
                                        type="password"
                                        name="password"
                                        placeholder="Password"/>
                                </div>
                                <input 
                                    type="submit" 
                                    className="ui button small" 
                                    value="Submit"/>
                            </form>
                            {
                                this.state.wrongCredentials
                                ? (
                                <div className="ui icon error message mini">
                                    <i className="warning circle icon"></i>
                                        <div className="content">
                                            <div className="header">
                                                Wrong Username/Password.
                                            </div>
                                        </div>
                                </div>
                                )
                                :(<p></p>)
                            }
                        </div>
                    </div>
                    <div className="six wide tablet six wide computer column">
                        <div className="ui segment">
                            <div className="ui top attached label green">Register</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    className: PropTypes.string,
};

export default Login;
