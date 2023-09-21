import * as React from 'react';
import { ReadingResponse } from '../harness/api/ReadingResponse';
import {default as markdownIt } from 'markdown-it';
import { Text } from '@fluentui/react';

const markdownItKatex = require('markdown-it-katex');
import 'markdown-it-katex/node_modules/katex/dist/katex.min.css'; // Import KaTeX CSS for styling

const MarkDown = markdownIt({
    breaks: true,
    linkify: false, // turn this on after getting an ipc event setup
    typographer: true
}).use(markdownItKatex);

export interface IReadingResponseViewerProps {
    response: ReadingResponse | undefined;
}

export function ReadingResponseViewer(props: IReadingResponseViewerProps) {
    const markdown = React.useMemo(() => {
        if (!props.response) {
            return '';
        }

        return MarkDown.render(props.response.text);
    }, [props.response]);

    if (!props.response) {
        return <></>;
    }

    return <>
        <Text
            variant='mediumPlus'
            styles={{
                root: {
                    textDecoration: 'underline'
                }
            }}
        >
            {props.response.username}
        </Text>
        <span
            style={{
                position: 'relative',
                top: '0',
                bottom: '0'
            }}
            dangerouslySetInnerHTML={{ __html: markdown }}
        />
    </>;
}