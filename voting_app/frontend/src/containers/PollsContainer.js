import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './../utils/api';

class PollsContainer extends Component {
    
    /*Container that will hold the list of all polls*/

    constructor(props) {
        super(props);

        this.state = {
            fetched: false,
            polls: [],
        }
    }

    componentDidMount() {
        this.getPolls();
    }

    getPolls() {
        api.fetchAllPolls()
            .then((polls) => {
                this.setState({
                    fetched: true,
                    polls,
                });
            });
    }

    polls(){
        console.log(this.state.polls);
        return this.state.polls.map((poll) => {
            return (
                <div className="item">
                    <div className="content">
                        <div className="header">{poll.question_text}</div>
                    </div>
                </div>
            )
        });
    }

    render() {
        return (
            !this.state.fetched
            ?(
                <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading the data...</div>
                </div>
            )
            :(
                <div className="ui relaxed divided list">
                    {this.polls()}
                </div>
            )
        );
    }
}

PollsContainer.propTypes = {
    className: PropTypes.string,
};

export default PollsContainer;
