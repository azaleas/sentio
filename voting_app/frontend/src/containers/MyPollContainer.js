import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Redirect from 'react-router-dom/Redirect';

import {api} from './../utils/Api';

import NotFound from './../components/NotFound';
import MyPoll from './../components/MyPoll';


class MyPollContainer extends Component {

    /*Single Poll Container*/

    constructor(props) {
        super(props);
        this.state = {
            poll: [],
            totalVotes: 0,
            fetched: false,
            isError: false,
            voted: false,
            pollDeleted: false,
        }
    }

    componentWillUnmount() {
        clearInterval(this.pollDataTimer);
    }

    componentDidMount() {
        this.getPoll();
        this.pollDataTimer = setInterval(() => {
            if(!this.state.pollDeleted){
                this.getPoll();
            }
        }, 5000);
    }

    getPoll = () => {
        this.questionId = this.props.match.params.questionId;
        api.fetchSinglePoll(this.questionId)
            .then((poll) => {
                if (poll === 404){
                    this.setState({
                        fetched: true,
                        isError: true,
                    });
                }
                else{
                    let totalVotes = 0;
                    poll.choices.forEach((el, index) => {
                        totalVotes+=el.vote;
                    });
                    this.setState({
                        fetched: true,
                        poll,
                        totalVotes,
                    });
                }
            });
    }

    onVoteSelectChange = (event) => {
        this.choiceId = event.target.value;
    }

    onVote = (event) => {
        if(!this.state.voted){
            if(typeof this.choiceId === "undefined"){
                this.choiceId = this.state.poll.choices[0].choice_id;
            }
            this.setState({
                totalVotes: this.state.totalVotes+1,
            });
            api.postVote(this.questionId, this.choiceId)
                .then((response) => {
                    if(response === 403){
                        this.setState({
                            voted: true,
                            totalVotes: this.state.totalVotes-1,
                        });
                    }
                    else{
                        api.fetchSinglePoll(this.questionId)
                            .then((poll) => {
                                this.setState({
                                    poll,
                                });
                            })
                    }
                })
        }
    }

    onDelete = (event) =>{
        api.deletePoll(this.questionId)
            .then((response) => {
                console.log(response);
                if(response === 204){
                    this.setState({
                        pollDeleted: true,
                    })
                }
            })
    }

    render() {
        return (
            this.state.pollDeleted
            ?(
                <Redirect to="/mypolls" />
            )
            :(
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
                            <MyPoll 
                                poll={this.state.poll}
                                totalVotes={this.state.totalVotes}
                                onVoteSelectChange={this.onVoteSelectChange}
                                onVote={this.onVote}
                                voted={this.state.voted}
                                onDelete={this.onDelete}
                            />
                        </div>
                    )
                    :(
                        <NotFound/>
                    )
                )
            )
        );
    }
}

MyPollContainer.propTypes = {
    className: PropTypes.string,
};

export default MyPollContainer;
