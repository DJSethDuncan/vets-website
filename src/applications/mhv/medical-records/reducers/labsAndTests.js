import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import {
  concatCategoryCodeText,
  concatObservationInterpretations,
  getObservationValueWithUnits,
  isArrayAndHasItems,
} from '../util/helpers';
import {
  LoincCodes,
  FhirResourceTypes,
  labTypes,
  emptyField,
} from '../util/constants';

const initialState = {
  /**
   * The list of lab and test results returned from the api
   * @type {array}
   */
  labsAndTestsList: undefined,

  /**
   * The lab or test result currently being displayed to the user
   */
  labsAndTestsDetails: undefined,
};

/**
 * @param {Object} record - A FHIR chem/hem Observation object
 * @returns the appropriate frontend object for display
 */
const convertChemHemObservation = results => {
  return results.filter(obs => obs.valueQuantity).map(result => {
    return {
      name: result.code.text,
      result: getObservationValueWithUnits(result) || emptyField,
      standardRange: result.referenceRange[0].text || emptyField,
      status: result.status || emptyField,
      labLocation: result.labLocation || emptyField,
      interpretation: concatObservationInterpretations(result) || emptyField,
    };
  });
};

/**
 * @param {Object} record - A FHIR DiagnosticReport chem/hem object
 * @returns the appropriate frontend object for display
 */
const convertChemHemRecord = record => {
  const results = record.contained.filter(
    recordItem => recordItem.resourceType === 'Observation',
  );
  return {
    id: record.id,
    type: labTypes.CHEM_HEM,
    name: concatCategoryCodeText(record),
    category: concatCategoryCodeText(record),
    orderedBy: record.physician || emptyField,
    requestedBy: record.physician || emptyField,
    date: formatDateLong(record.effectiveDateTime),
    orderingLocation: record.location || emptyField,
    collectingLocation: record.location || emptyField,
    comments: [record.conclusion],
    results: convertChemHemObservation(results),
    sampleTested: record.specimen?.text || emptyField,
  };
};

/**
 * @param {Object} record - A FHIR DiagnosticReport microbiology object
 * @returns the appropriate frontend object for display
 */
const convertMicrobiologyRecord = record => {
  return {
    id: record.id,
    type: labTypes.MICROBIOLOGY,
    name: 'Microbiology',
    category: '',
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    date: record.effectiveDateTime || emptyField,
    sampleFrom: record.type?.text || emptyField,
    sampleTested: record.specimen?.text || emptyField,
    orderingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    collectingLocation: record.performer?.text || emptyField,
    labLocation: '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    results: record.conclusion || record.result || emptyField,
  };
};

/**
 * @param {Object} record - A FHIR DiagnosticReport pathology object
 * @returns the appropriate frontend object for display
 */
const convertPathologyRecord = record => {
  return {
    id: record.id,
    name: record.code?.text,
    type: labTypes.PATHOLOGY,
    category: concatCategoryCodeText(record),
    orderedBy: record.physician || emptyField,
    requestedBy: record.physician || emptyField,
    date: formatDateLong(record.effectiveDateTime),
    sampleTested: record.specimen?.text || emptyField,
    labLocation: record.labLocation || emptyField,
    collectingLocation: record.location || emptyField,
    results: record.conclusion || record.result || emptyField,
  };
};

/**
 * @param {Object} record - A FHIR DocumentReference EKG object
 * @returns the appropriate frontend object for display
 */
const convertEkgRecord = record => {
  return {
    id: record.id,
    name: 'Electrocardiogram (EKG)',
    type: labTypes.EKG,
    category: '',
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    date: record.date,
    facility: 'school parking lot',
  };
};

/**
 * @param {Object} record - A FHIR DocumentReference radiology object
 * @returns the appropriate frontend object for display
 */
const convertRadiologyRecord = record => {
  const typeCodingDisplay = record.type.coding.filter(
    coding => coding.display,
  )[0].display;

  const authorDisplayFields = record.author
    .filter(author => author.display)
    .map(author => author.display);
  const authorDisplay = authorDisplayFields.join(', ');

  return {
    id: record.id,
    name: typeCodingDisplay,
    type: labTypes.RADIOLOGY,
    reason: record.reason || emptyField,
    category: record.category?.text || emptyField,
    orderedBy:
      (isArrayAndHasItems(record.author) && record.author[0].display) ||
      emptyField,
    requestedBy:
      (isArrayAndHasItems(record.author) && record.author[0].display) ||
      emptyField,
    clinicalHistory: record.clinicalHistory || emptyField,
    orderingLocation: record.location || emptyField,
    imagingLocation: authorDisplay,
    date: record.date,
    imagingProvider: record.physician || emptyField,
    results: Buffer.from(record.content[0].attachment.data, 'base64').toString(
      'utf-8',
    ),
    images: [],
  };
};

/**
 * @param {Object} record - A FHIR DiagnosticReport or DocumentReference object
 * @returns the type of lab/test that was passed
 */
const getRecordType = record => {
  if (record.resourceType === FhirResourceTypes.DIAGNOSTIC_REPORT) {
    if (record.code.text === 'CH') return labTypes.CHEM_HEM;
    if (
      record.code.coding.some(coding => coding.code === LoincCodes.MICROBIOLOGY)
    )
      return labTypes.MICROBIOLOGY;
    if (record.code.coding.some(coding => coding.code === LoincCodes.PATHOLOGY))
      return labTypes.PATHOLOGY;
  }
  if (record.resourceType === FhirResourceTypes.DOCUMENT_REFERENCE) {
    if (record.type.coding.some(coding => coding.code === LoincCodes.EKG))
      return labTypes.EKG;
    if (record.type.coding.some(coding => coding.code === LoincCodes.RADIOLOGY))
      return labTypes.RADIOLOGY;
  }
  return labTypes.OTHER;
};

/**
 * Maps each record type to a converter function
 */
const labsAndTestsConverterMap = {
  [labTypes.CHEM_HEM]: convertChemHemRecord,
  [labTypes.MICROBIOLOGY]: convertMicrobiologyRecord,
  [labTypes.PATHOLOGY]: convertPathologyRecord,
  [labTypes.EKG]: convertEkgRecord,
  [labTypes.RADIOLOGY]: convertRadiologyRecord,
  [labTypes.OTHER]: record => record,
};

/**
 * @param {Object} record - A FHIR DiagnosticReport or DocumentReference object
 * @returns the appropriate frontend object for display
 */
export const convertLabsAndTestsRecord = record => {
  const type = getRecordType(record);
  const convertRecord = labsAndTestsConverterMap[type];
  return convertRecord ? convertRecord(record) : record;
};

export const labsAndTestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.LabsAndTests.GET: {
      return {
        ...state,
        labsAndTestsDetails: convertLabsAndTestsRecord(action.response),
      };
    }
    case Actions.LabsAndTests.GET_LIST: {
      const recordList = action.response;
      return {
        ...state,
        labsAndTestsList:
          recordList.entry?.map(record => convertLabsAndTestsRecord(record)) ||
          [],
      };
    }
    default:
      return state;
  }
};
