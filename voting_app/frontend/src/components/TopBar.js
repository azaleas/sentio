import React from 'react';
import Link from 'react-router-dom/Link';

import {api} from './../utils/Api';

const TopBar = () => (
    <div className="topBar-wrapper">
        <div className="ui menu">
            <div className="item">
                <Link to="/">
                    <h2 className="ui green ribbon label app-label">
                        <span>Sentio - a Voting App</span>
                    </h2>
                </Link>
            </div>
            <div className="right menu">
                <div className="item">
                    {
                        api.isLoggedIn()
                        ? (
                            <Link 
                                to="/logout">
                                Logout
                            </Link>
                        )
                        : (
                            <Link
                                to="/login"
                                >
                                Login
                            </Link>
                        )
                    }
                </div>
            </div>
        </div>
        <div className="ui divider"/>
    </div>
);

export default TopBar;
