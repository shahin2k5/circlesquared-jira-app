import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ForgeUI, { render, IssueGlance, Text } from "@forge/ui";
import '@atlaskit/css-reset';

ReactDOM.render(
  <IssueGlance>
    <App />
  </IssueGlance>,
  document.getElementById('root')
);
