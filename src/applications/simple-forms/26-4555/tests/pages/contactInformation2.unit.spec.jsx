import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.contactInformationChapter.pages.contactInformation2;

describe('contact information page 2', () => {
  it('should have appropriate number of fields', () => {
    const { container } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(container.querySelectorAll('input, select')).to.have.lengthOf(3);
  });

  it('should show the correct number of errors on submit', () => {
    const { getByRole, queryAllByRole } = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    getByRole('button', { name: /submit/i }).click();
    const errors = queryAllByRole('alert');
    expect(errors).to.have.lengthOf(1);
  });
});
