import React from 'react';

import { MAX_LENGTH } from '../../shared/constants';

export const issueErrorMessages = {
  missingIssue: 'Please add the name of an issue',
  uniqueIssue: 'Please enter a unique condition name',
  maxLength: `Please enter less than ${
    MAX_LENGTH.ISSUE_NAME
  } characters for this issue name`,

  invalidDate: 'Please provide a valid date',
  missingDecisionDate: 'Please enter a decision date',
  invalidDateRange: (min, max) =>
    `Please enter a year between ${min} and ${max}`,
  pastDate: 'Please add a past decision date',
  newerDate: 'Please add an issue with a decision date less than a year old',
};

export const content = {
  title: {
    add: 'Add an issue',
    edit: 'Edit an issue',
  },

  button: {
    cancel: 'Cancel',
    add: 'Add issue',
    edit: 'Update issue',
  },
  name: {
    label: 'Name of issue',
    hint: (
      <div>
        You can only add an issue that you’ve received a VA decision notice for.
      </div>
    ),
  },
  date: {
    label: 'Date of decision',
    hint:
      'Enter the date on your decision notice (the letter you received in the mail from us).',
  },
};
