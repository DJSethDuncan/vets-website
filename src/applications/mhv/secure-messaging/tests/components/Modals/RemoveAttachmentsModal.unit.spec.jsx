import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import RemoveAttachmentsModal from '../../../components/Modals/RemoveAttachmentModal';
import { Prompts } from '../../../util/constants';

describe('Remove Message Modal component', () => {
  it('should render without errors', () => {
    const screen = render(<RemoveAttachmentsModal visible />);
    const modal = screen.getByTestId('remove-attachment-modal');

    expect(modal).to.exist;
    expect(screen.getByText(Prompts.Attachment.REMOVE_ATTACHMENT_CONTENT)).to
      .exist;
    expect(modal).to.have.attribute(
      'modal-title',
      `${Prompts.Attachment.REMOVE_ATTACHMENT_TITLE}`,
    );
    expect(modal).to.have.attribute('primary-button-text', 'Remove');
    expect(modal).to.have.attribute('secondary-button-text', 'Cancel');
    expect(modal).to.have.attribute('status', 'warning');
  });
});
