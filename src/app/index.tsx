// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReadingResponsesApp } from './ReadingResponsesApp';

import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();

const rootDiv: HTMLElement = document.getElementById('root') as HTMLElement;
ReactDOM.render(<ReadingResponsesApp />, rootDiv);