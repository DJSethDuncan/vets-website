import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import moment from '../../../lib/moment-tz';
import { startAppointmentCancel } from '../../redux/actions';
import { selectFeatureCancel } from '../../../redux/selectors';
import { APPOINTMENT_STATUS, GA_PREFIX } from '../../../utils/constants';

function formatAppointmentDate(date) {
  if (!date.isValid()) {
    return null;
  }

  return date.format('MMMM D, YYYY');
}

export default function CancelLink({ appointment }) {
  const dispatch = useDispatch();
  const showCancelButton = useSelector(selectFeatureCancel);
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const { isPastAppointment } = appointment.vaos;
  const hideCanceledOrPast = canceled || !showCancelButton || isPastAppointment;

  if (hideCanceledOrPast) {
    return null;
  }

  return (
    <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
      <i
        aria-hidden="true"
        className="fas fa-times vads-u-margin-right--1 vads-u-font-size--lg vads-u-color--link-default"
      />
      <button
        onClick={() => {
          recordEvent({
            event: 'interaction',
            action: `${GA_PREFIX}-cancel-booked-clicked`,
          });
          dispatch(startAppointmentCancel(appointment));
        }}
        aria-label={`Cancel appointment on ${formatAppointmentDate(
          moment.parseZone(appointment.start),
        )}`}
        className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
        type="button"
      >
        Cancel appointment
        <span className="sr-only">
          {' '}
          on {formatAppointmentDate(moment.parseZone(appointment.start))}
        </span>
      </button>
    </div>
  );
}

CancelLink.propTypes = {
  appointment: PropTypes.object.isRequired,
};
