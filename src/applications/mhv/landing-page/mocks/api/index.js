/* eslint-disable camelcase */
const delay = require('mocker-api/lib/delay');

const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');

const featureToggles = require('./feature-toggles/index');
const user = require('./user/index');

const responses = {
  ...commonResponses,
  'GET /v0/user': user.defaultUser,
  'GET /v0/feature_toggles': featureToggles.generateFeatureToggles({}),
};

module.exports = delay(responses, 2000);
