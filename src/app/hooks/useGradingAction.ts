import * as React from 'react';
import { ReadingResponse } from '../../harness/api/ReadingResponse';
import { Gradebook } from '../../harness/api/Gradebook';
import { IResponseCounts, NOT_GRADED_KEY } from './useMergedListItems';
import { Electron } from '../ipc/Electron';
import { Selection } from '@fluentui/react';

export interface IUseGradingActionProps {
    selectedResponse: ReadingResponse | undefined;
    gradebookData: Gradebook | undefined;
    counts: IResponseCounts;
    selection: Selection;
    setGradebookData: (gradebook: Gradebook) => void;
}

export function useGradingAction(props: IUseGradingActionProps): {
    onGraded: (grade: number) => void
} {
    const { selection, selectedResponse, gradebookData, counts, setGradebookData } = props;

    const onGraded = React.useCallback(async (grade: number) => {
        if (selectedResponse && gradebookData) {
            console.log(selectedResponse.username, grade);

            const alreadyHadGrade = gradebookData.grades.get(selectedResponse.username) !== undefined;

            gradebookData.grades.set(selectedResponse.username, grade);
            const newGradebook = new Gradebook({ grades: gradebookData.grades });
            setGradebookData(newGradebook);

            // move to whatever item will be in this spot
            if (!alreadyHadGrade && counts[NOT_GRADED_KEY] !== 1) {
                const selectedItems = selection.getSelectedIndices();
                const currentIndex = selectedItems[0];
                const items = selection.getItems();
                const nextIndex = Math.max(0, Math.min(items.length - 1, currentIndex + 1));
                const newKey = items[nextIndex].key as string;
                selection.setKeySelected(selectedResponse.username, false, false);
                selection.setKeySelected(newKey, true, false);
            }

            await Electron.saveGrades(newGradebook);
        }
    }, [selectedResponse, gradebookData, setGradebookData, selection]);

    return { onGraded }
}