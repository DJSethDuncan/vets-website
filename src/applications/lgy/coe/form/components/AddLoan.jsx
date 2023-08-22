import React from 'react';
// import { setData } from 'platform/forms-system/src/js/actions';
// import { TextField } from '@department-of-veterans-affairs/formulate';
// import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const AddLoan = props => {
  // Set state for this form
  // console.log(props);
  const goForward = () => {
    props.goToPath('/loan-history');
  };

  const goBack = () => {
    return props.goToPath('/loan-history');
  };
  return (
    <>
      <form>
        <fieldset className="vads-u-margin-y--2">
          <legend
            id="added-assets-summary"
            className="schemaform-block-title"
            name="addedAssetsSummary"
          >
            <h3 className="vads-u-margin--0">Add a new VA-backed loan</h3>
          </legend>
          <va-text-input
            name="property-address"
            label="What's the property address?"
            message-aria-describedby="This is the aria speaking"
            hint="You gotta fill this out"
          />
          <va-date
            label="When did you own this property"
            name="discharge-date"
            onDateBlur={function noRefCheck() {}}
            onDateChange={function noRefCheck() {}}
          />
          <button type="button" onClick={goForward}>
            Add this loan
          </button>
          <button
            type="button"
            onClick={goBack}
            className="usa-button-secondary"
          >
            Cancel
          </button>
          {props.contentBeforeButtons}
          {props.contentAfterButtons}
          {/* <FormNavButtons
            goForward={goForward}
            goBack={goBack}
            submitToContinue
          /> */}
        </fieldset>
      </form>
    </>
  );
};

export default AddLoan;
