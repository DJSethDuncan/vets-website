import React from 'react';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

export default function CrisisPanel() {
  return (
    <div
      id="modal-crisisline"
      className="va-overlay va-modal va-modal-large"
      role="alertdialog"
    >
      <div className="va-crisis-panel va-modal-inner">
        <button
          aria-label="Close this modal"
          className="va-modal-close va-overlay-close va-crisis-panel-close"
          type="button"
        >
          <i
            className="fas fa-times-circle va-overlay-close"
            aria-hidden="true"
          />
        </button>

        <div className="va-overlay-body va-crisis-panel-body">
          <h3 className="va-crisis-panel-title">
            We’re here anytime, day or night – 24/7
          </h3>
          <p>
            If you are a Veteran in crisis or concerned about one, connect with
            our caring, qualified responders for confidential help. Many of them
            are Veterans themselves.
          </p>
          <ul className="va-crisis-panel-list">
            <li>
              <i
                className="fa fa-phone va-crisis-panel-icon"
                aria-hidden="true"
              />
              {
                // eslint-disable-next-line @department-of-veterans-affairs/prefer-telephone-component
                <a href="tel:988">
                  Call <strong>988 and select 1</strong>
                </a>
              }
            </li>
            <li>
              <i
                className="fa fa-mobile-alt va-crisis-panel-icon"
                aria-hidden="true"
              />
              <a href="sms:838255">
                Text <strong>838255</strong>
              </a>
            </li>
            <li>
              <i
                className="fa fa-comments va-crisis-panel-icon"
                aria-hidden="true"
              />
              <a
                className="no-external-icon"
                href="https://www.veteranscrisisline.net/get-help-now/chat/"
              >
                Start a confidential chat
              </a>
            </li>
            <li>
              <i
                className="fa fa-deaf va-crisis-panel-icon"
                aria-hidden="true"
              />
              <p>
                Call TTY if you have hearing loss
                <strong className="vads-u-margin-left--0p5">
                  <Telephone contact={CONTACTS.SUICIDE_PREVENTION_LIFELINE} />
                </strong>
              </p>
            </li>
          </ul>
          Get more resources at{' '}
          <a
            className="no-external-icon"
            href="https://www.veteranscrisisline.net/"
          >
            VeteransCrisisLine.net
          </a>
          .
        </div>
      </div>
    </div>
  );
}
