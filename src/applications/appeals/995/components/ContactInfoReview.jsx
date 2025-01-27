import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Element } from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import { ADDRESS_TYPES } from 'platform/forms/address/helpers';

import { getFormattedPhone } from '../utils/contactInfo';
import { content } from '../content/contactInfo';
import { CONTACT_EDIT } from '../constants';

const ContactInfoReview = ({ data, editPage }) => {
  const editRef = useRef(null);

  useEffect(
    () => {
      if (
        window.sessionStorage.getItem(CONTACT_EDIT) === 'true' &&
        editRef?.current
      ) {
        // focus on edit button _after_ editing and returning
        window.sessionStorage.removeItem(CONTACT_EDIT);
        setTimeout(() => focusElement(editRef.current));
      }
    },
    [editRef],
  );

  const { veteran } = data;

  const { email = '', homePhone = {}, mobilePhone = {}, address = {} } =
    veteran || {};
  const isUS = address.addressType !== ADDRESS_TYPES.international;
  const stateOrProvince = isUS ? 'state' : 'province';

  // Label: formatted value in (design) display order
  const display = [
    [content.home, () => getFormattedPhone(homePhone)],
    [content.mobile, () => getFormattedPhone(mobilePhone)],
    [
      content.email,
      () =>
        email || (
          <span className="usa-input-error-message">
            {content.missingEmail}
          </span>
        ),
    ],
    [content.country, () => address.countryName],
    [content.address1, () => address.addressLine1],
    [content.address2, () => address.addressLine2],
    [content.address3, () => address.addressLine3],
    [content.city, () => address.city],
    [content[stateOrProvince], () => address[isUS ? 'stateCode' : 'province']],
    [
      content.postal,
      () => address[isUS ? 'zipCode' : 'internationalPostalCode'],
    ],
  ];

  const handlers = {
    onEditPage: () => {
      // maintain state using session storage
      window.sessionStorage.setItem(CONTACT_EDIT, 'true');
      editPage();
    },
  };

  const list = display
    .map(([label, getValue], index) => {
      const value = getValue() || '';
      return value ? (
        <div key={label + index} className="review-row">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ) : null;
    })
    .filter(Boolean);

  return (
    <div className="form-review-panel-page">
      <Element name="confirmContactInformationScrollElement" />
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          {content.title}
        </h4>
        <va-button
          ref={editRef}
          onClick={handlers.onEditPage}
          id="confirmContactInformationEdit"
          class="edit-page"
          label={content.editLabel}
          text={content.edit}
          secondary
        />
      </div>
      {list.length ? <dl className="review">{list}</dl> : null}
    </div>
  );
};

ContactInfoReview.propTypes = {
  data: PropTypes.shape({
    veteran: PropTypes.shape({
      email: PropTypes.string,
      homePhone: PropTypes.shape({}),
      mobilePhone: PropTypes.shape({}),
      address: PropTypes.shape({}),
    }),
  }),
  editPage: PropTypes.func,
};

export default ContactInfoReview;
