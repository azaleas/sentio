import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Link from 'react-router-dom/Link';
import Redirect from 'react-router-dom/Redirect';

import {api} from './../utils/Api';

class TopBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fetchingToken: false,
        }
    }

    twitterLoginStart = (event) => {

        localStorage.removeItem('oath_token');
        localStorage.removeItem('oauth_secret');
        localStorage.removeItem('user');
            
        // http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
        let dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        let dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

        let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        let left = ((width / 2) - (570 / 2)) + dualScreenLeft;
        let top = ((height / 2) - (520 / 2)) + dualScreenTop;
        window.open(
            'http://votingapp.com:8000/auth/twitter/login', 
            '_blank', 
            'location=yes,height=570,width=520,scrollbars=yes,status=yes,top=' + top + ',left=' + left + ''
        );
        this.twitterLogin();
    }

    twitterLogin(){
        /*Remove login text while loggging in is in process*/
        let user = localStorage.getItem('user');
        if(user !== '' && typeof user !== 'undefined' && user !== null){
            this.setState({
                fetchingToken: true,
            });
        }
        api.handleTwitterLogin()
            .then((response) =>{
                if(response === 'error'){
                    setTimeout(() => {
                        this.twitterLogin();
                    }, 50);
                }
                else if(response === 'success'){
                    this.setState({
                        fetchingToken: false,
                    });
                }
            })
    }

    render() {
        return (
            <div className="topBar-wrapper">
                <div className="ui menu">
                    <div className="item">
                        <Link to="/">
                            <h2 className="ui green ribbon label app-label">
                                <span>Sentio - a Voting App</span>
                            </h2>
                        </Link>
                    </div>
                    {
                        api.isLoggedIn()
                        ? (
                            <div className="right menu">
                                <div className="item">
                                    Hello, {api.getUsername()}
                                </div>
                                <div className="item">
                                    <Link 
                                        to="/logout">
                                        My Polls
                                    </Link>
                                </div>
                                <div className="item">
                                    <Link 
                                        to="/logout">
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        )
                        : (
                            <div className="right menu">
                                {
                                    this.state.fetchingToken
                                    ?(
                                        <div className="item user--loading">
                                            <div className="ui active inverted dimmer">
                                                <div className="ui loader"></div>
                                            </div>
                                            <Redirect push to="/" />
                                        </div>
                                    )
                                    :(
                                        <div className="item">
                                            <a
                                            style={{cursor: "pointer"}}
                                            onClick={this.twitterLoginStart}
                                            >Login</a>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
                <div className="ui divider"/>
            </div>
        );
    }
}

TopBar.propTypes = {
    className: PropTypes.string,
};

export default TopBar;