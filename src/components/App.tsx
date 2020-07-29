import * as React from 'react';
import './App.css';
import * as microsoftTeams from '@microsoft/teams-js';
import { BrowserRouter as Router, Route, RouteProps } from 'react-router-dom';
import { Tab } from './tab/Tab';
import { AuthenticationStart } from './authentication/AuthenticationStart';
import { AuthenticationEnd } from './authentication/AuthenticationEnd';
import { AuthenticationProvider } from './authentication-context/AuthenticationContext';
import { Provider } from '@fluentui/react-northstar';
import { useTeamsTheme } from '../utils';

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export const App: React.FC = () => {
  const { theme } = useTeamsTheme();

  // Check for the Microsoft Teams SDK object.
  if (microsoftTeams) {
    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize();

    // Display the app home page hosted in Teams
    return (
      <Router>
        <Provider theme={theme}>
          <Route exact path="/authend" component={AuthenticationEnd} />
          <Route exact path="/authstart" component={AuthenticationStart} />
          <ProtectedRoute exact path="/tab" component={Tab} />
        </Provider>
      </Router>
    );
  }

  // Error when the Microsoft Teams SDK is not found
  // in the project.
  return <h3>Microsoft Teams SDK not found.</h3>;
};

interface ProtectedRouteProps extends RouteProps {}

/**
 * This component displays an error message in the
 * case when a page is not being hosted within Teams.
 */
export const ProtectedRoute = (props: ProtectedRouteProps) => {
  return (
    <AuthenticationProvider>
      <Route {...props} />
    </AuthenticationProvider>
  );
};

/**
 * This component displays an error message in the
 * case when a page is not being hosted within Teams.
 */
// class TeamsHostError extends React.Component {
//   render() {
//     return (
//       <div>
//         <h3 className="Error">Teams client host not found.</h3>
//       </div>
//     );
//   }
// }
