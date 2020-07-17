// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React, { useEffect } from 'react';
import './App.css';
import * as microsoftTeams from '@microsoft/teams-js';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { microsoftTeamsSDK } from '../utils';
import Privacy from './Privacy';
import TermsOfUse from './TermsOfUse';
import { Tab } from './Tab';

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export const App: React.FC = () => {
  useEffect(() => {
    microsoftTeamsSDK.initialize();
    // microsoftTeams.initialize();
  }, []);

  // Check for the Microsoft Teams SDK object.
  if (microsoftTeams) {
    console.log('accessToken: ', microsoftTeamsSDK.getAccessToken());
    // Set app routings that don't require microsoft Teams
    // SDK functionality.  Show an error if trying to access the
    // Home page.
    if (window.parent === window.self) {
      return (
        <Router>
          <Route exact path="/privacy" component={Privacy} />
          <Route exact path="/termsofuse" component={TermsOfUse} />
          <Route exact path="/tab" component={TeamsHostError} />
        </Router>
      );
    }

    // Display the app home page hosted in Teams
    return (
      <Router>
        <Route exact path="/tab" component={Tab} />
      </Router>
    );
  }

  // Error when the Microsoft Teams SDK is not found
  // in the project.
  return <h3>Microsoft Teams SDK not found.</h3>;
};

/**
 * This component displays an error message in the
 * case when a page is not being hosted within Teams.
 */
class TeamsHostError extends React.Component {
  render() {
    return (
      <div>
        <h3 className="Error">Teams client host not found.</h3>
      </div>
    );
  }
}
