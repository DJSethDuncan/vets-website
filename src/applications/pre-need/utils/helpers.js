import React from 'react';
import { merge } from 'lodash';
import PropTypes from 'prop-types';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import * as Sentry from '@sentry/browser';

import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import fullNameUI from 'platform/forms/definitions/fullName';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import TextWidget from 'platform/forms-system/src/js/widgets/TextWidget';

import {
  stringifyFormReplacer,
  filterViewFields,
} from 'platform/forms-system/src/js/helpers';

import environment from 'platform/utilities/environment';
import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';
import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import { serviceLabels } from './labels';
import RaceEthnicityReviewField from '../components/RaceEthnicityReviewField';
import ServicePeriodView from '../components/ServicePeriodView';

export const nonRequiredFullNameUI = omit('required', fullNameUI);

export const contactInfoDescription = (
  <va-additional-info trigger="Why do we need your contact information?">
    <p>
      We may contact you by phone if we need more information about your
      application.
    </p>
    <p>
      You can also provide your email address to receive updates about new
      openings in VA national cemeteries or other burial benefits.
    </p>
  </va-additional-info>
);

export const authorizedAgentDescription = (
  // TODO va-additional-info component to be replaced with a more optimal solution
  <va-additional-info trigger="Who can a preparer sign for?">
    <p>A preparer may sign for an individual who’s:</p>
    <ul>
      <li>
        Under 18 years of age, <strong>or</strong>
      </li>
      <li>
        Is mentally incompetent, <strong>or</strong>
      </li>
      <li>Is physically unable to sign the application</li>
    </ul>
    <p>
      If you’re the preparer of this application, you’ll need to provide your
      contact information.
    </p>
  </va-additional-info>
);
export const veteranRelationshipDescription = (
  <va-alert
    status="info"
    background-only
    role="status"
    id="veteran-relationship"
  >
    You’re applying as the <strong>service member or Veteran</strong>. We’ll ask
    you questions about your military status and history to determine if you
    qualify for burial in a VA national cemetery.
  </va-alert>
);

export const spouseRelationshipDescription = (
  <va-alert
    status="info"
    background-only
    role="status"
    id="spouse-relationship"
  >
    You’re applying as the{' '}
    <strong>legally married spouse or surviving spouse</strong> of the service
    member or Veteran who’s your sponsor. We’ll ask you questions about your
    sponsor’s military status and history to determine if you qualify for burial
    in a VA national cemetery.
  </va-alert>
);

export const childRelationshipDescription = (
  <va-alert status="info" background-only role="status" id="child-relationship">
    You’re applying as the <strong>unmarried adult child</strong> of the service
    member or Veteran who’s your sponsor. We’ll ask you questions about your
    sponsor’s military status and history to determine if you qualify for burial
    in a VA national cemetery. You’ll also need to provide supporting documents
    with information about your disability.
  </va-alert>
);

export const otherRelationshipDescription = (
  <va-alert status="info" background-only role="status" id="other-relationship">
    You’re applying on <strong>behalf</strong> of the service member or Veteran
    who’s your sponsor. We’ll ask you questions about your sponsor’s military
    status and history to determine if they qualify for burial in a VA national
    cemetery.
  </va-alert>
);

export const sponsorMilitaryStatusDescription = (
  <va-alert status="info" background-only>
    If you’re not sure what your sponsor’s status is—or if it isn’t listed
    here—don’t worry. You can upload supporting documents showing your sponsor’s
    service history later in this application.
  </va-alert>
);

export const desiredCemeteryNoteDescription = (
  <va-alert status="info" background-only id="burial-cemetary-note">
    <strong>Please note:</strong> This doesn’t guarantee you’ll be buried in
    your preferred cemetery. We’ll try to fulfill your wishes, but will assign a
    gravesite in a cemetery with available space at the time of need.
  </va-alert>
);

export function isVeteran(item) {
  return get('application.claimant.relationshipToVet', item) === '1';
}

export function isSpouse(item) {
  return get('application.claimant.relationshipToVet', item) === '2';
}

export function isUnmarriedChild(item) {
  return get('application.claimant.relationshipToVet', item) === '3';
}

export function isVeteranAndHasServiceName(item) {
  return (
    isVeteran(item) &&
    get('application.veteran.view:hasServiceName', item) === true
  );
}

export function isNotVeteranAndHasServiceName(item) {
  return (
    !isVeteran(item) &&
    get('application.veteran.view:hasServiceName', item) === true
  );
}

export function buriedWSponsorsEligibility(item) {
  return get('application.hasCurrentlyBuried', item) === '1';
}

export function isAuthorizedAgent(item) {
  return (
    get('application.applicant.applicantRelationshipToClaimant', item) ===
    'Authorized Agent/Rep'
  );
}

export function requiresSponsorInfo(item) {
  const sponsor = item['view:sponsor'];
  return sponsor === undefined || sponsor === 'Other';
}

