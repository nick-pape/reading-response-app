import * as React from 'react';
import { ReadingResponses } from '../harness/api/ReadingResponses';
import { Electron } from './ipc/Electron';

import {
    Stack,
    SelectionMode,
    GroupedList,
    Selection,
    DetailsRow,
    IGroup,
    SelectionZone,
    Text
} from '@fluentui/react';
import { Gradebook } from '../harness/api/Gradebook';
import { ReadingResponse } from '../harness/api/ReadingResponse';

import { AppCommandBar } from './components/AppCommandBar';
import { GradeButtons } from './components/GradeButtons';
import { ResponseView } from './components/ResponseView';
import { GRADE_OPTIONS } from './config/GradeOptions';



const NOT_GRADED_KEY: 'Not Graded' = 'Not Graded';
const NO_CREDIT_KEY: 'No Credit' = 'No Credit';
const PARTIAL_CREDIT_KEY: 'Partial Credit' = 'Partial Credit';
const FULL_CREDIT_KEY: 'Full Credit' = 'Full Credit';

interface IResponseCounts {
    [NOT_GRADED_KEY]: number;
    [NO_CREDIT_KEY]: number;
    [PARTIAL_CREDIT_KEY]: number;
    [FULL_CREDIT_KEY]: number;
}

const GROUP_KEYS: Set<string> = new Set<string>([NOT_GRADED_KEY, NO_CREDIT_KEY, PARTIAL_CREDIT_KEY, FULL_CREDIT_KEY]);

/**
 * This React component renders the application page.
 */
export function App(): React.ReactElement {
    const [responses, setResponses] = React.useState<ReadingResponses | undefined>(undefined);
    const [selectedResponse, setSelectedResponse] = React.useState<ReadingResponse | undefined>(undefined);
    const [gradebookData, setGradebookData] = React.useState<Gradebook | undefined>(undefined);

    const usernames = React.useMemo(() => {
        if (responses && gradebookData) {
            const list = [...responses.responses.keys()].map((username) => {
                return {
                    key: username,
                    username,
                    grade: gradebookData.grades.get(username)
                };
            });

            // Sort the list by grade
            list.sort((a, b) => {
                // Check for undefined grades
                if (a.grade === undefined && b.grade === undefined) {
                    return a.username > b.username ? 1 : -1;
                } else if (a.grade === undefined) {
                    return -1;
                } else if (b.grade === undefined) {
                    return 1;
                } else {
                    // Compare numeric grades
                    if (a.grade === b.grade) {
                        return a.username > b.username ? 1 : -1;
                    }
                    return a.grade - b.grade;
                }
            });

            return list;
        }
        return undefined;
    }, [responses, gradebookData]);

    const counts: IResponseCounts = React.useMemo(() => {
        const count: IResponseCounts = {
            [NOT_GRADED_KEY]: 0,
            [NO_CREDIT_KEY]: 0,
            [PARTIAL_CREDIT_KEY]: 0,
            [FULL_CREDIT_KEY]: 0
        };

        if (!usernames) {
            return count;
        }

        usernames.map(item => {
            if (item.grade === undefined) {
                count[NOT_GRADED_KEY] += 1;
            } else if (item.grade === 1.0) {
                count[FULL_CREDIT_KEY] += 1;
            } else if (item.grade === 0.0) {
                count[NO_CREDIT_KEY] += 1;
            } else {
                count[PARTIAL_CREDIT_KEY] += 1;
            }
        });

        return count;
    }, [usernames]);

    // Create two groups: 'In Gradebook' and 'Not In Gradebook'
    const groups = React.useMemo(() => {
        let indexSoFar: number = 0;

        return [NOT_GRADED_KEY, NO_CREDIT_KEY, PARTIAL_CREDIT_KEY, FULL_CREDIT_KEY].reduce((prev: IGroup[], key: string) => {
            const count = counts[key as keyof IResponseCounts];
            if (count !== 0) {
                prev.push({
                    key,
                    name: key,
                    startIndex: indexSoFar,
                    count
                });
                indexSoFar += count;
            }
            return prev;
        }, [] as IGroup[]);
    }, [usernames, counts]);

    // Create a selection object to keep track of selected items
    const selection = React.useMemo(() =>
        new Selection({
            onSelectionChanged: () => {
                const selected = selection.getSelection();

                if (selected.length === 0) {
                    setSelectedResponse(undefined);
                } else {
                    const response = responses?.responses.get(selected[0].key as string);
                    setSelectedResponse(response);
                }
            },
            canSelectItem: (item, index) => {
                return !GROUP_KEYS.has(item.key as string);
            },
            selectionMode: SelectionMode.multiple,
         }
    ), [setSelectedResponse, responses]);

    React.useEffect(() => {
        selection.setItems(usernames || [], false);
    }, [usernames, selection]);

    const onRenderCell = React.useCallback((
        nestingDepth?: number,
        item?: string,
        itemIndex?: number,
        group?: IGroup,
    ) => (
        <DetailsRow
            columns={[
                {
                    key: 'username',
                    name: 'User',
                    fieldName: 'username',
                    minWidth: 200,
                }
            ]}
            groupNestingDepth={nestingDepth}
            item={item}
            itemIndex={itemIndex!}
            selection={selection}
            selectionMode={SelectionMode.single}
            compact={true}
            group={group}
        />
    ), [selection]);

    const groupList = React.useMemo(() => {
        return usernames ?
            <SelectionZone selection={selection} selectionMode={SelectionMode.single}>
                <GroupedList
                    items={usernames}
                    onRenderCell={onRenderCell}
                    groups={groups}
                    selectionMode={SelectionMode.single}
                    selection={selection} // Pass the selection object
                    compact
                />
                </SelectionZone>
            : <Text variant='small'>Please load a reading response file...</Text>
    }, [usernames, selection, groups])

    const onLoadFile = React.useCallback(() => {
        Electron.openFile().then((data) => {
            setResponses(data.responses);
            setGradebookData(data.grades)
        }).catch(() => { })
    }, [setResponses, setGradebookData]);

    const onNextClicked = React.useCallback(() => {
        if (usernames) {
            const indices = selection.getSelectedIndices();
            const currentIndex = indices[0];
            let nextIndex = currentIndex + 1;

            if (nextIndex === usernames.length) {
                nextIndex = 0; 
            }

            selection.setIndexSelected(currentIndex, false, false);
            selection.setIndexSelected(nextIndex, true, true);
        }
    }, [usernames, selection]);

    const onBackClicked = React.useCallback(() => {
        if (usernames) {
            const indices = selection.getSelectedIndices();
            const currentIndex = indices[0];
            let nextIndex = currentIndex - 1;

            if (nextIndex === -1) {
                nextIndex = usernames.length - 1; 
            }

            selection.setIndexSelected(currentIndex, false, false);
            selection.setIndexSelected(nextIndex, true, true);
        }
    }, [usernames, selection]);

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