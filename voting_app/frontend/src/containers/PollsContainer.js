import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './../utils/api';

import Polls from './../components/Polls';

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

    render() {
        return (
            !this.state.fetched
            ?(
                <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading the polls...</div>
                </div>
            )
            :(
                <div>
                    <Polls 
                        polls={this.state.polls}
                        path={this.props.location.pathname}
                     />
                </div>
            )
        );
    }
}

PollsContainer.propTypes = {
    className: PropTypes.string,
};

export default PollsContainer;
