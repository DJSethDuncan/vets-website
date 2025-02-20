import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from '~/platform/monitoring/record-event';
import backendServices from '~/platform/user/profile/constants/backendServices';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import {
  createIsServiceAvailableSelector,
  selectProfile,
} from '~/platform/user/selectors';
import IconCTALink from '../IconCTALink';
import {
  getAppealsV2 as getAppealsAction,
  getClaimsV2 as getClaimsAction,
  getLighthouseClaims as getLighthouseClaimsAction,
} from '../../actions/claims';
import {
  appealsAvailability,
  claimsAvailability,
} from '../../utils/appeals-v2-helpers';
import { canAccess } from '../../../common/selectors';
import { API_NAMES } from '../../../common/constants';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import useHighlightedClaimOrAppealV2 from './hooks/useHighlightedClaimOrAppealV2';
import HighlightedClaimAppealV2 from './HighlightedClaimAppealV2';

const NoClaimsOrAppealsText = () => {
  return (
    <p
      className="vads-u-margin-bottom--2p5 vads-u-margin-top--0"
      data-testid="no-outstanding-claims-or-appeals-text"
    >
      You have no claims or appeals to show.
    </p>
  );
};

const ClaimsAndAppealsError = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  // status will be 'warning' if toggle is on
  const status = useToggleValue(TOGGLE_NAMES.myVaUpdateErrorsWarnings)
    ? 'warning'
    : 'error';

  return (
    <div className="vads-u-margin-bottom--2p5">
      <va-alert status={status}>
        <h2 slot="headline">
          We can’t access your claims or appeals information
        </h2>
        <div>
          <p>
            We’re sorry. Something went wrong on our end. If you have any claims
            and appeals, you won’t be able to access your claims and appeals
            information right now. Please refresh or try again later.
          </p>
        </div>
      </va-alert>
    </div>
  );
};

const PopularActionsForClaimsAndAppeals = () => {
  return (
    <>
      <h3 className="sr-only">Popular actions for Claims and Appeals</h3>
      <IconCTALink
        text="Learn how to file a claim"
        href="/disability/how-to-file-claim/"
        icon="file"
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': 'Learn how to file a claim',
            'links-list-section-header': 'Claims and appeals',
          });
        }}
        testId="file-claims-and-appeals-link-v2"
      />
      <IconCTALink
        text="Manage all claims and appeals"
        href="/claim-or-appeal-status/"
        icon="clipboard-check"
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': 'Manage all claims and appeals',
            'links-list-section-header': 'Claims and appeals',
          });
        }}
        testId="manage-claims-and-appeals-link-v2"
      />
    </>
  );
};

const ClaimsAndAppealsV2 = ({
  appealsData,
  claimsData,
  // for some unit testing purposes, we want to prevent this component from
  // making API calls which kicks off a chain of events that results in the
  // component always showing a loading spinner. I do not like this approach.
  dataLoadingDisabled = false,
  hasAPIError,
  loadAppeals,
  loadClaims,
  loadLighthouseClaims,
  shouldLoadAppeals,
  shouldLoadClaims,
  shouldShowLoadingIndicator,
  useLighthouseClaims,
}) => {
  React.useEffect(
    () => {
      if (!dataLoadingDisabled && shouldLoadAppeals) {
        loadAppeals();
      }
    },
    [dataLoadingDisabled, loadAppeals, shouldLoadAppeals],
  );

  React.useEffect(
    () => {
      if (!dataLoadingDisabled && shouldLoadClaims) {
        // stop polling the claims API after 45 seconds
        const pollingExpiration = Date.now() + 45 * 1000;
        if (useLighthouseClaims) {
          loadLighthouseClaims({ pollingExpiration });
        } else {
          loadClaims({ pollingExpiration });
        }
      }
    },
    [
      dataLoadingDisabled,
      loadClaims,
      loadLighthouseClaims,
      shouldLoadClaims,
      useLighthouseClaims,
    ],
  );

  // the most recently updated open claim or appeal or
  // the latest closed claim or appeal that has been updated in the past 60 days
  const highlightedClaimOrAppeal = useHighlightedClaimOrAppealV2(
    appealsData,
    claimsData,
  );

  if (shouldShowLoadingIndicator) {
    return (
      <div
        className="vads-u-margin-y--6"
        data-testid="dashboard-section-claims-and-appeals-loader-v2"
      >
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Claims and appeals
        </h2>
        <va-loading-indicator message="Loading claims and appeals..." />
      </div>
    );
  }

  return (
    <div data-testid="dashboard-section-claims-and-appeals-v2">
      <h2>Claims and appeals</h2>
      <div className="vads-l-row">
        <DashboardWidgetWrapper>
          {hasAPIError && <ClaimsAndAppealsError />}
          {!hasAPIError && (
            <>
              {highlightedClaimOrAppeal ? (
                <HighlightedClaimAppealV2
                  claimOrAppeal={highlightedClaimOrAppeal}
                  useLighthouseClaims={useLighthouseClaims}
                />
              ) : (
                <>
                  <NoClaimsOrAppealsText />
                  <PopularActionsForClaimsAndAppeals />
                </>
              )}
            </>
          )}
        </DashboardWidgetWrapper>
        {highlightedClaimOrAppeal && !hasAPIError ? (
          <DashboardWidgetWrapper>
            <PopularActionsForClaimsAndAppeals />
          </DashboardWidgetWrapper>
        ) : null}
      </div>
    </div>
  );
};

