import * as React from 'react';
import { ReadingResponses } from '../harness/api/ReadingResponses';
import { Electron } from './Electron';

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
import { AppCommandBar } from './AppCommandBar';
import { AppFooter, IGradeOptions } from './AppFooter';

import { ReadingResponse } from '../harness/api/ReadingResponse';
import { ReadingResponseViewer } from './ReadingResponseViewer';

const gradeOptions: Array<IGradeOptions> = [
    {
        grade: 0.0,
        description: "The response was blank, completely irrelevant, or appeared to be AI generated."
    },
    {
        grade: 0.4,
        description: "The response was on topic but did not reference the chapter."
    },
    {
        grade: 0.6,
        description: "The response covered the chapter but lacked a lot of detail."
    },
    {
        grade: 0.8,
        description: "The response covered the chapter but lacked some detail."
    },
    {
        grade: 1.0,
        description: "The response covered the entire chapter with sufficient detail."
    }
]


/**
 * This React component renders the application page.
 */
export function ReadingResponsesApp() {
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
                    return 0;
                } else if (a.grade === undefined) {
                    return -1;
                } else if (b.grade === undefined) {
                    return 1;
                } else {
                    // Compare numeric grades
                    return a.grade - b.grade;
                }
            });

            return list;
        }
        return undefined;
    }, [responses, gradebookData]);

    const countUngraded = React.useMemo(() => {
        if (!usernames) {
            return 0;
        }

        return usernames.reduce((count, item) => {
            if (item.grade === undefined) {
                return count + 1;
            } else {
                return count;
            }
        }, 0);
    }, [usernames]);

    // Create two groups: 'In Gradebook' and 'Not In Gradebook'
    const groups = React.useMemo(() => {
        if (!usernames) {
            return [];
        }

        const groups = [];

        if (countUngraded !== 0) {
            groups.push({
                key: 'NotGraded',
                name: 'Not Graded',
                startIndex: 0,
                count: countUngraded
            });
        }

        if (countUngraded !== usernames.length) {
            groups.push({
                key: 'Graded',
                name: `Graded`,
                startIndex: countUngraded,
                count: usernames.length - countUngraded
            });
        }

        return groups;
    }, [usernames, countUngraded]);

    // Create a selection object to keep track of selected items
    
    const selection = React.useMemo(() => {
        const selection = new Selection({
            canSelectItem: (item, index) => {
                return item.key !== 'NotGraded' && item.key !== 'Graded';
            },

            onSelectionChanged: () => {
                // Handle selection changes here, if needed
                const selectedItems = selection.getSelection();

                if (selectedItems.length === 1) {
                    setSelectedResponse(responses?.responses.get(selectedItems[0].key as string));
                } else if (selectedItems.length === 0) {
                    setSelectedResponse(undefined);
                }

            },
            selectionMode: SelectionMode.single
        });

        if (usernames) {
            selection.setItems(usernames);
            selection.setIndexSelected(0, true, true);
        }

        return selection;
    }, [usernames]);

    return (

        <Stack
            verticalAlign="stretch"
            styles={{ root: { height: '100vh' } }}
        >
            {/* Top Row */}
            <div style={{ height: '50px'  }}>
                <AppCommandBar
                    hasLoadedFile={!!responses}
                    onLoadFile={() => {
                        Electron.openFile().then((data) => {
                            setResponses(data.responses);
                            setGradebookData(data.grades)
                        }).catch(() => { })
                    }}
                    onReview={() => {}}
                    onNext={() => {
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
                    }}
                    onBack={() => {
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
                    }}
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
                    {usernames ?
                        <SelectionZone selection={selection} selectionMode={SelectionMode.single}>
                        <GroupedList
                            items={usernames}
                            onRenderCell={(
                                nestingDepth?: number,
                                item?: string,
                                itemIndex?: number,
                                group?: IGroup,
                            )=> (
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
                            )}
                            groups={groups}
                            selectionMode={SelectionMode.single}
                            selection={selection} // Pass the selection object
                            compact
                        />
                        </SelectionZone>
                    : <Text variant='small'>Please load a reading response file...</Text>
                    }
                </div>

                {/* Second Column */}
                <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'lightgrey' }}>
                    <ReadingResponseViewer
                        response={selectedResponse}
                    />
                </div>
            </Stack>

            {/* Bottom Row */}
            <div>
                <AppFooter
                    gradeOptions={gradeOptions}
                    disabled={!selectedResponse}
                    grade={selectedResponse && gradebookData ? gradebookData.grades.get(selectedResponse.username) : undefined}
                    onGraded={async (grade: number) => {
                        if (selectedResponse && gradebookData) {
                            console.log(selectedResponse.username, grade);
                            gradebookData.grades.set(selectedResponse.username, grade);
                            const newGradebook = new Gradebook({ grades: gradebookData.grades });
                            setGradebookData(newGradebook);
                            await Electron.saveGrades(newGradebook);
                        }
                    }}
                />
            </div>
        </Stack>
    );
}