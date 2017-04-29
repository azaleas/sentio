import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {api} from './../utils/Api';

import Polls from './../components/Polls';
import NotFound from './../components/NotFound';

class PollsContainer extends Component {
    
    /*Container that will hold the list of all polls*/

    constructor(props) {
        super(props);

        this.state = {
            fetched: false,
            isError: false,
            polls: [],
        }
    }

    componentWillUnmount() {
        clearInterval(this.pollsDataTimer);
    }

    componentDidMount() {
        this.getPolls();
        this.pollsDataTimer = setInterval(() => {
            this.getPolls();
        }, 5000);
    }

    getPolls() {
        api.fetchAllPolls()
            .then((polls) => {
                if (polls === 404){
                    this.setState({
                        fetched: true,
                        isError: true,
                    });
                }
                else{
                    this.setState({
                        fetched: true,
                        polls,
                    });
                }
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
                !this.state.isError
                ?(
                    <div>
                        <Polls 
                            polls={this.state.polls}
                            path={this.props.location.pathname}
                         />
                    </div>
                )
                :(
                    <NotFound/>
                )
            )
        );
    }
}

PollsContainer.propTypes = {
    className: PropTypes.string,
};

export default PollsContainer;
