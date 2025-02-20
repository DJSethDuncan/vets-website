import React from 'react';
import moment from 'moment';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';

export const mcpFeatureToggle = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showMedicalCopays];

export const mcpHTMLStatementToggle = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.medicalCopaysHtmlMedicalStatementsViewEnabled
  ];

export const cdpAccessToggle = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const currency = amount => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(parseFloat(amount));
};

export const formatTableData = tableData =>
  tableData.map(row => ({
    date: row.date,
    desc: <strong>{row.desc}</strong>,
    amount: currency(row.amount),
  }));

export const formatDate = date => {
  return moment(date, 'MM-DD-YYYY').format('MMMM D, YYYY');
};

export const calcDueDate = (date, days) => {
  return moment(date, 'MM-DD-YYYY')
    .add(days, 'days')
    .format('MMMM D, YYYY');
};

export const titleCase = str => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// if currentDate is on or before dueDate show current status
// else show past due status
export const verifyCurrentBalance = date => {
  const currentDate = moment();
  const dueDate = calcDueDate(date, 30);
  return currentDate.isSameOrBefore(dueDate);
};

// receiving formatted date strings in the response
// so we need to convert back to moment before sorting
export const sortStatementsByDate = statements => {
  const format = 'MM-DD-YYYY';
  return statements.sort(
    (a, b) =>
      moment(b.pSStatementDate, format) - moment(a.pSStatementDate, format),
  );
};

export const transform = data => {
  return data.map(statement => {
    const { station } = statement;
    const facilityName = getMedicalCenterNameByID(station.facilitYNum);
    const city = titleCase(station.city);

    return {
      ...statement,
      station: {
        ...station,
        facilityName,
        city,
      },
    };
  });
};

export const ALERT_TYPES = Object.freeze({
  ALL_ERROR: 'ALL_ERROR',
  ALL_ZERO: 'ALL_ZERO',
  ERROR: 'ERROR',
  ZERO: 'ZERO',
});

export const APP_TYPES = Object.freeze({
  DEBT: 'DEBT',
  COPAY: 'COPAY',
});

export const API_RESPONSES = Object.freeze({
  ERROR: -1,
});
