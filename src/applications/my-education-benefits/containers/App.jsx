import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setData } from 'platform/forms-system/src/js/actions';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';

import formConfig from '../config/form';
import {
  fetchPersonalInformation,
  fetchEligibility,
  fetchDuplicateContactInfo,
  // fetchDirectDeposit, Commenting out until we update the component to handle astrisks see TOE app
} from '../actions';
import { formFields } from '../constants';
import { prefillTransformer } from '../helpers';
import { getAppData } from '../selectors/selectors';
import { duplicateArrays } from '../utils/validation';

export const App = ({
  children,
  claimantInfo,
  eligibility,
  featureTogglesLoaded,
  firstName,
  formData,
  // Commenting out until we update the component to handle astrisks
  // getDirectDeposit,
  getEligibility,
  getPersonalInfo,
  getDuplicateContactInfo,
  isLOA3,
  isLoggedIn,
  location,
  setFormData,
  showMebDgi40Features,
  showMebDgi42Features,
  showMebCh33SelfForm,
  showMebEnhancements,
  showMebEnhancements06,
  showMebEnhancements08,
  showMebEnhancements09,
  email,
  duplicateEmail,
  duplicatePhone,
}) => {
  const [fetchedPersonalInfo, setFetchedPersonalInfo] = useState(false);
  const [fetchedEligibility, setFetchedEligibility] = useState(false);
  const [fetchedContactInfo, setFetchedContactInfo] = useState(false);

  // Prevent some browsers from changing the value when scrolling while hovering
  //  over an input[type="number"] with focus.
  document.addEventListener(
    'wheel',
    event => {
      if (
        event.target.type === 'number' &&
        document.activeElement === event.target
      ) {
        event.preventDefault();
        document.body.scrollTop += event.deltaY; // Chrome, Safari, et al
        document.documentElement.scrollTop += event.deltaY; // Firefox, IE, maybe more
      }
    },
    { passive: false },
  );

  // Commenting out next line until component can handle astrisks (See TOE app)
  // const [fetchedDirectDeposit, setFetchedDirectDeposit] = useState(false);

  useEffect(
    () => {
      if (!isLoggedIn || !featureTogglesLoaded || isLOA3 !== true) {
        return;
      }

      if (!fetchedPersonalInfo || !fetchedContactInfo) {
        setFetchedPersonalInfo(true);
        setFetchedContactInfo(true);
        getPersonalInfo(showMebCh33SelfForm);
      } else if (!formData[formFields.claimantId] && claimantInfo?.claimantId) {
        setFormData({
          ...formData,
          ...claimantInfo,
        });
      }
    },
    [
      claimantInfo,
      featureTogglesLoaded,
      fetchedContactInfo,
      fetchedPersonalInfo,
      formData,
      getPersonalInfo,
      isLOA3,
      isLoggedIn,
      setFormData,
      showMebCh33SelfForm,
    ],
  );

  useEffect(
    () => {
      if (!isLoggedIn || !featureTogglesLoaded || isLOA3 !== true) {
        return;
      }

      // the firstName check ensures that eligibility only gets called after we have obtained claimant info
      // we need this to avoid a race condition when a user is being loaded freshly from VADIR on DGIB
      if (firstName && !fetchedEligibility) {
        setFetchedEligibility(true);
        getEligibility();
      } else if (eligibility && !formData.eligibility) {
        setFormData({
          ...formData,
          eligibility,
        });
      }

      const { toursOfDuty } = formData;
      const updatedToursOfDuty = toursOfDuty?.map(tour => {
        const tourToCheck = tour;
        if (
          (tourToCheck?.dateRange?.to && new Date(tourToCheck?.dateRange?.to)) >
            new Date() ||
          tourToCheck?.dateRange?.to === '' ||
          tourToCheck?.dateRange?.to === null ||
          tourToCheck.dateRange.to === 'Invalid date'
        ) {
          tourToCheck.serviceCharacter = 'Not Applicable';
          tourToCheck.separationReason = 'Not Applicable';
        }
        return tourToCheck;
      });

      if (!duplicateArrays(updatedToursOfDuty, toursOfDuty)) {
        setFormData({
          ...formData,
          toursOfDuty: updatedToursOfDuty,
        });
      }
    },
    [
      eligibility,
      featureTogglesLoaded,
      fetchedEligibility,
      firstName,
      formData,
      getEligibility,
      isLOA3,
      isLoggedIn,
      setFormData,
      showMebDgi40Features,
    ],
  );

  useEffect(
    () => {
      if (showMebDgi40Features !== formData.showMebDgi40Features) {
        setFormData({
          ...formData,
          showMebDgi40Features,
        });
      }
      if (showMebDgi42Features !== formData.showMebDgi42Features) {
        setFormData({
          ...formData,
          showMebDgi42Features,
        });
      }
      if (showMebCh33SelfForm !== formData.showMebCh33SelfForm) {
        setFormData({
          ...formData,
          showMebCh33SelfForm,
        });
      }

      if (
        formData['view:phoneNumbers']?.mobilePhoneNumber?.phone &&
        formData?.email?.email &&
        !formData?.duplicateEmail &&
        !formData?.duplicatePhone &&
        formData?.showMebEnhancements08
      ) {
        getDuplicateContactInfo(
          [{ value: formData?.email?.email, dupe: '' }],
          [
            {
              value: formData['view:phoneNumbers']?.mobilePhoneNumber?.phone,
              dupe: '',
            },
          ],
        );
      }

      if (
        duplicateEmail?.length > 0 &&
        duplicateEmail !== formData?.duplicateEmail
      ) {
        setFormData({
          ...formData,
          duplicateEmail,
        });
      }

      if (
        duplicatePhone?.length > 0 &&
        duplicatePhone !== formData?.duplicatePhone
      ) {
        setFormData({
          ...formData,
          duplicatePhone,
        });
      }

      if (showMebEnhancements !== formData.showMebEnhancements) {
        setFormData({
          ...formData,
          showMebEnhancements,
        });
      }
      if (showMebEnhancements06 !== formData.showMebEnhancements06) {
        setFormData({
          ...formData,
          showMebEnhancements06,
        });
      }

      if (showMebEnhancements08 !== formData.showMebEnhancements08) {
        setFormData({
          ...formData,
          showMebEnhancements08,
        });
      }

      if (showMebEnhancements09 !== formData.showMebEnhancements09) {
        setFormData({
          ...formData,
          showMebEnhancements09,
        });
      }

      if (isLOA3 !== formData.isLOA3) {
        setFormData({
          ...formData,
          isLOA3, // ES6 Syntax
        });
      }
    },
    [
      formData,
      isLOA3,
      setFormData,
      showMebDgi40Features,
      showMebDgi42Features,
      showMebCh33SelfForm,
      showMebEnhancements,
      showMebEnhancements06,
      showMebEnhancements08,
      showMebEnhancements09,
      getDuplicateContactInfo,
      duplicateEmail,
      duplicatePhone,
    ],
  );

  useEffect(
    () => {
      if (email && email !== formData?.email?.email) {
        setFormData({
          ...formData,
          email: {
            ...formData?.email,
            email,
          },
        });
      }
    },
    [email, formData, setFormData],
  );

  // Commenting out until Direct Deposit component is updated
  // useEffect(
  //   () => {
  //     if (showMebDgi40Features && isLoggedIn && !fetchedDirectDeposit) {
  //       setFetchedDirectDeposit(true);
  //       getDirectDeposit();
  //     }
  //   },
  //   [fetchedDirectDeposit, getDirectDeposit, isLoggedIn, showMebDgi40Features],
  // );

  return (
    <>
      <va-breadcrumbs>
        <a href="/">Home</a>
        <a href="/education">Education and training</a>
        <a href="/education/apply-for-benefits-form-22-1990">
          Apply for education benefits
        </a>
      </va-breadcrumbs>
      <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
        {children}
      </RoutedSavableApp>
    </>
  );
};

