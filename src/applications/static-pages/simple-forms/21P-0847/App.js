import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

const App = ({ formEnabled }) => {
  if (formEnabled === undefined) {
    return <va-loading-indicator set-focus message="Loading..." />;
  }

  if (formEnabled) {
    return (
      <>
        <p>You can submit this form online or by mail.</p>
        <a
          className="vads-c-action-link--blue"
          href="/supporting-forms-for-claims/substitute-claimant-form-21P-0847"
        >
          Submit a request online to be a substitute for a deceased claimant
        </a>
        <a
          className="vads-c-action-link--green"
          href="/find-forms/about-form-21p-0847/"
        >
          Get VA Form 21P-0847 to download
        </a>
      </>
    );
  }

  return (
    <>
      <p>You can submit this form by mail.</p>
      <a
        className="vads-c-action-link--green"
        href="/find-forms/about-form-21p-0847/"
      >
        Get VA Form 21P-0847 to download
      </a>
    </>
  );
};

App.propTypes = {
  formEnabled: PropTypes.bool,
};

const mapStateToProps = store => ({
  formEnabled: toggleValues(store)[FEATURE_FLAG_NAMES.form21P0847],
});

export default connect(mapStateToProps)(App);