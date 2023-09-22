import * as React from 'react';
import { FontWeights, IconButton, Modal, mergeStyleSets } from '@fluentui/react';

// eslint-disable-next-line @rushstack/typedef-var
const contentStyles = mergeStyleSets({
    container: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'stretch',
    },
    header: [
      {
        flex: '1 1 auto',
        borderTop: `4px solid #0078d4`,
        display: 'flex',
        alignItems: 'center',
        fontWeight: FontWeights.semibold,
        padding: '12px 12px 14px 24px',
      },
    ],
    heading: {
      fontWeight: FontWeights.semibold,
      fontSize: 'inherit',
      margin: '0',
    },
    body: {
      flex: '4 4 auto',
      padding: '0 24px 24px 24px',
      overflowY: 'hidden',
      selectors: {
        p: { margin: '14px 0' },
        'p:first-child': { marginTop: 0 },
        'p:last-child': { marginBottom: 0 },
      },
    },
  });

export interface IReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ReviewModal(props: IReviewModalProps): React.ReactElement {
    const { isOpen, onClose } = props;
    return <Modal
        isOpen={isOpen}
        onDismiss={onClose}
        isBlocking={false}
        containerClassName={contentStyles.container}
    >
        <div className={contentStyles.header}>
            <h2 className={contentStyles.heading}>
                Review & Submit
            </h2>
            <IconButton
                iconProps={{ iconName: 'Cancel' }}
                ariaLabel="Close popup modal"
                onClick={onClose}
            />
        </div>
        <div className={contentStyles.body}>
            Still working on this. =)
        </div>
    </Modal>
};