import React from 'react';

import Route from 'react-router-dom/Route';
import Redirect from 'react-router-dom/Redirect';

import PollsContainer from './../containers/PollsContainer';

import './../styles/App.css';

const App = () => (
    <div className="ui grid">
        <div className="spacer row">
            <div className="row">
                <Route path="/polls" component={PollsContainer} />
                    <Route exact path="/" render={() => (
                            <Redirect
                                to="/polls"
                            />
                        )} 
                    />
            </div>
        </div>
    </div>    
);

export default App;
