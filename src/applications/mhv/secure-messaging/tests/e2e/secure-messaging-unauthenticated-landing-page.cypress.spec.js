import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe.skip('Secure Messaging Compose', () => {
  it.skip('can send message', () => {
    const site = new SecureMessagingSite();
    const patientInboxPage = new PatientInboxPage();
    site.login(false);
    site.loadPageUnauthenticated();

    cy.url().should('contain', '/health-care/secure-messaging');

    site.login();

    patientInboxPage.loadInboxMessages();
    cy.get('[data-testid="inbox-sidebar"] > a').click();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
