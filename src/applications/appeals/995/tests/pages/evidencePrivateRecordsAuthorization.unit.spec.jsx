import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

describe('Supplemental Claims Private evidence authorization page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.evidence.pages.evidencePrivateRecordsAuthorization;

  // Custom page is rendered, so this renders a submit button
  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($('input[type="checkbox"][required]', container)).to.exist;
    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should prevent continuing with checkbox unchecked', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.submit($('form', container));
    expect($('.usa-input-error', container)).to.exist;
    expect(onSubmit.called).to.be.false;
  });

  it('should allow submit with checkbox checked', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.click($('input[type="checkbox"]', container), mouseClick);
    fireEvent.submit($('form', container));
    expect($('.usa-input-error', container)).to.not.exist;
    expect(onSubmit.called).to.be.true;
  });
});