import React from 'react';
import PropTypes from 'prop-types';

const IncomeLimitsApp = ({ children }) => {
  return (
    <div className="row vads-u-padding-top--4 vads-u-padding-bottom--8">
      <div className="usa-width-two-thirds medium-8 columns">{children}</div>
    </div>
  );
};

IncomeLimitsApp.propTypes = {
  children: PropTypes.any,
};

export default IncomeLimitsApp;