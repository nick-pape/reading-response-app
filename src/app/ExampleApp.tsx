import * as React from 'react';

declare function getVersions(): {
    node: string;
};

/**
 * This React component renders the application page.
 */
export class ExampleApp extends React.Component {
  public render(): React.ReactNode {
    const appStyle: React.CSSProperties = {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '5px',
      width: '400px'
    };

    return (
      <div style={{ padding: '20px' }}>
        <div style={appStyle}>
          <h2>Hello, world!</h2>
          Here is an example control!
          {getVersions().node}
        </div>
      </div>
    );
  }
}