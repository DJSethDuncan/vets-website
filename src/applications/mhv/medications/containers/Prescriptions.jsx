import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPrescriptionsList,
  setSortedRxList,
} from '../actions/prescriptions';
import { setBreadcrumbs } from '../actions/breadcrumbs';
import MedicationsList from '../components/MedicationsList/MedicationsList';
import MedicationsListSort from '../components/MedicationsList/MedicationsListSort';
import { dateFormat, generateMedicationsPDF } from '../util/helpers';
import PrintHeader from './PrintHeader';
import { rxListSortingOptions } from '../util/constants';
import PrintDownload from '../components/shared/PrintDownload';

const Prescriptions = () => {
  const currentDate = new Date();
  const prescriptions = useSelector(
    state => state.rx.prescriptions?.prescriptionsList,
  );
  const defaultSortOption = rxListSortingOptions[0].ACTIVE.value;
  const userName = useSelector(state => state.user.profile.userFullName);
  const dob = useSelector(state => state.user.profile.dob);

  const dispatch = useDispatch();
  const [pdfList, setPdfList] = useState([]);
  const [sortOption, setSortOption] = useState('');

  const sortRxList = useCallback(
    () => {
      if (sortOption) {
        const newList = [...prescriptions];
        newList.sort(a => {
          return a.refillStatus?.toLowerCase() === sortOption.toLowerCase()
            ? -1
            : 0;
        });
        dispatch(setSortedRxList(newList));
      }
    },
    [dispatch, prescriptions, sortOption],
  );

  const buildPrescriptionPDFList = useCallback(
    () => {
      return prescriptions?.map(rx => {
        return {
          header: rx.prescriptionName,
          items: [
            {
              title: 'Prescription number',
              value: rx.prescriptionNumber,
              inline: true,
            },
            {
              title: 'Status',
              value: rx.refillStatus,
              inline: true,
            },
            {
              title: 'Refills left',
              value: rx.refillRemaining,
              inline: true,
            },
            {
              title: 'Quantity',
              value: rx.quantity,
              inline: true,
            },
            {
              title: 'Prescribed on',
              value: 'not in vets api data',
              inline: true,
            },
            {
              title: 'Prescription expires on',
              value: dateFormat(rx.expirationDate, 'MMMM D, YYYY'),
              inline: true,
            },
            {
              title: 'Prescribed by',
              value: 'not in vets api data',
              inline: true,
            },
            {
              title: 'Facility',
              value: rx.facilityName,
              inline: true,
            },
            {
              title: 'Phone number',
              value: 'not in vets api data',
              inline: true,
            },
            {
              title: 'Category',
              value: 'not in vets api data',
              inline: true,
            },
            {
              title: 'Source',
              value: 'not in vets api data',
              inline: true,
            },
            {
              title: 'Image',
              value: 'not in vets api data',
              inline: true,
            },
          ],
        };
      });
    },
    [prescriptions],
  );

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [
            {
              url: '/my-health/medications/',
              label: 'About Medications',
            },
          ],
          {
            url: '/my-health/medications/prescriptions/',
            label: 'Medications',
          },
        ),
      );
    },
    [dispatch],
  );

  useEffect(
    () => {
      dispatch(getPrescriptionsList());
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (prescriptions) {
        setPdfList(buildPrescriptionPDFList());
      }
    },
    [buildPrescriptionPDFList, prescriptions],
  );

  const pdfData = {
    headerLeft: `${userName.last}, ${userName.first}`,
    headerRight: `Date of birth: ${dateFormat(dob, 'MMMM D, YYYY')}`,
    footerLeft: `Report generated by My HealtheVet and VA on ${dateFormat(
      currentDate,
      'MMMM D, YYYY',
    )}`,
    footerRight: 'Page %PAGE_NUMBER% of %TOTAL_PAGES%',
    title: 'Medications',
    preface:
      'This is a list of your current prescriptions, allergies, and adverse reactions.',
    results: {
      header: '',
      items: pdfList,
    },
  };

  const handleDownloadPDF = () => {
    generateMedicationsPDF('medicalRecords', 'rx_list', pdfData);
  };

  const content = () => {
    if (prescriptions) {
      return (
        <div className="landing-page">
          <PrintHeader />
          <h1 className="page-title" data-testId="List-Page-Title">
            Medications
          </h1>
          <div
            className="vads-u-margin-bottom--2 no-print"
            datat-testId="Title-Notes"
          >
            Review your prescription medications from VA, and providers outside
            of our network.
          </div>
          <div className="landing-page-content">
            <div className="no-print">
              <PrintDownload download={handleDownloadPDF} list />
              <va-additional-info trigger="What to know about downloading records">
                <ul>
                  <li>
                    <strong>If you’re on a public or shared computer,</strong>{' '}
                    print your records instead of downloading. Downloading will
                    save a copy of your records to the public computer.
                  </li>
                  <li>
                    <strong>If you use assistive technology,</strong> a Text
                    file (.txt) may work better for technology such as screen
                    reader, screen enlargers, or Braille displays.
                  </li>
                </ul>
              </va-additional-info>
              <MedicationsListSort
                setSortOption={setSortOption}
                sortOption={sortOption}
                defaultSortOption={defaultSortOption}
                sortRxList={sortRxList}
              />
              <div className="rx-page-total-info vads-u-border-color--gray-lighter" />
            </div>
            {prescriptions ? (
              <MedicationsList rxList={prescriptions} />
            ) : (
              <va-loading-indicator
                message="Loading..."
                setFocus
                data-testid="loading-indicator"
              />
            )}
          </div>
        </div>
      );
    }
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  };

  return <div className="vads-u-margin-top--3">{content()}</div>;
};

export default Prescriptions;
