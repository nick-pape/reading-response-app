import * as React from 'react';
import { ReadingResponse } from '../harness/api/ReadingResponse';

export interface IReadingResponseViewerProps {
    response: ReadingResponse | undefined;
}

export function ReadingResponseViewer(props: IReadingResponseViewerProps) {
    if (!props.response) {
        return <p>Load a reading response dump file and select a response.</p>;
    }

    return <>
        <h2>{props.response.username}</h2>
        <p>{props.response.text}</p>
    </>;
}