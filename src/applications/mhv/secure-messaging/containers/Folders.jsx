import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import { getFolders, newFolder } from '../actions/folders';
import { closeAlert } from '../actions/alerts';
import { PageTitles } from '../util/constants';
import { updatePageTitle } from '../util/helpers';
import FoldersList from '../components/FoldersList';
import AlertBackgroundBox from '../components/shared/AlertBackgroundBox';
import CreateFolderModal from '../components/Modals/CreateFolderModal';

const Folders = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const folders = useSelector(state => state.sm.folders.folderList);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // clear out alerts if user navigates away from this component
  useEffect(
    () => {
      return () => {
        if (location.pathname) {
          dispatch(closeAlert());
        }
      };
    },
    [location.pathname, dispatch],
  );

  useEffect(
    () => {
      dispatch(getFolders());
    },
    [dispatch, location, isModalVisible],
  );

  useEffect(
    () => {
      if (!isModalVisible) {
        focusElement(document.querySelector('h1'));
        updatePageTitle(PageTitles.MY_FOLDERS_PAGE_TITLE_TAG);
      }
    },
    [isModalVisible],
  );

  const openNewModal = () => {
    dispatch(closeAlert());
    setIsModalVisible(true);
  };

  const confirmFolderCreate = (folderName, closeNewModal) => {
    dispatch(newFolder(folderName))
      .then(dispatch(getFolders()))
      .finally(closeNewModal());
  };

  const content = () => {
    if (folders === undefined) {
      return (
        <va-loading-indicator
          message="Loading your secure message..."
          setFocus
        />
      );
    }
    if (folders === null || folders === false) {
      return (
        <va-alert status="error" visible class="vads-u-margin-y--9">
          <h2 slot="headline">We’re sorry. Something went wrong on our end</h2>
          <p>
            You can’t view your secure message because something went wrong on
            our end. Please check back soon.
          </p>
        </va-alert>
      );
    }
    return (
      <>
        <h1 className="vads-u-margin-bottom--2" data-testid="my-folder-header">
          My folders
        </h1>
        <AlertBackgroundBox closeable />
        <va-button
          onClick={() => {
            openNewModal();
            recordEvent({
              event: 'cta-button-click',
              'button-type': 'primary',
              'button-click-label': 'Create new folder',
            });
          }}
          text="Create new folder"
        />
        {folders && (
          <FoldersList folders={folders.filter(folder => folder.id > 0)} />
        )}
        <CreateFolderModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          onConfirm={confirmFolderCreate}
          folders={folders}
        />
      </>
    );
  };

  return <div className="folders-container">{content()}</div>;
};

export default Folders;