export function formatName(name) {
  const { first, middle, last, suffix } = name;
  return (
    (first || last) &&
    `${first} ${middle ? `${middle} ` : ''}${last}${
      suffix ? `, ${suffix}` : ''
    }`
  );
}

export function claimantHeader({ formData }) {
  const name = formatName(formData.claimant.name);
  return <h4 className="highlight">{name}</h4>;
}

export function transform(formConfig, form) {
  // Copy over sponsor data if the claimant is the veteran.
  const populateSponsorData = application =>
    isVeteran({ application })
      ? merge({}, application, {
          veteran: {
            address: application.claimant.address,
            currentName: application.claimant.name,
            dateOfBirth: application.claimant.dateOfBirth,
            ssn: application.claimant.ssn,
            isDeceased: 'no',
            serviceName:
              application.veteran.serviceName || application.claimant.name,
          },
        })
      : application;

  // Copy over preparer data if the claimant is the applicant.
  const populatePreparerData = application =>
    !isAuthorizedAgent({ application })
      ? merge({}, application, {
          applicant: {
            mailingAddress: application.claimant.address,
            name: application.claimant.name,
          },
        })
      : application;

  // Copy over veteran data if a sponsor is filling out the form
  const populateVeteranData = application =>
    merge({}, application, {
      veteran: {
        serviceName:
          application.veteran.serviceName || application.veteran.currentName,
      },
      applicant: {
        applicantEmail: application.claimant.email,
        applicantPhoneNumber: application.claimant.phoneNumber,
      },
    });

  const application = [
    populateSponsorData,
    populatePreparerData,
    populateVeteranData,
    filterViewFields,
  ].reduce((result, func) => func(result), form.data.application);

  // const formCopy = set('application', application, Object.assign({}, form));
  // const formData = transformForSubmit(formConfig, formCopy);

  return JSON.stringify({ application }, stringifyFormReplacer);

  /* Transformation for multiple applicants.
   *
   *  const matchClaimant = name => a => formatName(a.claimant.name) === name;
   *
   *  formCopy.applications = formCopy.applications.map(application => {
   *    // Fill in veteran info that veterans didn't need to enter separately.
   *    if (isVeteran(application)) {
   *      return merge({}, application, {
   *        veteran: {
   *          address: application.claimant.address,
   *          currentName: application.claimant.name,
   *          dateOfBirth: application.claimant.dateOfBirth,
   *          ssn: application.claimant.ssn,
   *          isDeceased: 'no'
   *        }
   *      });
   *    }
   *
   *    // Fill in veteran info in each application
   *    // where the sponsor is another claimant.
   *    const sponsorName = application['view:sponsor'];
   *    if (sponsorName !== 'Other') {
   *      const veteranApplication = form.applications.find(matchClaimant(sponsorName));
   *      const veteran = set('isDeceased', 'no', veteranApplication.veteran);
   *      return set('veteran', veteran, application);
   *    }
   *
   *    return application;
   *  });
   *
   *  // Fill in applicant info in each application
   *  // if the applicant is another claimant.
   *  const applicantName = form['view:preparer'];
   *  if (applicantName !== 'Other') {
   *    const applicantApplication = form.applications.find(matchClaimant(applicantName));
   *    const { address, email, name, phoneNumber } = applicantApplication.claimant;
   *    formCopy.applications = formCopy.applications.map(application => set('applicant',  {
   *      applicantEmail: email,
   *      applicantPhoneNumber: phoneNumber,
   *      applicantRelationshipToClaimant: application.claimant.ssn === applicantApplication.claimant.ssn ? 'Self' : 'Authorized Agent/Rep',
   *      completingReason: '',
   *      mailingAddress: address,
   *      name
   *    }, application));
   *  }
   *
   */
}

export const fullMaidenNameUI = merge({}, fullNameUI, {
  maiden: { 'ui:title': 'Maiden name' },
  'ui:order': ['first', 'middle', 'last', 'suffix', 'maiden'],
});

class SSNWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = { val: props.value };
  }

  handleChange = val => {
    // Insert dashes if they are missing.
    // Keep if value is valid and formatted with dashes.
    // Set empty value to undefined.
    const formattedSSN =
      (val && /^\d{9}$/.test(val)
        ? `${val.substr(0, 3)}-${val.substr(3, 2)}-${val.substr(5)}`
        : val) || undefined;

    this.setState({ val }, () => {
      this.props.onChange(formattedSSN);
    });
  };

  render() {
    return (
      <TextWidget
        {...this.props}
        value={this.state.val}
        onChange={this.handleChange}
      />
    );
  }
}

// Modify default uiSchema for SSN to insert any missing dashes.
export const ssnDashesUI = merge({}, ssnUI, { 'ui:widget': SSNWidget });

