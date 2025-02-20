import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';
import AddressValidationView from '../../containers/AddressValidationView';

describe('<AddressValidationView/>', () => {
  const fakeStore = {
    getState: () => ({
      vapService: {
        fieldTransactionMap: {
          mailingAddress: {
            isPending: false,
          },
        },
        modal: 'addressValidation',
        modalData: null,
        addressValidation: {
          addressFromUser: {
            addressLine1: '12345 1st Ave',
            addressLine2: 'bldg 2',
            addressLine3: 'apt 23',
            city: 'Tampa',
            stateCode: 'FL',
            zipCode: '12346',
          },
          isAddressValidationModalVisible: true,
          addressValidationError: '',
          addressValidationType: 'mailingAddress',
          userEnteredAddress: {},
          validationKey: 1234,
          confirmedSuggestions: [],
          suggestedAddresses: [
            {
              addressLine1: '12345 1st Ave',
              addressLine2: 'bldg 2',
              addressLine3: 'apt 23',
              city: 'Tampa',
              stateCode: 'FL',
              zipCode: '12346',
              addressMetaData: {
                confidenceScore: 100.0,
                addressType: 'Domestic',
                deliveryPointValidation: 'CONFIRMED',
                residentialDeliveryIndicator: 'MIXED',
              },
            },
            {
              addressLine1: '22222 1st Ave',
              addressLine2: 'bldg 2',
              addressLine3: 'apt 23',
              city: 'Saint Petersburg',
              stateCode: 'FL',
              zipCode: '55555',
              addressMetaData: {
                confidenceScore: 100.0,
                addressType: 'Domestic',
                deliveryPointValidation: 'CONFIRMED',
                residentialDeliveryIndicator: 'MIXED',
              },
            },
          ],
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('validate render', () => {
    const component = enzyme.mount(<AddressValidationView store={fakeStore} />);
    expect(component.exists('AddressValidationView')).to.equal(true);
    component.unmount();
  });

  it('renders alert box', () => {
    const component = enzyme.mount(<AddressValidationView store={fakeStore} />);

    expect(component.exists('VaAlert')).to.equal(true);
    component.unmount();
  });

  it('renders correct buttons', () => {
    const component = enzyme.mount(<AddressValidationView store={fakeStore} />);

    expect(component.find('LoadingButton').text()).to.equal('Use this address');
    expect(component.find('.usa-button-secondary').text()).to.equal(
      'Go back to edit',
    );
    component.unmount();
  });

  it('renders correct buttons', () => {
    const newFakeStore = {
      getState: () => ({
        vapService: {
          fieldTransactionMap: {
            mailingAddress: {
              isPending: false,
            },
          },
          modal: 'addressValidation',
          addressValidation: {
            addressFromUser: {
              addressLine1: '12345 1st Ave',
              addressLine2: 'bldg 2',
              addressLine3: 'apt 23',
              city: 'Tampa',
              stateCode: 'FL',
              zipCode: '12346',
            },
            isAddressValidationModalVisible: true,
            addressValidationError: true,
            suggestedAddresses: [],
            confirmedSuggestions: [],
            addressValidationType: 'mailingAddress',
            userEnteredAddress: {},
            validationKey: null,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const component = enzyme.mount(
      <AddressValidationView store={newFakeStore} />,
    );

    expect(component.find('.usa-button-primary').text()).to.equal(
      'Edit Address',
    );
    expect(component.find('.usa-button-secondary').text()).to.equal(
      'Go back to edit',
    );
    component.unmount();
  });

  it('does not render cancel button while pending transaction', () => {
    const newFakeStore = {
      getState: () => ({
        vapService: {
          fieldTransactionMap: {
            mailingAddress: {
              isPending: true,
            },
          },
          modal: 'addressValidation',
          addressValidation: {
            addressFromUser: {
              addressLine1: '12345 1st Ave',
              addressLine2: 'bldg 2',
              addressLine3: 'apt 23',
              city: 'Tampa',
              stateCode: 'FL',
              zipCode: '12346',
            },
            isAddressValidationModalVisible: true,
            addressValidationError: true,
            suggestedAddresses: [],
            confirmedSuggestions: [],
            addressValidationType: 'mailingAddress',
            userEnteredAddress: {},
            validationKey: null,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const component = enzyme.mount(
      <AddressValidationView store={newFakeStore} />,
    );

    expect(component.text()).to.not.include('Go back to edit');
    component.unmount();
  });

  it('renders multiple suggestion button text', () => {
    const newFakeStore = {
      getState: () => ({
        vapService: {
          fieldTransactionMap: {
            mailingAddress: {
              isPending: false,
            },
          },
          modal: 'addressValidation',
          addressValidation: {
            addressFromUser: {
              addressLine1: '12345 1st Ave',
              addressLine2: 'bldg 2',
              addressLine3: 'apt 23',
              city: 'Tampa',
              stateCode: 'FL',
              zipCode: '12346',
            },
            isAddressValidationModalVisible: true,
            addressValidationError: false,
            suggestedAddresses: [
              {
                addressLine1: '12345 1st Ave',
                addressLine2: 'bldg 2',
                addressLine3: 'apt 23',
                city: 'Tampa',
                stateCode: 'FL',
                zipCode: '12346',
                addressMetaData: {
                  confidenceScore: 100.0,
                  addressType: 'Domestic',
                  deliveryPointValidation: 'CONFIRMED',
                  residentialDeliveryIndicator: 'MIXED',
                },
              },
              {
                addressLine1: '22222 1st Ave',
                addressLine2: 'bldg 2',
                addressLine3: 'apt 23',
                city: 'Saint Petersburg',
                stateCode: 'FL',
                zipCode: '55555',
                addressMetaData: {
                  confidenceScore: 100.0,
                  addressType: 'Domestic',
                  deliveryPointValidation: 'CONFIRMED',
                  residentialDeliveryIndicator: 'MIXED',
                },
              },
            ],
            confirmedSuggestions: [
              {
                addressLine1: '12345 1st Ave',
                addressLine2: 'bldg 2',
                addressLine3: 'apt 23',
                city: 'Tampa',
                stateCode: 'FL',
                zipCode: '12346',
                addressMetaData: {
                  confidenceScore: 100.0,
                  addressType: 'Domestic',
                  deliveryPointValidation: 'CONFIRMED',
                  residentialDeliveryIndicator: 'MIXED',
                },
              },
              {
                addressLine1: '22222 1st Ave',
                addressLine2: 'bldg 2',
                addressLine3: 'apt 23',
                city: 'Saint Petersburg',
                stateCode: 'FL',
                zipCode: '55555',
                addressMetaData: {
                  confidenceScore: 100.0,
                  addressType: 'Domestic',
                  deliveryPointValidation: 'CONFIRMED',
                  residentialDeliveryIndicator: 'MIXED',
                },
              },
            ],
            addressValidationType: 'mailingAddress',
            userEnteredAddress: {},
            validationKey: 12345,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const component = enzyme.mount(
      <AddressValidationView store={newFakeStore} />,
    );

    expect(component.find('LoadingButton').text()).to.equal('Update');
    expect(component.find('.usa-button-secondary').text()).to.equal(
      'Go back to edit',
    );
    component.unmount();
  });

  it('renders use suggested button text', () => {
    const newFakeStore = {
      getState: () => ({
        vapService: {
          fieldTransactionMap: {
            mailingAddress: {
              isPending: false,
            },
          },
          modal: 'addressValidation',
          addressValidation: {
            addressFromUser: {
              addressLine1: '12345 1st Ave',
              addressLine2: 'bldg 2',
              addressLine3: 'apt 23',
              city: 'Tampa',
              stateCode: 'FL',
              zipCode: '12346',
            },
            isAddressValidationModalVisible: true,
            addressValidationError: false,
            suggestedAddresses: [
              {
                addressLine1: '12345 1st Ave',
                addressLine2: 'bldg 2',
                addressLine3: 'apt 23',
                city: 'Tampa',
                stateCode: 'FL',
                zipCode: '12346',
                addressMetaData: {
                  confidenceScore: 100.0,
                  addressType: 'Domestic',
                  deliveryPointValidation: 'CONFIRMED',
                  residentialDeliveryIndicator: 'MIXED',
                },
              },
              {
                addressLine1: '22222 1st Ave',
                addressLine2: 'bldg 2',
                addressLine3: 'apt 23',
                city: 'Saint Petersburg',
                stateCode: 'FL',
                zipCode: '55555',
                addressMetaData: {
                  confidenceScore: 100.0,
                  addressType: 'Domestic',
                  deliveryPointValidation: 'CONFIRMED',
                  residentialDeliveryIndicator: 'MIXED',
                },
              },
            ],
            confirmedSuggestions: [
              {
                addressLine1: '12345 1st Ave',
                addressLine2: 'bldg 2',
                addressLine3: 'apt 23',
                city: 'Tampa',
                stateCode: 'FL',
                zipCode: '12346',
                addressMetaData: {
                  confidenceScore: 100.0,
                  addressType: 'Domestic',
                  deliveryPointValidation: 'CONFIRMED',
                  residentialDeliveryIndicator: 'MIXED',
                },
              },
            ],
            addressValidationType: 'mailingAddress',
            userEnteredAddress: {},
            validationKey: null,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    const component = enzyme.mount(
      <AddressValidationView store={newFakeStore} />,
    );

    expect(component.find('LoadingButton').text()).to.equal(
      'Use suggested address',
    );
    expect(component.find('.usa-button-secondary').text()).to.equal(
      'Go back to edit',
    );
    component.unmount();
  });

  it('validates inputs', () => {
    const newFakeStore = {
      getState: () => ({
        vapService: {
          fieldTransactionMap: {
            mailingAddress: {
              isPending: false,
            },
          },
          modal: 'addressValidation',
          addressValidation: {
            addressFromUser: {
              addressLine1: '12345 1st Ave',
              addressLine2: 'bldg 2',
              addressLine3: 'apt 23',
              city: 'Tampa',
              stateCode: 'FL',
              zipCode: '12346',
            },
            isAddressValidationModalVisible: true,
            addressValidationError: true,
            suggestedAddresses: [],
            confirmedSuggestions: [
              {
                addressLine1: '12345 1st Ave',
                addressLine2: 'bldg 2',
                addressLine3: 'apt 23',
                addressType: 'DOMESTIC',
                city: 'Tampa',
                stateCode: 'FL',
                zipCode: '12346',
                addressMetaData: {
                  confidenceScore: 100.0,
                  addressType: 'Domestic',
                  deliveryPointValidation: 'CONFIRMED',
                  residentialDeliveryIndicator: 'MIXED',
                },
              },
              {
                addressLine1: '22222 1st Ave',
                addressLine2: 'bldg 2',
                addressLine3: 'apt 23',
                addressType: 'DOMESTIC',
                city: 'Saint Petersburg',
                stateCode: 'FL',
                zipCode: '55555',
                addressMetaData: {
                  confidenceScore: 100.0,
                  addressType: 'Domestic',
                  deliveryPointValidation: 'CONFIRMED',
                  residentialDeliveryIndicator: 'MIXED',
                },
              },
            ],
            addressValidationType: 'mailingAddress',
            userEnteredAddress: {},
            validationKey: null,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const component = enzyme.mount(
      <AddressValidationView store={newFakeStore} />,
    );

    expect(
      component
        .find('label')
        .at(1)
        .text(),
    ).to.equal('12345 1st Ave, bldg 2, apt 23Tampa, FL 12346');

    expect(
      component
        .find('label')
        .at(2)
        .text(),
    ).to.equal('22222 1st Ave, bldg 2, apt 23Saint Petersburg, FL 55555');
    component.unmount();
  });

  it('validates heading', () => {
    const component = enzyme.mount(<AddressValidationView store={fakeStore} />);

    expect(
      component
        .find('h4')
        .at(0)
        .text(),
    ).to.equal(
      `We can’t confirm the address you entered with the U.S. Postal Service.`,
    );
    component.unmount();
  });
});