ClaimsAndAppealsV2.propTypes = {
  dataLoadingDisabled: PropTypes.bool,
  hasAPIError: PropTypes.bool.isRequired,
  loadAppeals: PropTypes.func.isRequired,
  loadClaims: PropTypes.func.isRequired,
  loadLighthouseClaims: PropTypes.func.isRequired,
  shouldLoadAppeals: PropTypes.bool.isRequired,
  shouldLoadClaims: PropTypes.bool.isRequired,
  shouldShowLoadingIndicator: PropTypes.bool.isRequired,
  useLighthouseClaims: PropTypes.bool.isRequired,
  userFullName: PropTypes.object.isRequired,
  appealsData: PropTypes.arrayOf(PropTypes.object),
  claimsData: PropTypes.arrayOf(PropTypes.object),
};

const isClaimsAvailableSelector = createIsServiceAvailableSelector(
  backendServices.EVSS_CLAIMS,
);
const isAppealsAvailableSelector = createIsServiceAvailableSelector(
  backendServices.APPEALS_STATUS,
);

// returns true if claimsV2.v2Availability is set to a value other than
// appealsAvailability.AVAILABLE or appealsAvailability.RECORD_NOT_FOUND_ERROR
const hasAppealsErrorSelector = state => {
  const claimsV2Root = state.claims;
  return (
    claimsV2Root.v2Availability &&
    claimsV2Root.v2Availability !== appealsAvailability.AVAILABLE &&
    claimsV2Root.v2Availability !== appealsAvailability.RECORD_NOT_FOUND_ERROR
  );
};

const mapStateToProps = state => {
  const claimsState = state.claims;
  const { appealsLoading, claimsLoading } = claimsState;
  const hasAppealsError = hasAppealsErrorSelector(state);
  const hasClaimsError =
    claimsState.claimsAvailability === claimsAvailability.UNAVAILABLE;
  const hasAPIError = !!hasAppealsError || !!hasClaimsError;
  const canAccessAppeals = canAccess(state)[API_NAMES.APPEALS];

  return {
    appealsData: claimsState.appeals,
    claimsData: claimsState.claims,
    hasAPIError,
    shouldLoadAppeals: isAppealsAvailableSelector(state) && canAccessAppeals,
    shouldLoadClaims: isClaimsAvailableSelector(state),
    // as soon as we realize there is an error getting either claims or appeals
    // data, stop showing a loading spinner
    shouldShowLoadingIndicator:
      (appealsLoading || claimsLoading) && !hasAPIError,
    userFullName: selectProfile(state).userFullName,
  };
};

const mapDispatchToProps = {
  loadAppeals: getAppealsAction,
  loadClaims: getClaimsAction,
  loadLighthouseClaims: getLighthouseClaimsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimsAndAppealsV2);
