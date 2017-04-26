import React from 'react';
import ReactDOM from 'react-dom';

import Router from 'react-router-dom/BrowserRouter';

import App from './components/App';
import '../semantic/dist/semantic.css';
import './styles/index.css';

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);
