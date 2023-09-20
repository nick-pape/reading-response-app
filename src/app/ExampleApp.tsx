import * as React from 'react';
import { ReadingResponses } from '../harness/api/ReadingResponses';
import { Electron } from './Electron';

/**
 * This React component renders the application page.
 */
export function ExampleApp() {
    const appStyle: React.CSSProperties = {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '5px',
      width: '400px'
    };

    const [responses, setResponses] = React.useState<ReadingResponses | undefined>(undefined);

    const usernames = React.useMemo(() => {
        if (responses) {
            return [...responses.responses.keys()];
        }
        return [];
    }, [responses])

    return (
      <div style={{ padding: '20px' }}>
        <div style={appStyle}>
          <h2>Hello, world!</h2>
          <button
            onClick={() => Electron.openFile().then((data) => {
                setResponses(data);
            })}
          >
            Load
          </button>
          Here is an example control!
          {
            usernames.map((username) => {
                return <span>{username}</span>;
            })
          }
        </div>
      </div>
    );
}