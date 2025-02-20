import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

import { isClientError, isServerError } from './util';

export const totalDisabilityError = state => {
  return state.totalRating?.error ?? null;
};

export const hasTotalDisabilityClientError = state => {
  const error = totalDisabilityError(state);
  if (!error) {
    return false;
  }
  return isClientError(error.code);
};

export const hasTotalDisabilityServerError = state => {
  const error = totalDisabilityError(state);
  if (!error) {
    return false;
  }
  return isServerError(error.code);
};

// Feature toggles
// 'rated_disabilities_use_lighthouse`
export const rdUseLighthouse = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.ratedDisabilitiesUseLighthouse];
