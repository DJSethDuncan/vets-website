import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockDraftFolderMetaResponse from './fixtures/folder-drafts-metadata.json';
import mockDeletedFolderMetaResponse from './fixtures/folder-deleted-metadata.json';
import mockSentFolderMetaResponse from './fixtures/folder-sent-metadata.json';
import PatientComposePage from './pages/PatientComposePage';

describe('Secure Messaging Navigate Away From Compose Message', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const composePage = new PatientComposePage();
  it('Navigate Away From Compose To Inbox', () => {
    site.login();
    landingPage.loadPage();
    landingPage.loadPage(false);
    landingPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    composePage.enterComposeMessageDetails('General');
    composePage.selectSideBarMenuOption('Inbox');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComosePageValuesRetainedAfterContinueEditing();

    composePage.selectSideBarMenuOption('Inbox');
    composePage.clickOnDeleteDraftButton();
    composePage.verifyExpectedPageOpened('Messages');
    cy.get('[data-testid="compose-message-link"]').should('be.visible');
  });

  it('Navigate Away From Compose To Draft', () => {
    site.login();
    landingPage.loadPage();
    landingPage.loadPage(false);
    landingPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    composePage.enterComposeMessageDetails('General');
    composePage.selectSideBarMenuOption('Drafts');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComosePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    composePage.selectSideBarMenuOption('Drafts');
    composePage.clickOnDeleteDraftButton();
    composePage.verifyExpectedPageOpened('Drafts');
  });

  it('Navigate Away From Compose To Sent', () => {
    site.login();
    landingPage.loadPage();
    landingPage.loadPage(false);
    landingPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    composePage.enterComposeMessageDetails('General');
    composePage.selectSideBarMenuOption('Sent');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComosePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1',
      mockSentFolderMetaResponse,
    ).as('sentResponse');
    composePage.selectSideBarMenuOption('Sent');
    composePage.clickOnDeleteDraftButton();
    composePage.verifyExpectedPageOpened('Sent messages');
  });

  it('Navigate Away From Compose To Trash', () => {
    site.login();
    landingPage.loadPage();
    landingPage.loadPage(false);
    landingPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    composePage.enterComposeMessageDetails('General');
    composePage.selectSideBarMenuOption('Trash');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComosePageValuesRetainedAfterContinueEditing();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3',
      mockDeletedFolderMetaResponse,
    ).as('trashResponse');
    composePage.selectSideBarMenuOption('Trash');
    composePage.clickOnDeleteDraftButton();
    composePage.verifyExpectedPageOpened('Trash');
  });

  it('Navigate Away From Compose To MY Folders', () => {
    site.login();
    landingPage.loadPage();
    landingPage.loadPage(false);
    landingPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    composePage.enterComposeMessageDetails('General');
    composePage.selectSideBarMenuOption('My folders');
    composePage.clickOnContinueEditingButton();
    composePage.verifyComosePageValuesRetainedAfterContinueEditing();

    composePage.selectSideBarMenuOption('My folders');
    composePage.clickOnDeleteDraftButton();
    composePage.verifyExpectedPageOpened('My folders');
  });
});