import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import PrimaryPhoneReview from '../../components/PrimaryPhoneReview';
import { PRIMARY_PHONE } from '../../constants';
import { content } from '../../content/primaryPhone';

import maximalData from '../fixtures/data/maximal-test.json';

import { $ } from '../../utils/ui';

describe('<PrimaryPhoneReview>', () => {
  const setup = ({
    data = maximalData.data,
    primary = 'home',
    editPage = () => {},
  } = {}) => (
    <div>
      <PrimaryPhoneReview
        data={{ ...data, [PRIMARY_PHONE]: primary }}
        editPage={editPage}
      />
    </div>
  );

  it('should render home phone as primary', () => {
    const { container } = render(setup());
    expect($('dt', container).textContent).to.eq(content.homeLabel);
    expect($('dd', container).textContent).to.contain('(555) 800-1111');
  });
  it('should render mobile phone as primary', () => {
    const { container } = render(setup({ primary: 'mobile' }));
    expect($('dt', container).textContent).to.eq(content.mobileLabel);
    expect($('dd', container).textContent).to.contain('(555) 800-2222');
  });

  it('should switch to edit mode', () => {
    const editPageSpy = sinon.spy();
    const { container } = render(setup({ editPage: editPageSpy }));

    fireEvent.click($('.edit-page', container));
    expect(editPageSpy.called).to.be.true;
  });
});