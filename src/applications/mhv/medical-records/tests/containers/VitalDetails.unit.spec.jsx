import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import VitalDetails from '../../containers/VitalDetails';
import reducer from '../../reducers';

describe('Vital details container', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalsList: [
          {
            name: 'Blood Pressure',
            id: '155',
            measurement: '120/80 mm[Hg]',
            date: '2022-06-14T17:42:46.000Z',
            facility: 'school parking lot',
          },
        ],
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<VitalDetails />, {
      initialState: state,
      reducers: reducer,
      path: '/vital-details/Blood+Pressure',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays CONFIDENTIAL header for print view', () => {
    const screen = setup();
    const printHeading = screen.getByRole('heading', {
      name: 'CONFIDENTIAL',
      level: 4,
    });
    expect(printHeading).to.exist;
  });

  it('displays a print button', () => {
    const screen = setup();
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the vital name as an h1', () => {
    const screen = setup();

    const vitalName = screen.getByText(
      initialState.mr.vitals.vitalsList[0].name,
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(vitalName).to.exist;
  });

  it('displays the formatted received date', () => {
    const screen = setup();
    const formattedDate = screen.getByText('June 14, 2022', {
      exact: true,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('displays the location', () => {
    const screen = setup();
    const location = screen.getByText(
      initialState.mr.vitals.vitalsList[0].facility,
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(location).to.exist;
  });
});