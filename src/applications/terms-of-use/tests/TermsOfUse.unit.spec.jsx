import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import TermsOfUse, {
  parseRedirectUrl,
  errorMessages,
} from '../containers/TermsOfUse';

const store = ({ termsOfUseEnabled = true } = {}) => ({
  getState: () => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      terms_of_use: termsOfUseEnabled,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('TermsOfUse', () => {
  const server = setupServer();

  before(() => server.listen());
  afterEach(() => server.resetHandlers());
  after(() => server.close());

  it('should render', () => {
    const mockStore = store();
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );
    expect($('h1', container).textContent).to.eql(
      'VA online services terms of use',
    );
    expect($('va-on-this-page', container)).to.exist;
    expect($('va-accordion', container)).to.exist;
    expect($('va-alert', container)).to.exist;
  });
  it('should display buttons by default', async () => {
    const mockStore = store();
    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        (_, res, ctx) => res(ctx.status(200)),
      ),
    );
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      expect($$('va-button', container).length).to.eql(2);
    });
  });
  it('should NOT display buttons if URL comes back as a 401', async () => {
    const mockStore = store();
    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        (_, res, ctx) => {
          return res(ctx.status(401), ctx.json({ errors: [{ code: '401' }] }));
        },
      ),
    );
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      expect($$('va-button', container).length).to.eql(0);
    });
  });
  it('should NOT display buttons if title is `Not authorized`', async () => {
    const mockStore = store();
    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        (_, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({ errors: [{ code: '500', title: 'Not authorized' }] }),
          );
        },
      ),
    );
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      expect($$('va-button', container).length).to.eql(0);
    });
  });
  it('should NOT display Accept or Decline buttons termsOfUse Flipper is disabled', () => {
    const mockStore = store({ termsOfUseEnabled: false });
    const { container } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    expect($$('va-button', container).length).to.eql(0);
  });
  it('should display the declined modal if the decline button is clicked', async () => {
    const mockStore = store();
    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        (_, res, ctx) => res(ctx.status(200)),
      ),
    );
    const { container, queryByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      const declineButton = queryByTestId('decline');

      fireEvent.click(declineButton);

      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;
      expect(modal).to.have.attribute('visible', 'true');
    });
  });
  it('should call `/decline` when `Decline and sign out button` is clicked', async () => {
    const redirectUrl = `https://dev.va.gov/auth/login/callback/?type=idme`;
    const termsCode = `555abc`;
    global.window.location = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}&terms_code=${termsCode}`;

    const mockStore = store();
    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        (_, res, ctx) => res(ctx.status(200)),
      ),
      rest.post(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/decline`,
        (req, res, ctx) => {
          expect(req.url.searchParams.get('terms_code')).to.eql(termsCode);
          return res(
            ctx.status(200),
            ctx.json({ termsOfUseAgreement: { 'some-key': 'some-value' } }),
          );
        },
      ),
    );
    const { container, queryByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      const declineButton = queryByTestId('decline');

      fireEvent.click(declineButton);

      const modal = $('va-modal', container);
      expect(modal).to.exist;
      expect(modal).to.have.attribute('visible', 'true');

      // click the Decline and sign out button
      modal.__events.primaryButtonClick();
    });
  });
  it('should redirect to the `redirect_url`', async () => {
    const redirectUrl = `https://dev.va.gov/auth/login/callback/?type=idme`;
    global.window.location = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}`;

    const mockStore = store();
    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        (_, res, ctx) => res(ctx.status(200)),
      ),
      rest.post(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/accept`,
        (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({ termsOfUseAgreement: { 'some-key': 'some-value' } }),
          ),
      ),
    );
    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      const acceptButton = queryByTestId('accept');
      expect(acceptButton).to.exist;

      fireEvent.click(acceptButton);
      expect(global.window.location).to.eql(redirectUrl);
    });
  });
  it('should pass along `terms_code` to API', async () => {
    const redirectUrl = `https://dev.va.gov/auth/login/callback/?type=logingov`;
    const termsCode = '123456abc';
    global.window.location = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}&terms_code=${termsCode}`;

    const mockStore = store();
    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        (_, res, ctx) => res(ctx.status(200)),
      ),
      rest.post(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/accept`,
        (req, res, ctx) => {
          expect(req.url.searchParams.get('terms_code')).to.eql(termsCode);
          return res(
            ctx.status(200),
            ctx.json({ termsOfUseAgreement: { 'some-key': 'some-value' } }),
          );
        },
      ),
    );
    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      const acceptButton = queryByTestId('accept');
      expect(acceptButton).to.exist;
      fireEvent.click(acceptButton);
      expect(global.window.location).to.not.eql(redirectUrl);
    });
  });
  it('should show an error state if there is a network error | non-modal', async () => {
    const redirectUrl = `https://dev.va.gov/auth/login/callback/?type=idme`;
    global.window.location = `https://dev.va.gov/terms-of-use/?redirect_url=${redirectUrl}`;

    const mockStore = store();
    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        (_, res, ctx) => res(ctx.status(200)),
      ),
      rest.post(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/accept`,
        (_, res) => res.networkError(),
      ),
    );
    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      const acceptButton = queryByTestId('accept');
      expect(acceptButton).to.exist;

      fireEvent.click(acceptButton);

      const nonModalErrorState = queryByTestId('error-non-modal');
      expect(nonModalErrorState).to.exist;
      expect(nonModalErrorState.textContent).to.eql(errorMessages.network);
    });
  });
  it('should close the Decline modal when Close or Go Back buttons are clicked', async () => {
    const mockStore = store();
    server.use(
      rest.get(
        `https://dev-api.va.gov/v0/terms_of_use_agreements/v1/latest`,
        (_, res, ctx) => res(ctx.status(200)),
      ),
    );
    const { container, queryByTestId } = render(
      <Provider store={mockStore}>
        <TermsOfUse />
      </Provider>,
    );

    await waitFor(() => {
      const declineButton = queryByTestId('decline');
      expect(declineButton).to.exist;

      fireEvent.click(declineButton);

      // click close button on modal
      const openedModal = $('va-modal[visible="true"]', container);
      openedModal.__events.closeEvent();
      expect($('va-modal[visible="false"]', container)).to.be.exist;

      // open the modal again
      fireEvent.click(declineButton);
      expect(openedModal).to.exist;
      // click `Go back` button
      openedModal.__events.secondaryButtonClick();
      expect($('va-modal[visible="false"]', container)).to.be.exist;
    });
  });
});

describe('parseRedirectUrl', () => {
  const testUrls = {
    [`https%3A%2F%2Fdev.va.gov%2Fauth%2Flogin%2Fcallback%2F%3Ftype%3Didme`]: `https://dev.va.gov/auth/login/callback/?type=idme`,
    [`https://staging-patientportal.myhealth.va.gov`]: `https://staging-patientportal.myhealth.va.gov`,
    [`https://staging-patientportal.myhealth.va.gov/?authenticated=true`]: `https://staging-patientportal.myhealth.va.gov/?authenticated=true`,
    [`https://int.eauth.va.gov/mhv-portal-web/eauth&postLogin=true`]: `https://int.eauth.va.gov/mhv-portal-web/eauth`,
    [`https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=home&postLogin=true`]: `https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=home&postLogin=true`,
    [`https://google.com?q=https://va.gov`]: `https://dev.va.gov`,
  };
  Object.entries(testUrls).forEach(([parsedUrl, formattedUrl]) => {
    it('should return the proper url', () => {
      expect(parseRedirectUrl(parsedUrl)).to.eql(formattedUrl);
    });
  });
});