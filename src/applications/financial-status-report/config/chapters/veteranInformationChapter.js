import {
  veteranInfo,
  combinedDebts,
  contactInfo,
  contactInformation,
  spouseInformation,
  spouseName,
  dependents,
  dependentRecords,
} from '../../pages';
import ContactInfo, {
  customContactFocus,
} from '../../components/contactInfo/ContactInfo';
import ContactInfoReview from '../../components/contactInfo/ContactInfoReview';
import {
  EditMobilePhone,
  EditEmail,
  EditAddress,
} from '../../components/contactInfo/EditContactInfo';
import DependentAges from '../../components/household/DependentAges';
import DependentAgesReview from '../../components/household/DependentAgesReview';

export default {
  veteranInformationChapter: {
    title: 'Veteran information',
    pages: {
      veteranInfo: {
        path: 'veteran-information',
        title: 'Veteran information',
        uiSchema: veteranInfo.uiSchema,
        schema: veteranInfo.schema,
        editModeOnReviewPage: true,
        initialData: {
          personalData: {
            veteranFullName: {
              first: '',
              last: '',
              middle: '',
            },
            dateOfBirth: '',
          },
          personalIdentification: {
            ssn: '',
            fileNumber: '',
          },
        },
      },
      availableDebts: {
        initialData: {
          selectedDebtsAndCopays: [],
        },
        path: 'all-available-debts',
        title: 'Available Debts',
        uiSchema: combinedDebts.uiSchema,
        schema: combinedDebts.schema,
      },
      contactInfo: {
        initialData: {
          personalData: {
            address: {
              street: '',
              city: '',
              state: '',
              country: '',
              postalCode: '',
            },
            telephoneNumber: '',
            emailAddress: '',
          },
        },
        path: 'contact-information',
        title: 'Contact Information',
        uiSchema: contactInfo.uiSchema,
        schema: contactInfo.schema,
        depends: formData => !formData['view:enhancedFinancialStatusReport'],
      },
      currentContactInformation: {
        title: 'Contact information',
        path: 'current-contact-information',
        CustomPage: ContactInfo,
        CustomPageReview: ContactInfoReview,
        uiSchema: contactInformation.uiSchema,
        schema: contactInformation.schema,
        // needs useCustomScrollAndFocus: true to work
        scrollAndFocusTarget: customContactFocus,
        depends: formData => formData['view:enhancedFinancialStatusReport'],
      },
      editMobilePhone: {
        title: 'Edit mobile phone number',
        path: 'edit-mobile-phone',
        CustomPage: EditMobilePhone,
        CustomPageReview: EditMobilePhone,
        depends: () => false, // accessed from contact info page
        uiSchema: {},
        schema: { type: 'object', properties: {} },
      },
      editEmailAddress: {
        title: 'Edit email address',
        path: 'edit-email-address',
        CustomPage: EditEmail,
        CustomPageReview: EditEmail,
        depends: () => false, // accessed from contact info page
        uiSchema: {},
        schema: { type: 'object', properties: {} },
      },
      editMailingAddress: {
        title: 'Edit mailing address',
        path: 'edit-mailing-address',
        CustomPage: EditAddress,
        CustomPageReview: EditAddress,
        depends: () => false, // accessed from contact info page
        uiSchema: {},
        schema: { type: 'object', properties: {} },
      },
      spouseInformation: {
        path: 'spouse-information',
        title: 'Spouse information',
        uiSchema: spouseInformation.uiSchema,
        schema: spouseInformation.schema,
        depends: formData => formData['view:streamlinedWaiver'],
      },
      spouseName: {
        path: 'spouse-name',
        title: 'Spouse name',
        uiSchema: spouseName.uiSchema,
        schema: spouseName.schema,
        depends: formData =>
          formData.questions.isMarried && formData['view:streamlinedWaiver'],
      },
      dependentCount: {
        path: 'dependents-count',
        title: 'Dependents',
        uiSchema: dependents.uiSchemaEnhanced,
        schema: dependents.schemaEnhanced,
        depends: formData => formData['view:streamlinedWaiver'],
      },
      dependentAges: {
        path: 'dependent-ages',
        title: 'Dependents',
        uiSchema: {},
        schema: dependentRecords.schemaEnhanced,
        depends: formData =>
          formData.questions?.hasDependents &&
          formData.questions.hasDependents !== '0' &&
          formData['view:streamlinedWaiver'],
        CustomPage: DependentAges,
        CustomPageReview: DependentAgesReview,
        editModeOnReviewPage: false,
      },
    },
  },
};
