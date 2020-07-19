// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React, { useState, useEffect } from 'react';
import './App.css';
import * as microsoftTeams from '@microsoft/teams-js';
import { microsoftTeamsSDK } from '../utils';

/**
 * The 'PersonalTab' component renders the main tab content
 * of your app.
 */
export const Tab: React.FC = () => {
  useEffect(() => {
    microsoftTeamsSDK.initialize();
  }, []);

  const [context, setContext] = useState<microsoftTeams.Context | undefined>();

  //React lifecycle method that gets called once a component has finished mounting
  //Learn more: https://reactjs.org/docs/react-component.html#componentdidmount
  useEffect(() => {
    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((context: microsoftTeams.Context) => {
      setContext(context);
    });
    // Next steps: Error handling using the error object
  }, []);

  let userName =
    context && Object.keys(context).length > 0 ? context['upn'] : '';

  return (
    <div>
      <h1>Congratulations {userName}!</h1>{' '}
      <h3>This is the tab you made :-))</h3>
    </div>
  );
};
