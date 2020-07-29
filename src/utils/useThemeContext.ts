import { useEffect, useState } from 'react';

export const useTeamsContext = () => {
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

  return [context];
};
