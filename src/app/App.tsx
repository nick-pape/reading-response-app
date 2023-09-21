import * as React from 'react';
import { ReadingResponses } from '../harness/api/ReadingResponses';

import { Stack } from '@fluentui/react';
import { Gradebook } from '../harness/api/Gradebook';
import { ReadingResponse } from '../harness/api/ReadingResponse';

import { AppCommandBar } from './components/AppCommandBar';
import { GradeButtons } from './components/GradeButtons';
import { ResponseView } from './components/ResponseView';
import { GRADE_OPTIONS } from './config/GradeOptions';
import { NOT_GRADED_KEY, useMergedListItems } from './hooks/useMergedListItems';
import { useGroupedList } from './hooks/useGroupedList';
import { useCommandBarActions } from './hooks/useCommandBarActions';
import { useGradingAction } from './hooks/useGradingAction';

/**
 * This React component renders the application page.
 */
export function App(): React.ReactElement {
    const [responses, setResponses] = React.useState<ReadingResponses | undefined>(undefined);
    const [selectedResponse, setSelectedResponse] = React.useState<ReadingResponse | undefined>(undefined);
    const [gradebookData, setGradebookData] = React.useState<Gradebook | undefined>(undefined);

    const { userListItems, counts, groups } = useMergedListItems({ responses, gradebookData });
    const { selection, groupList } = useGroupedList({ userListItems, groups, responses, setSelectedResponse });
    const { onLoadFile, onNextClicked, onBackClicked } = useCommandBarActions({ selection, setGradebookData, setResponses });
    const { onGraded } = useGradingAction({ selection, counts, selectedResponse, gradebookData, setGradebookData });

    const noop = React.useCallback(() => {

    }, []);

    return (
        <Stack
            verticalAlign="stretch"
            styles={{ root: { height: '100vh' } }}
        >
            {/* Top Row */}
            <div style={{ height: '50px'  }}>
                <AppCommandBar
                    hasLoadedFile={!!responses}
                    isReviewEnabled={counts[NOT_GRADED_KEY] === 0}
                    onLoadFile={onLoadFile}
                    onReview={noop}
                    onNext={onNextClicked}
                    onBack={onBackClicked}
                />
            </div>

            {/* Middle Row */}
            <Stack
                horizontal
                grow
                styles={{ root: { overflowY: 'hidden', height: 'inherit' } }}
            >
                {/* First Column */}
                <div style={{ width: '250px', overflowY: 'scroll' }}>
                    {groupList}
                </div>

                {/* Second Column */}
                <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'lightgrey' }}>
                    <ResponseView
                        response={selectedResponse}
                    />
                </div>
            </Stack>

            {/* Bottom Row */}
            <div>
                <GradeButtons
                    gradeOptions={GRADE_OPTIONS}
                    disabled={!selectedResponse}
                    grade={selectedResponse && gradebookData ? gradebookData.grades.get(selectedResponse.username) : undefined}
                    onGraded={onGraded}
                />
            </div>
        </Stack>
    );
}