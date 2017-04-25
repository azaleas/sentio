import React, { Component } from 'react';
import './App.css';
import api from './utils/api';

class App extends Component {
    render() {
        api.fetchAllPolls()
            .then((response) =>{
                console.log(response);
            })
        return (
            <div className="App">
                Hello World
            </div>
        );
    }
}

export default App;
