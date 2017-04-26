import React, { Component, PropTypes } from 'react';

class PollsContainer extends Component {
    
    /*Container that will hold the list of all polls*/

    static propTypes = {
        className: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='ui active centered inline loader green' />
        );
    }
}

export default PollsContainer;
