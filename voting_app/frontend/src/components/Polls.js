import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';

const Polls = (props) => (
    <div className="ui relaxed">
        {
            props.polls.map((poll, index) => (
                <Link 
                    to={`${props.path}/${poll.id}`}
                    key={poll.id}
                    >
                    <div className="ui green segment poll-single">
                            {poll.question_text}
                    </div>
                </Link>
            ))
        }
    </div>
);

Polls.propTypes = {
    className: PropTypes.string,
    path: PropTypes.string,
    polls: PropTypes.array,
};

export default Polls;
