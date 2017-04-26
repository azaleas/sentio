import React from 'react';
import ReactDOM from 'react-dom';

import Router from 'react-router-dom/BrowserRouter';
import createBrowserHistory from 'history/createBrowserHistory';


import App from './components/App';
import '../semantic/dist/semantic.css';
import './styles/index.css';


const history = createBrowserHistory()

ReactDOM.render(
    <Router history={history}>
        <App />
    </Router>,
    document.getElementById('root')
);
