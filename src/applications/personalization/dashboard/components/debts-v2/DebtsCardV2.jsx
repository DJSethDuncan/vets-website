import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import CTALink from '../CTALink';
import recordEvent from '~/platform/monitoring/record-event';

export const DebtsV2 = ({ debts }) => {
  const debtHistory = debts.reduce(
    (acc, debt) => (debt.debtHistory ? acc.concat(debt.debtHistory) : acc),
    [],
  );
  const allDebtHistoryDates = debtHistory
    .reduce((acc, history) => acc.concat(history.date), [])
    .sort((a, b) => {
      const aSplit = a
        .split('/')
        .reverse()
        .join('');
      const bSplit = b
        .split('/')
        .reverse()
        .join('');
      return bSplit.localeCompare(aSplit);
    });
  const lastUpdatedDate = (allDebtHistoryDates || [])[0] || new Date();
  const formattedLastUpdatedDate = format(
    new Date(lastUpdatedDate),
    'MMMM dd, yyyy',
  );
  const debtsCount = debts?.length || 0;
  if (debtsCount < 1) {
    return (
      <p
        className="vads-u-margin-bottom--3 vads-u-margin-top--0"
        data-testid="zero-debt-paragraph-v2"
      >
        Your total VA debt balance is $0.
      </p>
    );
  }

  return (
    <div className="vads-u-display--flex vads-u-margin-bottom--3">
      <div
        className="vads-u-display--flex vads-u-width--full vads-u-flex-direction--column vads-u-justify-content--space-between vads-u-align-items--flex-start vads-u-background-color--gray-lightest vads-u-padding--2p5"
        data-testid="debt-card-v2"
      >
        <h3 className="vads-u-margin-top--0" data-testid="debt-total-header-v2">
          {debtsCount} overpayment debt
          {debtsCount > 1 ? 's' : ''}
        </h3>
        <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
          Updated on {formattedLastUpdatedDate}
        </p>
        <CTALink
          text="Manage your VA debt"
          href="/manage-va-debt/your-debt"
          showArrow
          className="vads-u-font-weight--bold"
          onClick={() =>
            recordEvent({
              event: 'dashboard-navigation',
              'dashboard-action': 'view-link',
              'dashboard-product': 'view-manage-va-debt',
            })
          }
          testId="manage-va-debt-link-v2"
        />
      </div>
    </div>
  );
};

DebtsV2.propTypes = {
  debts: PropTypes.arrayOf(
    PropTypes.shape({
      amountOverpaid: PropTypes.number.isRequired,
      amountWithheld: PropTypes.number.isRequired,
      benefitType: PropTypes.string.isRequired,
      currentAr: PropTypes.number.isRequired,
      debtHistory: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          letterCode: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        }),
      ),
      deductionCode: PropTypes.string.isRequired,
      diaryCode: PropTypes.string.isRequired,
      diaryCodeDescription: PropTypes.string,
      fileNumber: PropTypes.string.isRequired,
      originalAr: PropTypes.number.isRequired,
      payeeNumber: PropTypes.string.isRequired,
      personEntitled: PropTypes.string.isRequired,
    }),
  ),
  hasError: PropTypes.bool,
};

export default DebtsV2;
