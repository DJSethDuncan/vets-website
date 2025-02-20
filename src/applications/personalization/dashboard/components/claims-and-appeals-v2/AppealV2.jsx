import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  APPEAL_TYPES,
  EVENT_TYPES,
  getTypeName,
  programAreaMap,
} from '../../utils/appeals-v2-helpers';

import { getStatusContents } from '../../utils/getStatusContents';

import CTALink from '../CTALink';

const capitalizeFirstLetter = input => {
  const capitalizedFirstLetter = input[0].toUpperCase();
  return `${capitalizedFirstLetter}${input.slice(1)}`;
};

const AppealV2 = ({ appeal, name }) => {
  if (!appeal.attributes) {
    throw new TypeError(
      '`appeal` prop is malformed; it should have an `attributes` property.',
    );
  }
  let requestEventType;
  let isAppeal;

  switch (appeal.type) {
    case APPEAL_TYPES.legacy:
      requestEventType = EVENT_TYPES.nod;
      isAppeal = true;
      break;
    case APPEAL_TYPES.supplementalClaim:
      requestEventType = EVENT_TYPES.scRequest;
      isAppeal = false;
      break;
    case APPEAL_TYPES.higherLevelReview:
      requestEventType = EVENT_TYPES.hlrRequest;
      isAppeal = false;
      break;
    case APPEAL_TYPES.appeal:
      requestEventType = EVENT_TYPES.amaNod;
      isAppeal = true;
      break;
    // no default
  }

  const requestEvent = appeal.attributes.events.find(
    event => event.type === requestEventType,
  );
  const updatedEventDateString =
    appeal.attributes.events[appeal.attributes.events.length - 1].date;
  const programArea = programAreaMap[appeal.attributes.programArea];

  let appealTitle = '';

  if (isAppeal) {
    if (programArea) {
      appealTitle = `${programArea} `;
    }
    appealTitle += getTypeName(appeal);
  } else {
    appealTitle = getTypeName(appeal);
    if (programArea) {
      appealTitle += ` for ${programArea}`;
    }
  }

  appealTitle += ` updated on ${moment(updatedEventDateString).format(
    'MMMM D, YYYY',
  )}`;
  appealTitle = capitalizeFirstLetter(appealTitle);

  return (
    <div className="vads-u-padding-y--2p5 vads-u-padding-x--2p5 vads-u-background-color--gray-lightest">
      <h3 className="vads-u-margin-top--0">
        {appealTitle}
        {/* Claim for compensation received June 7, 1999 */}
      </h3>
      <div className="vads-u-display--flex">
        <i
          aria-hidden="true"
          className="fas fa-fw fa-check-circle vads-u-margin-right--1 vads-u-margin-top--0p5 vads-u-color--green"
        />
        <div>
          <p className="vads-u-margin-y--0">
            Status: {getStatusContents(appeal, name).title}
          </p>
          {appeal.attributes.description && (
            <p className="vads-u-margin-y--0">
              {appeal.attributes.issues.length === 1 ? 'Issue' : 'Issues'} on
              {isAppeal ? ' appeal' : ' review'}:{' '}
              {appeal.attributes.description}
            </p>
          )}
          {requestEvent && (
            <p className="vads-u-margin-y--0">
              Submitted on: {moment(requestEvent.date).format('MMMM D, YYYY')}
            </p>
          )}
        </div>
      </div>
      <CTALink
        ariaLabel={`Review details of ${appealTitle} `}
        className="vads-u-margin-top--2 vads-u-font-weight--bold"
        text="Review details"
        href={`/track-claims/appeals/${appeal.id}/status`}
        showArrow
      />
    </div>
  );
};

AppealV2.propTypes = {
  appeal: PropTypes.object.isRequired,
  name: PropTypes.string,
};

export default AppealV2;