App.propTypes = {
  children: PropTypes.object,
  claimantInfo: PropTypes.object,
  duplicateEmail: PropTypes.array,
  duplicatePhone: PropTypes.array,
  eligibility: PropTypes.arrayOf(PropTypes.string),
  email: PropTypes.string,
  featureTogglesLoaded: PropTypes.bool,
  firstName: PropTypes.string,
  formData: PropTypes.object,
  // getDirectDeposit: PropTypes.func,
  getEligibility: PropTypes.func,
  getPersonalInfo: PropTypes.func,
  isLOA3: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  location: PropTypes.object,
  mobilePhone: PropTypes.string,
  setFormData: PropTypes.func,
  showMebCh33SelfForm: PropTypes.bool,
  showMebDgi40Features: PropTypes.bool,
  showMebEnhancements: PropTypes.bool,
  showMebEnhancements06: PropTypes.bool,
  showMebEnhancements08: PropTypes.bool,
  showMebEnhancements09: PropTypes.bool,
};

const mapStateToProps = state => {
  const formData = state.form?.data || {};
  const firstName = state.data?.formData?.data?.attributes?.claimant?.firstName;
  const transformedClaimantInfo = prefillTransformer(null, null, null, state);
  const claimantInfo = transformedClaimantInfo.formData;
  const email = state?.form?.data?.email?.email;

  return {
    ...getAppData(state),
    formData,
    firstName,
    claimantInfo,
    email,
  };
};

const mapDispatchToProps = {
  // getDirectDeposit: fetchDirectDeposit,
  getEligibility: fetchEligibility,
  setFormData: setData,
  getPersonalInfo: fetchPersonalInformation,
  getDuplicateContactInfo: fetchDuplicateContactInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
