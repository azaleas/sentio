import React from 'react';
import PropTypes from 'prop-types';

import Link from 'react-router-dom/Link';

const NotFound = ({ className }) => {
    return (
       <div className="ui negative message center">
            <div className="header">404</div>
            <p>Nothing was found here. Go to <Link to="/">main.</Link></p>
        </div> 
    );
};

NotFound.propTypes = {
    className: PropTypes.string,
};

export default NotFound;
