import * as React from 'react';
import { ReadingResponse } from '../../harness/api/ReadingResponse';
import { default as markdownIt } from 'markdown-it';
import { MessageBar, MessageBarType, Text } from '@fluentui/react';
import 'markdown-it-katex/node_modules/katex/dist/katex.min.css'; // Import KaTeX CSS for styling
const markdownItKatex: markdownIt.PluginSimple = require('markdown-it-katex');

const MarkDown: markdownIt = markdownIt({
    breaks: true,
    linkify: false, // turn this on after getting an ipc event setup
    typographer: true
}).use(markdownItKatex);

export interface IReadingResponseViewerProps {
    response: ReadingResponse | undefined;
    parseError: string | undefined;
    closeParseError: () => void;
}

export function ResponseView(props: IReadingResponseViewerProps): React.ReactElement {
    const markdown = React.useMemo(() => {
        if (!props.response) {
            return '';
        }

        return MarkDown.render(props.response.text);
    }, [props.response]);

    if (props.parseError) {
        return <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={true}
            onDismiss={props.closeParseError}
            dismissButtonAriaLabel="Close"
        >
            <strong>An error ocurred parsing the responses file.</strong>
            <p>
                {props.parseError}
            </p>
        </MessageBar>
    }

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
        <Text
            style={{
                position: 'relative',
                top: '0',
                bottom: '0'
            }}
            >
            <span dangerouslySetInnerHTML={{ __html: markdown }} />
        </Text>
    </>;
}