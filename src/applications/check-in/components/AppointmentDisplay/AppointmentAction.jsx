import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { parseISO } from 'date-fns';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { api } from '../../api';
import { makeSelectCurrentContext } from '../../selectors';

import { createAnalyticsSlug } from '../../utils/analytics';
import { useFormRouting } from '../../hooks/useFormRouting';
import { ELIGIBILITY, areEqual } from '../../utils/appointment/eligibility';

import { CheckInButton } from './CheckInButton';
import { useUpdateError } from '../../hooks/useUpdateError';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { getAppointmentId } from '../../utils/appointment';

const AppointmentAction = props => {
  const { appointment, router, event } = props;

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  const { setCheckinComplete } = useSessionStorage(false);

  const { updateError } = useUpdateError();

  const { jumpToPage } = useFormRouting(router);
  const onClick = useCallback(
    async () => {
      if (event) {
        recordEvent({
          event: createAnalyticsSlug(event, 'nav'),
        });
      }
      try {
        const json = await api.v2.postCheckInData({
          uuid: token,
          appointmentIen: appointment.appointmentIen,
          facilityId: appointment.facilityId,
        });
        const { status } = json;
        if (status === 200) {
          setCheckinComplete(window, true);
          jumpToPage(`complete/${getAppointmentId(appointment)}`);
        } else {
          updateError('check-in-post-error');
        }
      } catch (error) {
        updateError('error-completing-check-in');
      }
    },
    [appointment, updateError, jumpToPage, token, event, setCheckinComplete],
  );
  if (
    appointment.eligibility &&
    areEqual(appointment.eligibility, ELIGIBILITY.ELIGIBLE)
  ) {
    return (
      <CheckInButton
        checkInWindowEnd={parseISO(appointment.checkInWindowEnd)}
        appointmentTime={
          appointment.startTime ? parseISO(appointment.startTime) : null
        }
        onClick={onClick}
        router={router}
      />
    );
  }
  return <></>;
};

AppointmentAction.propTypes = {
  appointment: PropTypes.object,
  event: PropTypes.string,
  router: PropTypes.object,
};

export default AppointmentAction;
