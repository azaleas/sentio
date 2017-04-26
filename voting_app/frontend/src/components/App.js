import React from 'react';

import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Redirect from 'react-router-dom/Redirect';

import TopBar from './../components/TopBar';
import PollsContainer from './../containers/PollsContainer';
import PollContainer from './../containers/PollContainer';
import NotFound from './../components/NotFound';

import './../styles/App.css';

const App = () => (
    <div className="ui container raised segment">
        <TopBar />
        <div className="spacer row app-wrapper">
            <Switch>
                <Route exact path="/polls" component={PollsContainer} />
                <Route exact path="/polls/:questionId" component={PollContainer} />
                    <Route exact path="/" render={() => (
                            <Redirect
                                to="/polls"
                            />
                        )} 
                    />
                <Route path="*" component={NotFound} />
            </Switch>
        </div>
    </div>    
);

export default App;
