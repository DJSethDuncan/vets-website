import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import manifest from 'applications/mhv/landing-page/manifest.json';

import ApiInitializer from 'applications/mhv/landing-page/tests/utilities/ApiInitializer';
import LandingPage from 'applications/mhv/landing-page/tests/pages/LandingPage';

describe(manifest.appName, () => {
  it('shows the new link when enabled', () => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    ApiInitializer.initializeUserData.withDefaultUser();
    LandingPage.visitPage({ serviceProvider: CSP_IDS.ID_ME });
    cy.injectAxeThenAxeCheck();
    cy.viewportPreset('va-top-mobile-1');
    cy.get('.my-health-link').should('have.attr', 'href', '/my-health/');
  });
  it('shows the old link when disabled', () => {
    ApiInitializer.initializeFeatureToggle.withAppDisabled();
    ApiInitializer.initializeUserData.withDefaultUser();
    cy.login();
    cy.visit('/');
    cy.injectAxeThenAxeCheck();
    cy.viewportPreset('va-top-mobile-1');
    cy.get('.my-health-link')
      .should('have.attr', 'href')
      .and('include', 'mhv-portal');
  });
});