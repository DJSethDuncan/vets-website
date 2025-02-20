import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { logoutUrl } from 'platform/user/authentication/utilities';
import { logoutUrlSiS } from 'platform/utilities/oauth/utilities';
import { PersonalizationDropdown } from 'platform/site-wide/user-nav/components/PersonalizationDropdown';

describe('<PersonalizationDropdown>', () => {
  let oldWindow = null;

  beforeEach(() => {
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      dataLayer: [],
    });
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should render', () => {
    const wrapper = shallow(<PersonalizationDropdown />);
    expect(wrapper).to.exist;
    wrapper.unmount();
  });

  it('should report analytics when clicking My VA', () => {
    const wrapper = shallow(<PersonalizationDropdown />);
    wrapper
      .find('a')
      .at(0)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.equal('nav-user');
    expect(recordedEvent['nav-user-section']).to.equal('my-va');
    wrapper.unmount();
  });

  it('should report analytics when clicking My Health', () => {
    const middleware = [];
    const mockStore = configureStore(middleware);
    const initState = {
      featureToggles: {},
      user: {},
    };
    const store = mockStore(initState);
    const wrapper = mount(
      <Provider store={store}>
        <PersonalizationDropdown />
      </Provider>,
    );
    wrapper
      .find('a')
      .at(1)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.equal('nav-user');
    expect(recordedEvent['nav-user-section']).to.equal('my-health');
    wrapper.unmount();
  });

  it('should report analytics when clicking Profile', () => {
    const wrapper = shallow(<PersonalizationDropdown />);
    wrapper
      .find('a')
      .at(1)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.equal('nav-user');
    expect(recordedEvent['nav-user-section']).to.equal('profile');
    wrapper.unmount();
  });

  it('should use the logoutUrl if using SSOe', () => {
    const wrapper = shallow(<PersonalizationDropdown isSSOe />);
    const signoutLink = wrapper.find('a').at(2);
    const expectedUrl = logoutUrl();
    expect(signoutLink.prop('href')).to.equal(expectedUrl);
    wrapper.unmount();
  });

  it('should use the logoutUrlSiS if using OAuth', () => {
    const wrapper = shallow(<PersonalizationDropdown />);
    const signoutLink = wrapper.find('a').at(2);
    const expectedUrl = logoutUrlSiS();
    expect(signoutLink.prop('href')).to.equal(expectedUrl);
    wrapper.unmount();
  });
});
