import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { unreadCountAllFolders } from '../../util/helpers';

const DashboardUnreadMessages = props => {
  const { folders } = props;
  const [unreadCount, setUnreadCount] = useState(null);

  useEffect(
    () => {
      if (folders?.length > 0) {
        setUnreadCount(unreadCountAllFolders(folders));
      }
    },
    [folders],
  );
  return (
    <div className="unread-messages">
      {folders === null && <p>Unable to retrieve messages at this moment</p>}

      {folders !== undefined &&
        unreadCount > 0 && <h2>{`You have ${unreadCount} unread messages`}</h2>}

      <Link
        className="vads-c-action-link--blue vads-u-margin-top--1"
        text="View Inbox"
        to="/inbox"
      >
        View Inbox
      </Link>
    </div>
  );
};

DashboardUnreadMessages.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.object),
};

export default DashboardUnreadMessages;