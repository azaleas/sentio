import React from 'react';
import Link from 'react-router-dom/Link';

const TopBar = () => (
    <div className="topBar-wrapper">
        <Link to="/">
            <h2 className="ui green ribbon label app-label">
                <span>Sentio - a Voting App</span>
            </h2>
        </Link>
        <div className="ui divider"/>
    </div>
);

export default TopBar;
