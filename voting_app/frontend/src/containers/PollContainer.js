import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from './../utils/api';

import NotFound from './../components/NotFound';

class PollContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            poll: [],
            fetched: false,
            isError: false,
        }
    }

    componentDidMount() {
        this.getPoll();
    }

    getPoll() {
        let questionId = this.props.match.params.questionId;
        api.fetchSinglePoll(questionId)
            .then((poll) => {
                if (poll === 404){
                    this.setState({
                        fetched: true,
                        isError: true,
                    });
                }
                else{
                    this.setState({
                        fetched: true,
                        poll,
                    });
                }
            });
    }

    render() {
        return (
            !this.state.fetched
            ?(
                <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading the poll...</div>
                </div>
            )
            :(
                !this.state.isError
                ?(
                    <div>
                        Stoped here!!!
                    </div>
                )
                :(
                    <NotFound/>
                )
            )
        );
    }
}

PollContainer.propTypes = {
    className: PropTypes.string,
};

export default PollContainer;
