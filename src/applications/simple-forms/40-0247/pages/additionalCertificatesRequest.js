import React from 'react';

import {
  // titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns/addressPattern.jsx';

export default {
  uiSchema: {
    ...titleUI(
      'Where should we send your additional certificates?',
      <span className="custom-label h4">Additional address</span>,
    ),
    additionalAddress: addressNoMilitaryUI({
      // TODO: Customize street2 label if Designer confirms we should
      omit: ['isMilitary', 'street3'],
      required: true,
    }),
    additionalCopies: {
      // TODO: sync w/ Forgers on pattern refactors, then remove hack below
      'ui:title': (
        <>
          <span className="custom-label h4">
            How many certificates should we send to this address?
          </span>{' '}
          <span className="custom-required">(*Required)</span>
          <br />
          <span className="custom-hint">
            You may request up to 99 certificates
          </span>
        </>
      ),
      'ui:errorMessages': {
        required: 'Please provide the number of certificates you would like',
        minimum:
          'Please raise the number of certificates to at least 1, you can request up to 99',
        maximum:
          'Please lower the number of certificates, you can only request up to 99',
      },
      'ui:reviewField': ({ children }) => (
        <div className="review-row">
          <dt>
            <span className="vads-u-font-size--base">
              How many certificates should we send to your address?
            </span>
          </dt>
          <dd>{children}</dd>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      additionalAddress: addressNoMilitarySchema({
        omit: ['isMilitary', 'street3'],
      }),
      additionalCopies: {
        type: 'number',
        minimum: 1,
        maximum: 99,
      },
    },
    required: ['additionalAddress', 'additionalCopies'],
  },
};