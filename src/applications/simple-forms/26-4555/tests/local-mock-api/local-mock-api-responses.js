const commonResponses = require('../../../../../platform/testing/local-dev-mock-api/common');

module.exports = {
  ...commonResponses,
  'GET /v0/feature_toggles': {
    data: {
      type: 'feature_toggles',
      features: [
        { name: 'edu_section_103', value: true },
        { name: 'facilityLocatorShowCommunityCares', value: true },
        { name: 'form264555', value: true },
        { name: 'gibctEybBottomSheet', value: true },
        { name: 'profile_show_profile_2.0', value: false },
        { name: 'showExpandableVamcAlert', value: true },
        { name: 'vaOnlineScheduling', value: true },
        { name: 'vaOnlineSchedulingCancel', value: true },
        { name: 'vaOnlineSchedulingCheetah', value: true },
        { name: 'vaOnlineSchedulingCommunityCare', value: true },
        { name: 'vaOnlineSchedulingDirect', value: true },
        { name: 'vaOnlineSchedulingExpressCare', value: true },
        { name: 'vaOnlineSchedulingExpressCareNew', value: true },
        { name: 'vaOnlineSchedulingFlatFacilityPage', value: true },
        { name: 'vaOnlineSchedulingHomepageRefresh', value: true },
        { name: 'vaOnlineSchedulingPast', value: true },
        { name: 'vaOnlineSchedulingProviderSelection', value: true },
        { name: 'vaOnlineSchedulingRequests', value: true },
        { name: 'vaOnlineSchedulingUnenrolledVaccine', value: true },
        { name: 'vaOnlineSchedulingVAOSServiceCCAppointments', value: false },
        { name: 'vaOnlineSchedulingVAOSServiceRequests', value: false },
        { name: 'vaOnlineSchedulingVAOSServiceVAAppointments', value: false },
        { name: 'vaViewDependentsAccess', value: false },
      ],
    },
  },
  'PUT /v0/in_progress_forms/26-4555': {
    data: {
      id: '1234',
      type: 'in_progress_forms',
      attributes: {
        formId: '26-4555',
        createdAt: '2023-01-11T21:46:40.395Z',
        updatedAt: '2023-01-11T21:46:40.417Z',
        metadata: {
          version: 1,
          returnUrl: '/review-and-submit',
          savedAt: 1673473600090,
          submission: {
            status: false,
            errorMessage: false,
            id: false,
            timestamp: false,
            hasAttemptedSubmit: false,
          },
          expiresAt: 9999999999,
          lastUpdated: 1673473600,
          inProgressFormId: 1234,
        },
      },
    },
  },
};
