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
import { AppFooter } from './AppFooter';

import { useConst } from '@fluentui/react-hooks';
import { ReadingResponse } from '../harness/api/ReadingResponse';

/**
 * This React component renders the application page.
 */
export function ExampleApp() {
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

    const [gradebookData] = React.useState<Gradebook>(new Gradebook());

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
                    { !!selectedResponse ?
                    <>
                        <h2>{selectedResponse.username}</h2>
                        <p>{selectedResponse.text}</p>
                    </>
                    :<>
                        <h2>Main Container</h2>
                        <p>Main content goes here.</p>
                    </>
                    }
                </div>
            </Stack>

            {/* Bottom Row */}
            <div style={{ height: '50px' }}>
                <AppFooter />
            </div>
        </Stack>

    );
}