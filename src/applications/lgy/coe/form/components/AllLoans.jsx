import React from 'react';
// import { setData } from 'platform/forms-system/src/js/actions';
// import { TextField } from '@department-of-veterans-affairs/formulate';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { MiniSummaryCard } from './MiniSummaryCard';

const AllLoans = props => {
  const goForward = () => {
    return props.goToPath('/upload-supporting-documents');
  };

  const goBack = () => {
    return props.goToPath('/existing-loan-screener');
  };

  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <legend
          id="added-assets-summary"
          className="schemaform-block-title"
          name="addedAssetsSummary"
        >
          <h3 className="vads-u-margin--0">
            You have added these VA backed loans
          </h3>
        </legend>
        <MiniSummaryCard heading="Loan 1" />
        <MiniSummaryCard heading="Loan 2" />
        <button type="button" onClick={() => props.goToPath('/add-va-loan')}>
          Add a new loan
        </button>
        {props.contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
          goForward={goForward}
          submitToContinue
        />
        {props.contentAfterButtons}
      </fieldset>
    </form>
  );
};

export default AllLoans;

// Render list of loans w/ button to add loan

// First: Build the Empty list and Nav for the form
