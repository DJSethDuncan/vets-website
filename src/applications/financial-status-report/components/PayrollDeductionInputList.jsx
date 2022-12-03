import React, { useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { getJobIndex } from '../utils/session';

const PayrollDeductionInputList = props => {
  const { goToPath, goBack, onReviewPage, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const userType = 'veteran';

  const index = isEditing ? Number(editIndex) : 0;

  const formData = useSelector(state => state.form.data);
  const employmentRecord =
    formData.personalData.employmentHistory.veteran.employmentRecords[index];

  const { employerName, deductions } = employmentRecord;

  const [selectedDeductions, setSelectedDeductions] = useState(deductions);

  const mapDeductions = target => {
    return selectedDeductions.map(deduction => {
      if (deduction.name === target.name) {
        return {
          ...deduction,
          amount: target.value,
        };
      }
      return deduction;
    });
  };

  const onChange = event => {
    const { target } = event;
    const updatedDeductions = mapDeductions(target);
    setSelectedDeductions(updatedDeductions);
  };

  const updateFormData = e => {
    e.preventDefault();
    if (isEditing) {
      // find the one we are editing in the employeeRecords array
      const updatedRecords = formData.personalData.employmentHistory.veteran.employmentRecords.map(
        (item, arrayIndex) => {
          return arrayIndex === index
            ? {
                ...employmentRecord,
                deductions: selectedDeductions,
              }
            : item;
        },
      );
      // update form data
      setFormData({
        ...formData,
        personalData: {
          ...formData.personalData,
          employmentHistory: {
            ...formData.personalData.employmentHistory,
            [`${userType}`]: {
              ...formData.personalData.employmentHistory[`${userType}`],
              employmentRecords: updatedRecords,
            },
          },
        },
      });
    } else {
      const records = [
        { ...employmentRecord, deductions: selectedDeductions },
        ...formData.personalData.employmentHistory.veteran.employmentRecords.slice(
          1,
        ),
      ];

      setFormData({
        ...formData,
        personalData: {
          ...formData.personalData,
          employmentHistory: {
            ...formData.personalData.employmentHistory,
            [`${userType}`]: {
              ...formData.personalData.employmentHistory[`${userType}`],
              employmentRecords: records,
            },
          },
        },
      });
    }
    goToPath(`/employment-history`);
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={updateFormData}>
      <h3 className="vads-u-margin-top--neg1p5">Your job at {employerName}</h3>{' '}
      <br />
      <p>How much do you pay for each of your payroll deductions?</p>
      {selectedDeductions?.map((deduction, key) => (
        <div key={deduction.name + key} className="vads-u-margin-y--2">
          <va-number-input
            label={deduction.name}
            name={deduction.name}
            value={deduction.amount}
            id={deduction.name + key}
            inputmode="decimal"
            onInput={onChange}
            required
          />
        </div>
      ))}
      {onReviewPage ? updateButton : navButtons}
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PayrollDeductionInputList);