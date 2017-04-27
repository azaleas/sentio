import React from 'react';
import PropTypes from 'prop-types';

import {Doughnut} from 'react-chartjs-2';
import { defaults } from 'react-chartjs-2';

defaults.global.defaultFontFamily = "'Lato', 'Helvetica Neue', 'Helvetica', sans-serif";
defaults.global.legend.labels.fontSize = 14;
defaults.global.legend.labels.padding = 20;

const chartColors = [
    "#6495ed",
    "#bf3eff",
    "#228b22",
    "#ffd700",
    "#bebebe",
    "#7fffd4",
    "#ff4040",
    "#7fff00",
    "#ff7f24",
    "#ff7256",
    "#00ffff",
    "#caff70",
    "#ff8c00",
    "#8fbc8f",
    "#ff1493",
    "#00bfff",
    "#7cfc00",
    "#add8e6",
    "#f08080",
    "#66cdaa",
];

const Poll = (props) => {

    let labels = [];
    let data = [];
    let backgroundColor = [];

    props.poll.choices.forEach((choice, index) => {
        labels.push(choice.choice_text);
        data.push(choice.vote);
        backgroundColor.push(chartColors[index]);
    });
    
    const chartData = {
        labels,
        datasets: [{
            data,
            backgroundColor,
            hoverBackgroundColor: backgroundColor,
        }]
    }

    return (
        <div>
            <h2 className="ui center aligned icon header tiny">
                <i className="help circle icon green"></i>
                <span>{props.poll.question_text}</span>
            </h2>
            <div className="ui center aligned grid poll-selectwrapper">
                <div className="row">
                    <select 
                        onChange={props.onVoteSelectChange}
                        name="choiceSelect"
                        id="choiceSelect" 
                        className="ui dropdown">
                        {
                            props.poll.choices.map((choice, index) => (
                                <option 
                                    value={choice.choice_id}
                                    key={choice.choice_id}
                                    >
                                    {choice.choice_text}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="row">
                    <div className="ui labeled button">
                        <div 
                            onClick={props.onVote}
                            className="ui button green">
                            <i className="heart icon"></i> Vote
                        </div>
                            <a className="ui basic label">
                            {props.totalVotes}
                        </a>
                    </div>
                    {
                        props.voted
                        ? (
                        <div className="ui icon error message mini">
                            <i className="warning circle icon"></i>
                                <div className="content">
                                    <div className="header">
                                      You already voted.
                                    </div>
                                </div>
                        </div>
                        )
                        :(<p></p>)
                    }
                </div>
                <div className="ui divider"></div>
                <div className="row">
                    <div className="chart-wrapper">
                        <Doughnut 
                            data={chartData}
                            width={300}
                            height={400}
                            options={{
                                maintainAspectRatio: false
                            }}
                            />
                    </div>
                </div>
            </div>
            
        </div>        
    );
};

Poll.propTypes = {
    className: PropTypes.string,
    poll: PropTypes.object,
    totalVotes: PropTypes.number,
    onVoteSelectChange: PropTypes.func,
    onVote: PropTypes.func,
    voted: PropTypes.bool,
};

export default Poll;
