import * as React from 'react';
import teamsAuthentication from '../../utils/authentication';
import { Loader, Flex } from '@fluentui/react-northstar';

const AuthenticationContext = React.createContext<string | undefined>(
  undefined
);

export const useAuthenticationContext = () =>
  React.useContext(AuthenticationContext);

interface AuthenticationProvideProps {}

export const AuthenticationProvider: React.FC<AuthenticationProvideProps> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = React.useState<string | undefined>(
    teamsAuthentication.getAccessToken()
  );

  React.useEffect(() => {
    teamsAuthentication.initialize(setAccessToken);
  }, []);

  if (!teamsAuthentication.getAccessToken()) {
    return (
      <Flex vAlign="center" hAlign="center" styles={{ heihgt: '100%' }}>
        <Loader />
      </Flex>
    );
  }

  return (
    <AuthenticationContext.Provider value={accessToken}>
      {children}
    </AuthenticationContext.Provider>
  );
};
