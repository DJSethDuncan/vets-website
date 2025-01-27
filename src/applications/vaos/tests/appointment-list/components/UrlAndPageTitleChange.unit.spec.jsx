import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';
import { waitFor, within } from '@testing-library/dom';
import { mockFetch } from 'platform/testing/unit/helpers';
import userEvent from '@testing-library/user-event';
import { renderWithStoreAndRouter, getTestDate } from '../../mocks/setup';
import AppointmentsPageV2 from '../../../appointment-list/components/AppointmentsPageV2';
import {
  mockAppointmentInfo,
  mockPastAppointmentInfo,
} from '../../mocks/helpers';
import { createMockAppointmentByVersion } from '../../mocks/data';
import { mockVAOSAppointmentsFetch } from '../../mocks/helpers.v2';
import { getVAOSRequestMock } from '../../mocks/v2';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
    vaOnlineSchedulingRequests: true,
    vaOnlineSchedulingPast: true,
    vaOnlineSchedulingStatusImprovement: false,
    // eslint-disable-next-line camelcase
    show_new_schedule_view_appointments_page: true,
  },
};

describe('VAOS <AppointmentsPageV2>', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(getTestDate());
    mockAppointmentInfo({});
  });
  afterEach(() => {
    MockDate.reset();
  });

  const userState = {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  };

  describe('when scheduling breadcrumb url update flag is on', () => {
    const defaultState = {
      featureToggles: {
        ...initialState.featureToggles,
        vaOnlineSchedulingDirect: true,
        vaOnlineSchedulingCommunityCare: false,
        vaOnlineSchedulingStatusImprovement: true,
        vaOnlineSchedulingBreadcrumbUrlUpdate: true,
      },
      user: userState,
    };

    it('should display updated title on upcoming appointments page', async () => {
      // Given the veteran lands on the VAOS homepage
      mockPastAppointmentInfo({});

      // When the page displays
      const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
        initialState: defaultState,
      });

      // Then it should display the upcoming appointments
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: 'Appointments',
        }),
      );
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Appointments | Veterans Affairs`,
        );
      });

      // and breadcrumbs should be updated
      const navigation = screen.getByRole('navigation', {
        name: 'Breadcrumbs',
      });
      expect(navigation).to.be.ok;
      expect(within(navigation).queryByRole('link', { name: 'Pending' })).not.to
        .exist;
      expect(within(navigation).queryByRole('link', { name: 'Past' })).not.to
        .exist;

      // and scheduling button should be displayed
      expect(
        screen.getByRole('button', { name: 'Start scheduling an appointment' }),
      ).to.be.ok;

      // and appointment list navigation should be displayed
      expect(
        screen.getByRole('navigation', { name: 'Appointment list navigation' }),
      ).to.be.ok;
      expect(screen.getByRole('link', { name: 'Upcoming' })).to.be.ok;
      expect(screen.getByRole('link', { name: /Pending \(\d\)/ })).to.be.ok;
      expect(screen.getByRole('link', { name: 'Past' })).to.be.ok;

      // and status dropdown should not be displayed
      expect(screen.queryByLabelText('Show by status')).not.to.exists;
    });

    it('should display updated title appointment request page', async () => {
      // Given the veteran lands on the VAOS homepage
      const appointment = getVAOSRequestMock();
      appointment.id = '1';
      appointment.attributes = {
        id: '1',
        kind: 'clinic',
        locationId: '983',
        requestedPeriods: [{}],
        serviceType: 'primaryCare',
        status: 'proposed',
      };

      mockVAOSAppointmentsFetch({
        start: moment()
          .subtract(1, 'month')
          .format('YYYY-MM-DD'),
        end: moment()
          .add(395, 'days')
          .format('YYYY-MM-DD'),
        statuses: ['booked', 'arrived', 'fulfilled', 'cancelled'],
        requests: [appointment],
      });
      mockVAOSAppointmentsFetch({
        start: moment()
          .subtract(120, 'days')
          .format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD'),
        statuses: ['proposed', 'cancelled'],
        requests: [appointment],
      });

      // When the page displays
      const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
        initialState: defaultState,
      });

      // Then it should display upcoming appointments
      await screen.findByRole('heading', { name: 'Appointments' });

      // When the veteran clicks the Pending button
      const navigation = await screen.findByRole('link', {
        name: /^Pending \(1\)/,
      });
      userEvent.click(navigation);
      await waitFor(() => {
        expect(screen.history.push.lastCall.args[0].pathname).to.equal(
          '/pending',
        );
      });

      // Then it should display the requested appointments
      await waitFor(() => {
        expect(
          screen.findByRole('heading', {
            level: 1,
            name: 'Pending appointments',
          }),
        );
      });
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Pending appointments | Veterans Affairs`,
        );
      });

      expect(
        global.window.dataLayer.some(
          e => e === `vaos-status-pending-link-clicked`,
        ),
      );
    });

    it('should display updated past appointment page', async () => {
      // Given the veteran lands on the VAOS homepage
      const pastDate = moment().subtract(3, 'months');
      const data = {
        id: '1234',
        kind: 'clinic',
        clinic: 'fake',
        start: pastDate.format(),
        locationId: '983GC',
        status: 'booked',
      };
      const appointment = createMockAppointmentByVersion({
        version: 0,
        ...data,
      });
      mockPastAppointmentInfo({ va: [appointment] });

      // When the page displays
      const screen = renderWithStoreAndRouter(<AppointmentsPageV2 />, {
        initialState: defaultState,
      });

      // Then it should display the upcoming appointments
      await screen.findByRole('heading', { name: 'Appointments' });

      // When the veteran clicks the Past button
      const navigation = screen.getByRole('link', { name: 'Past' });
      userEvent.click(navigation);
      await waitFor(() =>
        expect(screen.history.push.lastCall.args[0].pathname).to.equal('/past'),
      );

      // Then it should display the past appointments
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: 'Past appointments',
        }),
      ).to.be.ok;
      await waitFor(() => {
        expect(global.document.title).to.equal(
          `Past appointments | Veterans Affairs`,
        );
      });

      expect(
        global.window.dataLayer.some(
          e => e === `vaos-status-past-link-clicked`,
        ),
      );
    });

    // WIP
    it('should display updated title on pending appointment detail page', async () => {
      return true;
    });

    // WIP
    it('should display updated title on past appointment detail page', async () => {
      return true;
    });
  });
});
