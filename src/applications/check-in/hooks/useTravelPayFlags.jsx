import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { format, formatISO } from 'date-fns';
import { makeSelectCurrentContext, makeSelectForm } from '../selectors';
import { makeSelectFeatureToggles } from '../utils/selectors/feature-toggles';

const useTravelPayFlags = appointment => {
  const [travelPayClaimSent, setTravelPayClaimSent] = useState();
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const context = useSelector(selectCurrentContext);
  const { isTravelLogicEnabled } = useSelector(selectFeatureToggles);
  const { token } = context;

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);

  // These will be undefined if the travel pay pages are skipped.
  const {
    'travel-question': travelQuestion,
    'travel-address': travelAddress,
    'travel-mileage': travelMileage,
    'travel-vehicle': travelVehicle,
  } = data;

  const startDate = isTravelLogicEnabled
    ? formatISO(new Date(appointment.startTime))
    : format(new Date(appointment.startTime), 'yyyy-LL-dd');

  let travelPayData = {
    uuid: token,
    appointmentDate: startDate,
  };

  if (travelQuestion !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelQuestion: travelQuestion === 'yes',
    };
  }
  if (travelAddress !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelAddress: travelAddress === 'yes',
    };
  }
  if (travelMileage !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelMileage: travelMileage === 'yes',
    };
  }
  if (travelVehicle !== undefined) {
    travelPayData = {
      ...travelPayData,
      travelVehicle: travelVehicle === 'yes',
    };
  }

  const travelPayEligible =
    travelPayData.travelAddress &&
    travelPayData.travelMileage &&
    travelPayData.travelVehicle;

  return {
    travelPayData,
    travelPayClaimSent,
    setTravelPayClaimSent,
    travelPayEligible,
  };
};

export { useTravelPayFlags };
