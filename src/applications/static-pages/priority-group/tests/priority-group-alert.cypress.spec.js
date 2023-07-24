import { getAppUrl } from '@department-of-veterans-affairs/platform-utilities';

const createRootElement = () => {
  const el = document.createElement('div');
  el.setAttribute('data-widget-type', 'priority-group-alert');
  return el;
};

const enableFeature = (enabled = true) => {
  const priorityGroupAlertFeature = {
    name: 'show_priority_group_alert_widget',
    value: enabled,
  };
  const data = {
    type: 'feature_toggles',
    features: [priorityGroupAlertFeature],
  };
  cy.intercept('GET', '/v0/feature_toggles?*', { data });
};

const setEnrollmentStatus = (data = false) => {
  const defaultEnrollmentStatus = {
    effectiveDate: '2019-01-02T21:58:55.000-06:00',
    priorityGroup: 'Group 8G',
  };
  const body = data || defaultEnrollmentStatus;
  cy.intercept('GET', '/v0/health_care_applications/enrollment_status', body);
};

describe('Priority Group Alert Widget', () => {
  it('renders <PactAct /> when feature is disabled', () => {
    enableFeature({ enabled: false });
    cy.visit('/health-care/eligibility/priority-groups');
    // cy.document().then(doc => doc.body.appendChild(createRootElement()));
    cy.findByText(/The PACT Act expands benefits for Veterans/);
    cy.axeCheck();
  });

  xit('renders <SignInPrompt /> when signed out', () => {
    enableFeature();
    cy.visit(getAppUrl('/'));
    createRootElement();
    cy.findByText('You might already have an assigned priority group');
    cy.axeCheck();
  });

  xit('renders <UnknownGroup /> when priorityGroup is not set', () => {
    enableFeature();
    setEnrollmentStatus({});
    createRootElement();
    cy.visit(getAppUrl('/'));
    cy.findByText('You have not yet been assigned to a priority group');
    cy.axeCheck();
  });

  xit('renders <ApiError /> when the API is unavailable', () => {
    enableFeature();
    const res = { statusCode: 500 };
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status', res);
    createRootElement();
    cy.visit(getAppUrl('/'));
    cy.findByText("We can't access your priority group information");
    cy.axeCheck();
  });
});
