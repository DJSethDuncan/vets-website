import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';

describe('Secure Messaging Save Draft', () => {
  it('Axe Check Save Draft', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const draftsPage = new PatientMessageDraftsPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse);
    patientInterstitialPage.getContinueButton().should('not.exist');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'color-contrast': {
          enabled: false,
        },
      },
    });
    // composePage.getMessageSubjectField().type('message Test');
    composePage.getMessageBodyField().type('Test message body');
    cy.realPress(['Enter']);

    const mockDraftResponseUpdated = {
      ...mockDraftResponse,
      data: {
        ...mockDraftResponse.data,
        attributes: {
          ...mockDraftResponse.data.attributes,
          body: 'ststASertTest message body\n',
        },
      },
    };
    composePage.saveDraft(mockDraftResponseUpdated);
    composePage.sendDraft(mockDraftResponseUpdated);
  });
});