export const veteranUI = {
  militaryServiceNumber: {
    'ui:title':
      'Military Service number (if you have one that’s different than your Social Security number)',
    'ui:errorMessages': {
      pattern: 'Your Military Service number must be between 4 to 9 characters',
    },
  },
  vaClaimNumber: {
    'ui:title': 'VA claim number (if known)',
    'ui:errorMessages': {
      pattern: 'Your VA claim number must be between 8 to 9 digits',
    },
  },
  placeOfBirth: {
    'ui:title': 'Place of birth (City, State, or Territory)',
  },
  gender: {
    'ui:title': 'Sex (information will be used for statistical purposes only)',
    'ui:widget': 'radio',
  },
  maritalStatus: {
    'ui:title': 'Marital status',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        single: 'Single',
        separated: 'Separated',
        married: 'Married',
        divorced: 'Divorced',
        widowed: 'Widowed',
      },
    },
  },
  race: {
    'ui:field': RaceEthnicityReviewField,
    'ui:title':
      'Which categories best describe you? (You may check more than one)',
    isSpanishHispanicLatino: {
      'ui:title': 'Hispanic or Latino',
    },
    notSpanishHispanicLatino: {
      'ui:title': 'Not Hispanic or Latino',
    },
    isAmericanIndianOrAlaskanNative: {
      'ui:title': 'American Indian or Alaskan Native',
    },
    isBlackOrAfricanAmerican: {
      'ui:title': 'Black or African American',
    },
    isNativeHawaiianOrOtherPacificIslander: {
      'ui:title': 'Native Hawaiian or other Pacific Islander',
    },
    isAsian: {
      'ui:title': 'Asian',
    },
    isWhite: {
      'ui:title': 'White',
    },
    'ui:validations': [
      // require at least one value to be true/checked
      (errors, fields) => {
        if (!Object.values(fields).some(val => val === true)) {
          errors.addError('Please provide a response');
        }
      },
    ],
    'ui:options': {
      showFieldLabel: true,
    },
  },
  militaryStatus: {
    'ui:title':
      'Current military status (You can add more service history information later in this application.)',
    'ui:options': {
      labels: {
        A: 'Active Duty',
        I: 'Death Related to Inactive Duty Training',
        D: 'Died on Active Duty',
        S: 'Reserve/National Guard',
        R: 'Retired',
        E: 'Retired Active Duty',
        O: 'Retired Reserve/National Guard',
        V: 'Veteran',
        X: 'Other',
      },
    },
  },
};

export const serviceRecordsUI = {
  'ui:title': 'Service periods',
  'ui:description':
    'Please provide all your service periods. If you need to add another service period, please click the Add Another Service Period button.',
  'ui:options': {
    viewField: ServicePeriodView,
    itemName: 'Service period',
    keepInPageOnReview: true,
  },
  items: {
    'ui:order': [
      'serviceBranch',
      'dateRange',
      'dischargeType',
      'highestRank',
      'nationalGuardState',
    ],
    'ui:options': {
      itemName: 'Service Period',
    },
    serviceBranch: autosuggest.uiSchema('Branch of service', null, {
      'ui:options': {
        labels: serviceLabels,
      },
    }),
    dateRange: dateRangeUI(
      'Service start date',
      'Service end date',
      'Service start date must be after end date',
    ),
    dischargeType: {
      'ui:title': 'Discharge character of service',
      'ui:options': {
        labels: {
          1: 'Honorable',
          2: 'General',
          3: 'Entry Level Separation/Uncharacterized',
          4: 'Other Than Honorable',
          5: 'Bad Conduct',
          6: 'Dishonorable',
          7: 'Other',
        },
      },
    },
    highestRank: {
      'ui:title': 'Highest rank attained',
    },
    nationalGuardState: {
      'ui:title': 'State (for National Guard Service only)',
      'ui:options': {
        hideIf: (formData, index) =>
          !['AG', 'NG'].includes(
            formData.application.veteran.serviceRecords[index].serviceBranch,
          ),
      },
    },
  },
};

export const militaryNameUI = {
  application: {
    veteran: {
      'view:hasServiceName': {
        'ui:title': 'Did you serve under another name?',
        'ui:widget': 'yesNo',
      },
      serviceName: merge({}, nonRequiredFullNameUI, {
        'ui:options': {
          expandUnder: 'view:hasServiceName',
        },
      }),
    },
  },
};

export function getCemeteries() {
  return fetch(`${environment.API_URL}/v0/preneeds/cemeteries`, {
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
    },
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      return res.json();
    })
    .then(res =>
      res.data.map(item => ({
        label: item.attributes.name,
        id: item.id,
      })),
    )
    .catch(res => {
      if (res instanceof Error) {
        Sentry.captureException(res);
        Sentry.captureMessage('vets_preneed_cemeteries_error');
      }

      // May change this to a reject later, depending on how we want
      // to surface errors in autosuggest field
      return Promise.resolve([]);
    });
}

SSNWidget.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};
