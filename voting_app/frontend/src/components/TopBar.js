import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Link from 'react-router-dom/Link';
import Redirect from 'react-router-dom/Redirect';

import {api} from './../utils/Api';

class TopBar extends Component {

    constructor(props) {
        super(props);
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
                            <div className="right menu" id="desktop-menu">
                                <div className="item">
                                    Hello, {api.getUsername()}
                                </div>
                                <div className="item">
                                    <Link 
                                        to="/">
                                        Polls
                                    </Link>
                                </div>
                                <div className="item">
                                    <Link 
                                        to="/mypolls">
                                        My Polls
                                    </Link>
                                </div>
                                <div className="item">
                                    <Link 
                                        to="/create">
                                        New Poll
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
                            this.props.fetchingToken
                            ?(
                                <div className="right menu" id="desktop-menu">
                                    <div className="item user--loading">
                                        <div className="ui active inverted dimmer">
                                            <div className="ui loader"></div>
                                        </div>
                                        <Redirect push to="/" />
                                    </div>
                                </div>
                            )
                            :(
                                <div className="right menu" id="desktop-menu">
                                    <div className="item">
                                        <Link 
                                            to="/">
                                            Polls
                                        </Link>
                                    </div>
                                    <div className="item">
                                        <a
                                        style={{cursor: "pointer"}}
                                        onClick={this.props.twitterLoginStart}
                                        >Login</a>
                                    </div>
                                </div>
                            )
                        )
                    }
                    {
                        <div className="right menu" id="mobile-menu">
                            <div 
                                onClick={this.props.toggleVisibility}
                                className="nav-button item">
                                <i className="align right icon"></i>
                            </div>
                        </div>
                    }
                </div>
                <div className="ui divider"/>
            </div>
        );
    }
}

TopBar.propTypes = {
    className: PropTypes.string,
    toggleVisibility: PropTypes.func,
    twitterLoginStart: PropTypes.func,
    fetchingToken: PropTypes.bool,
};

export default TopBar;