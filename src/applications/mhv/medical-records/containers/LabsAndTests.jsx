import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordList from '../components/RecordList/RecordList';
import { getLabsAndTestsList } from '../actions/labsAndTests';
import { setBreadcrumbs } from '../actions/breadcrumbs';

const LabsAndTests = () => {
  const dispatch = useDispatch();
  const labsAndTests = useSelector(
    state => state.mr.labsAndTests.labsAndTestsList,
  );

  useEffect(() => {
    dispatch(getLabsAndTestsList());
  }, []);

  useEffect(
    () => {
      dispatch(
        setBreadcrumbs(
          [{ url: '/my-health/medical-records/', label: 'Dashboard' }],
          {
            url: '/my-health/medical-records/labs-and-tests',
            label: 'Lab and test results',
          },
        ),
      );
    },
    [dispatch],
  );

  const content = () => {
    if (labsAndTests?.length) {
      return (
        <RecordList
          records={labsAndTests}
          type="lab and test results"
          hideRecordsLabel
        />
      );
    }
    return (
      <va-loading-indicator
        message="Loading..."
        setFocus
        data-testid="loading-indicator"
      />
    );
  };

  return (
    <div className="vaccines" id="vaccines">
      <h1 className="page-title">Lab and test results</h1>
      <p>Review lab and test results in your VA medical records.</p>
      <va-additional-info trigger="What to know about lab and test results">
        This is some additional info about lab and test results, though we are
        waiting on the Content Team to tell us what should be here...
      </va-additional-info>

      {content()}
    </div>
  );
};

export default LabsAndTests;