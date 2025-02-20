import { mhvUrl } from '@department-of-veterans-affairs/platform-site-wide/utilities';
// Links to MHV subdomain need to use `mhvUrl`. Va.gov links can just be paths
// Link objects with an `oldHref` need to be resolved via resolveToggleLink or resolveLinkCollection
// Links with only an href should be links to Va.gov pages and shouldn't need resolving

const hasOwn = (object, prop) =>
  Object.prototype.hasOwnProperty.call(object, prop);

const resolveToggleLink = (link, featureToggles) => {
  const { text, oldHref, href: newHref, toggle } = link;
  let href = newHref || oldHref;
  // If the link's toggle matches a feature toggle
  // check if the toggle is on. If so, show new href. Otherwise show old href
  if (hasOwn(featureToggles, toggle)) {
    const showNewHref = featureToggles[toggle] === true;
    href = showNewHref ? newHref : oldHref;
  }
  return { href, text, key: toggle };
};

const resolveLinkCollection = (links, featureToggles) =>
  links.map(l => resolveToggleLink(l, featureToggles));

const resolveLandingPageLinks = (authdWithSSOe = false, featureToggles) => {
  // Appointments section points to VAOS on va.gov
  const appointmentLinks = [
    {
      href: '/health-care/schedule-view-va-appointments/',
      text: 'Schedule and manage appointments',
      toggle: null,
    },
    {
      href: '/health-care/schedule-view-va-appointments/appointments',
      text: 'Upcoming VA appointments',
      toggle: null,
    },
    {
      href: '/find-locations',
      text: 'Find VA locations',
      toggle: null,
    },
  ];

  const messagesLinks = resolveLinkCollection(
    [
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, 'compose-message'),
        text: 'Compose message',
        toggle: null,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, 'secure-messaging'),
        text: 'Inbox',
        toggle: null,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, 'manage-folders'),
        text: 'Manage folders',
        toggle: null,
      },
    ],
    featureToggles,
  );

  const medicationsLinks = resolveLinkCollection(
    [
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, 'prescription_refill'),
        text: 'Refill VA prescriptions',
        toggle: null,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, '/prescription-tracking'),
        text: 'Track prescription delivery',
        toggle: null,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, '/my-complete-medications-list'),
        text: 'Medications and allergies',
        toggle: null,
      },
    ],
    featureToggles,
  );

  const healthRecordsLinks = resolveLinkCollection(
    [
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, '/download-my-data'),
        text: 'Download medical record (Blue Button)',
        toggle: null,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, '/labs-tests'),
        text: 'Lab and test results',
        toggle: null,
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, '/health-history'),
        text: 'Health history',
        toggle: null,
      },
    ],
    featureToggles,
  );

  const paymentsLinks = [
    {
      href: 'https://dvagov-btsss.dynamics365portals.us/signin',
      oldHref: null,
      text: 'File a claim for travel reimbursement',
      toggle: null,
    },
    {
      href: 'https://pay.gov/public/form/start/25987221',
      oldHref: null,
      text: 'Pay copay bills',
      toggle: null,
    },
  ];

  const medicalSuppliesLinks = [
    {
      href: '/health-care/order-hearing-aid-batteries-and-accessories',
      oldHref: null,
      text: 'Order hearing aid batteries and accessories',
      toggle: null,
    },
    {
      href: '/health-care/order-prosthetic-socks/',
      oldHref: null,
      text: 'Order prosthetic socks',
      toggle: null,
    },
  ];

  const myVaHealthBenefitsLinks = resolveLinkCollection(
    [
      {
        href: '/manage-va-debt/summary/copay-balances/',
        text: 'Current Veteran copay rates',
      },
      {
        href: '/health-care/health-needs-conditions/mental-health',
        text: 'Mental health services',
      },
      {
        href: '/health-care/about-va-health-benefits/dental-care/',
        text: 'Dental care',
      },
      {
        href: '/COMMUNITYCARE/programs/veterans/index.asp',
        text: 'Community care',
      },
      {
        href: '/health-care/update-health-information/',
        text: 'Update health benefits info (10-10EZR)',
      },
      {
        href: null,
        oldHref: mhvUrl(authdWithSSOe, 'health-information-card'),
        text: 'Veteran health information card',
        toggle: null,
      },
      // {
      //   href: '#FIXME-need-link',
      //   text: 'Download my IRS 1095-B form',
      // },
    ],
    featureToggles,
  );

  const moreResourcesLinks = resolveLinkCollection(
    [
      {
        href: '/resources/the-pact-act-and-your-va-benefits/',
        text: 'The PACT Act and your benefits',
      },
      {
        oldHref: mhvUrl(authdWithSSOe, 'check-your-mental-health'),
        text: 'Check your mental health',
      },
      {
        href: 'https://www.veteranshealthlibrary.va.gov/',
        text: 'Veterans Health Library',
      },
      {
        href: 'https://www.myhealth.va.gov/healthy-living-centers',
        text: 'Healthy Living Centers',
      },
      {
        href: 'https://www.myhealth.va.gov/mhv-community',
        text: 'The My HealtheVet community',
      },
      {
        href: '/wholehealth/',
        text: 'VA’s Whole Health living',
      },
      {
        href: mhvUrl(false, 'ss20200320-va-video-connect'),
        text: 'How to use VA Video Connect',
      },
    ],
    featureToggles,
  );

  // Spotlight links are non-authed, so we always pass `false` to mhvUrl
  const spotlightLinks = resolveLinkCollection(
    [
      {
        text: 'Track Your Blood Pressure Online',
        href: null,
        oldHref: mhvUrl(
          authdWithSSOe,
          'ss20190822-track-health-blood-pressure',
        ),
        toggle: null,
      },
      {
        text: 'PACT Act Special Enrollment Period',
        href: null,
        oldHref: mhvUrl(
          authdWithSSOe,
          'ss20230428-pact-act-special-enrollment',
        ),
        toggle: null,
      },
      {
        text: 'Easy Exercises to Reduce Back Pain',
        href: null,
        oldHref: mhvUrl(
          authdWithSSOe,
          'ss20210329-simple-exercises-to-reduce-back-pain',
        ),
        toggle: null,
      },
    ],
    featureToggles,
  );

  const cards = [
    {
      title: 'Appointments',
      icon: 'calendar',
      links: appointmentLinks,
    },
    {
      title: 'Messages',
      icon: 'comments',
      links: messagesLinks,
    },
    {
      title: 'Medications',
      icon: 'prescription-bottle',
      links: medicationsLinks,
    },
    {
      title: 'Health records',
      icon: 'file-medical',
      links: healthRecordsLinks,
    },
    {
      title: 'Payments',
      icon: 'dollar-sign',
      links: paymentsLinks,
    },
    {
      title: 'Medical supplies and equipment',
      icon: 'deaf',
      links: medicalSuppliesLinks,
    },
  ];
  const hubs = [
    {
      title: 'My VA health benefits',
      links: myVaHealthBenefitsLinks,
    },
    {
      title: 'More resources and support',
      links: moreResourcesLinks,
    },
    {
      title: 'In the spotlight',
      links: spotlightLinks,
    },
  ];

  return { cards, hubs };
};

export { resolveLandingPageLinks, resolveToggleLink };
