import React from 'react';
import PropTypes from 'prop-types';

import { getFormattedPhone, hasHomeAndMobilePhone } from '../utils/contactInfo';
import { PRIMARY_PHONE } from '../constants';
import { content } from '../content/primaryPhone';

const PrimaryPhoneReview = ({ data, editPage }) => {
  const primary = data[PRIMARY_PHONE] || '';
  return hasHomeAndMobilePhone(data) ? (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="vads-u-font-size--h5 vads-u-margin--0">
          {content.reviewTitle}
        </h4>
        <va-button
          class="edit-page"
          secondary
          onClick={editPage}
          aria-label={content.editLabel}
          text={content.edit}
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>{content[`${primary}Label`]}</dt>
          <dd>
            <strong>
              {getFormattedPhone(
                data.veteran[primary === 'home' ? 'homePhone' : 'mobilePhone'],
              )}
            </strong>
          </dd>
        </div>
      </dl>
    </div>
  ) : null;
};

PrimaryPhoneReview.propTypes = {
  data: PropTypes.shape({
    veteran: PropTypes.shape({
      homePhone: PropTypes.shape({}),
      mobilePhone: PropTypes.shape({}),
    }),
    [PRIMARY_PHONE]: PropTypes.string,
  }),
  editPage: PropTypes.func,
};

export default PrimaryPhoneReview;