import React from 'react';

import Route from 'react-router-dom/Route';
import Redirect from 'react-router-dom/Redirect';

import TopBar from './../components/TopBar';
import PollsContainer from './../containers/PollsContainer';

import './../styles/App.css';

const App = () => (
    <div className="ui container raised segment">
        <TopBar />
        <div className="spacer row app-wrapper">
            <Route path="/polls" component={PollsContainer} />
                <Route exact path="/" render={() => (
                        <Redirect
                            to="/polls"
                        />
                    )} 
                />
        </div>
    </div>    
);

export default App;
