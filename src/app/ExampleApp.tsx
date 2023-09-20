import * as React from 'react';
import { ReadingResponses } from '../harness/api/ReadingResponses';
import { Electron } from './Electron';

import {
    Stack,
    SelectionMode,
    GroupedList
} from '@fluentui/react';
import { Gradebook } from '../harness/api/Gradebook';
import { AppCommandBar } from './AppCommandBar';
import { AppFooter } from './AppFooter';

/**
 * This React component renders the application page.
 */
export function ExampleApp() {
    const [responses, setResponses] = React.useState<ReadingResponses | undefined>(undefined);

    const usernames = React.useMemo(() => {
        if (responses) {
            return [...responses.responses.keys()];
        }
        return undefined;
    }, [responses]);

    const [gradebookData] = React.useState<Gradebook>(new Gradebook());

    // Create two groups: 'In Gradebook' and 'Not In Gradebook'
    const groups = [
        {
            key: 'Graded',
            name: 'Graded',
            startIndex: gradebookData.grades.size,
            count: (usernames?.length || 0) - gradebookData.grades.size,
        },
        {
            key: 'NotGraded',
            name: 'Not Graded',
            startIndex: 0,
            count: gradebookData.grades.size,
        },
    ];

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
                <div style={{ width: '200px', overflowY: 'scroll', backgroundColor: 'lightblue' }}>
                    {usernames ?
                        <GroupedList
                            items={usernames}
                            onRenderCell={(nestingDepth, item, index) => (
                                <div>
                                    <span>{item}</span>
                                    <span style={{ marginLeft: '10px' }}>{gradebookData.grades.get(item)}</span>
                                </div>
                            )}
                            groupProps={{
                                onRenderHeader: (props) => (
                                    <div>
                                        <b>{props?.group?.name}</b>
                                    </div>
                                ),
                            }}
                            groups={groups}
                            selectionMode={SelectionMode.single}
                            compact
                        />
                    : <span>Please load a reading response file...</span>
                    }
                </div>

                {/* Second Column */}
                <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'lightgreen' }}>
                    <h2>Main Container</h2>
                    <p>Main content goes here.</p>
                </div>
            </Stack>

            {/* Bottom Row */}
            <div style={{ height: '50px' }}>
                <AppFooter />
            </div>
        </Stack>

    );
}