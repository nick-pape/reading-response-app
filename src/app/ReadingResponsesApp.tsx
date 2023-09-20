import * as React from 'react';
import { ReadingResponses } from '../harness/api/ReadingResponses';
import { Electron } from './Electron';

import {
    Stack,
    SelectionMode,
    GroupedList,
    Selection,
    DetailsList,
    DetailsRow,
    IGroup,
    SelectionZone
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

    const usernames = React.useMemo(() => {
        if (responses) {
            
            return [...responses.responses.keys()].map((username) => {
                return { key: username, username };
            });
        }
        return undefined;
    }, [responses]);

    const [gradebookData, setGradebookData] = React.useState<Gradebook>(new Gradebook());

    // Create two groups: 'In Gradebook' and 'Not In Gradebook'
    const groups = [
        /*{
            key: 'Graded',
            name: 'Graded',
            startIndex: gradebookData.grades.size,
            count: (usernames?.length || 0) - gradebookData.grades.size,
        },*/
        {
            key: 'NotGraded',
            name: `Not Graded`,
            startIndex: 0,
            count: usernames?.length || 0,
        },
    ];

    // Create a selection object to keep track of selected items
    
    const selection = React.useMemo(() => {
        const selection = new Selection({
            onSelectionChanged: () => {
                // Handle selection changes here, if needed
                const selectedItems = selection.getSelection();
                console.log(selectedItems, "ewgergre");

                if (selectedItems.length === 1) {
                    setSelectedResponse(responses?.responses.get(selectedItems[0].key as string));
                } else if (selectedItems.length === 0) {
                    setSelectedResponse(undefined);
                }

            },
        });

        if (usernames) {
            selection.setItems(usernames);
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
                    onLoadFile={() => {
                        Electron.openFile().then((data) => {
                            setResponses(data);
                        }).catch(() => { })
                    }}
                    onReview={() => {}}
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
                    : <span>Please load a reading response file...</span>
                    }
                </div>

                {/* Second Column */}
                <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'lightgreen' }}>
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
                    grade={selectedResponse ? gradebookData.grades.get(selectedResponse.username) : undefined}
                    onGraded={(grade: number) => {
                        if (selectedResponse) {
                            console.log(selectedResponse.username, grade);
                            gradebookData.grades.set(selectedResponse.username, grade);
                            setGradebookData(new Gradebook({ grades: gradebookData.grades }));
                        }
                    }}
                />
            </div>
        </Stack>

    );
}