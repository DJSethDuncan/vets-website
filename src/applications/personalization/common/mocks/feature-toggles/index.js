const generateFeatureToggles = (toggles = {}) => {
  const {
    myVaUseExperimental = true,
    myVaUseLighthouseClaims = true,
    myVaUpdateErrorsWarnings = true,
    vaOnlineSchedulingStaticLandingPage = true,
  } = toggles;

  return {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'my_va_experimental',
          value: myVaUseExperimental,
        },
        {
          name: 'my_va_lighthouse_claims',
          value: myVaUseLighthouseClaims,
        },
        {
          name: 'my_va_update_errors_warnings',
          value: myVaUpdateErrorsWarnings,
        },
        {
          name: 'va_online_scheduling_static_landing_page',
          value: vaOnlineSchedulingStaticLandingPage,
        },
      ],
    },
  };
};

module.exports = { generateFeatureToggles };
