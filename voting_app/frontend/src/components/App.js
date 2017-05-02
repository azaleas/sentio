import React from 'react';

import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Redirect from 'react-router-dom/Redirect';


import Authenticated from './../components/Authenticated';


import TopBar from './../components/TopBar';
import PollsContainer from './../containers/PollsContainer';
import PollContainer from './../containers/PollContainer';
import MyPollsContainer from './../containers/MyPollsContainer';
import MyPollContainer from './../containers/MyPollContainer';
import CreatePollContainer from './../containers/CreatePollContainer';

import LoginTwitter from './../containers/LoginTwitter';
import Logout from './../containers/Logout';

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
                <Authenticated exact path="/mypolls" component={MyPollsContainer} />
                <Authenticated exact path="/mypolls/:questionId" component={MyPollContainer} />
                <Authenticated exact path="/create" component={CreatePollContainer} />
                <Route path="/twitter_logged_in/" component={LoginTwitter} />
                <Route path="/logout" component={Logout} />
                <Route path="*" component={NotFound} />
            </Switch>
        </div>
    </div>    
);

export default App;
