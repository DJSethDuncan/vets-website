import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import saveInProgressData from './fixtures/mocks/saveInProgress.json';

import { WIZARD_STATUS } from '../../wizard/constants';

describe('Fetch Debts Successfully', () => {
  before(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'show_financial_status_report_wizard', value: true },
          { name: 'show_financial_status_report', value: true },
        ],
      },
    });

    cy.intercept('GET', '/v0/maintenance_windows', []);
    cy.login(mockUser);

    cy.intercept('GET', '/v0/debts*', {
      hasDependentDebts: false,
      debts: [
        {
          fileNumber: '796104437',
          payeeNumber: '00',
          personEntitled: 'AJHONS',
          deductionCode: '72',
          benefitType: 'CH33 Housing EDU',
          diaryCode: '608',
          diaryCodeDescription: 'Full C&P Benefit Offset Notifi',
          amountOverpaid: 0,
          amountWithheld: 94.34,
          originalAr: 321.76,
          currentAr: 227.42,
          debtHistory: [
            {
              date: '08/08/2018',
              letterCode: 608,
              description: 'Full C&P Benefit Offset Notifi',
            },
            {
              date: '07/19/2018',
              letterCode: 100,
              description:
                'First Demand Letter - Inactive Benefits - Due Process',
            },
          ],
        },
        {
          fileNumber: '796104437',
          payeeNumber: '00',
          personEntitled: 'AJOHNS',
          deductionCode: '71',
          benefitType: 'CH33 Books, Supplies/MISC EDU',
          diaryCode: '100',
          diaryCodeDescription:
            'First Demand Letter - Inactive Benefits - Due Process',
          amountOverpaid: 0,
          amountWithheld: 0,
          originalAr: 166.67,
          currentAr: 120.4,
          debtHistory: [
            {
              date: '10/18/2020',
              letterCode: '100',
              description:
                'First Demand Letter - Inactive Benefits - Due Process',
            },
          ],
        },
      ],
    });

    cy.intercept('GET', '/v0/in_progress_forms/5655', saveInProgressData);
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);

    cy.visit(manifest.rootUrl);
  });
  beforeEach(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Successful API Response', () => {
    // navigateToDebtSelection();

    cy.get('a.vads-c-action-link--green')
      .first()
      .click();

    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .click();

    cy.get('[data-testid="debt-selection-checkbox"]').should('have.length', 2);

    cy.injectAxeThenAxeCheck();
  });
});
