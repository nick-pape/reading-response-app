import * as React from 'react';
import { Selection } from '@fluentui/react';

import { Electron } from '../ipc/Electron';
import { ReadingResponses } from '../../harness/api/ReadingResponses';
import { Gradebook } from '../../harness/api/Gradebook';

export interface IUseCommandBarActionsProps {
    setResponses: (responses: ReadingResponses | undefined) => void;
    setGradebookData: (gradebook: Gradebook | undefined) => void;
    setIsReviewMode: (isReviewMode: boolean) => void;
    setParseError: (parseError: string | undefined) => void;
    selection: Selection;
}

export function useCommandBarActions(props: IUseCommandBarActionsProps): {
    onLoadFile: () => void
    onNextClicked: () => void
    onBackClicked: () => void,
    onReviewMode: () => void
} {
    const { setResponses, setGradebookData, setIsReviewMode, setParseError, selection } = props;

    const onLoadFile = React.useCallback(() => {
        Electron.openFile().then((data) => {
            setResponses(data.responses);
            setGradebookData(data.grades);
            setParseError(data.parseError);
        }).catch(() => { })
    }, [setResponses, setGradebookData]);

    const onNextClicked = React.useCallback(() => {
        if (selection.getItems().length) {
            const indices = selection.getSelectedIndices();
            const currentIndex = indices[0];
            let nextIndex = currentIndex + 1;

            if (nextIndex === selection.getItems().length) {
                nextIndex = 0; 
            }

            selection.setIndexSelected(currentIndex, false, false);
            selection.setIndexSelected(nextIndex, true, true);
        }
    }, [selection]);

    const onBackClicked = React.useCallback(() => {
        if (selection.getItems().length) {
            const indices = selection.getSelectedIndices();
            const currentIndex = indices[0];
            let nextIndex = currentIndex - 1;

            if (nextIndex === -1) {
                nextIndex = selection.getItems().length - 1; 
            }

            selection.setIndexSelected(currentIndex, false, false);
            selection.setIndexSelected(nextIndex, true, true);
        }
    }, [selection]);

    const onReviewMode = React.useCallback(() => {
        setIsReviewMode(true);
    }, []);

    return {
        onLoadFile,
        onNextClicked,
        onBackClicked,
        onReviewMode
    };
}