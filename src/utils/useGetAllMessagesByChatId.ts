import { useAuthenticationContext } from '../components/authentication-context/AuthenticationContext';
import { useState, useCallback } from 'react';

export const useGetAllMessagesByChatId = () => {
  const accessToken = useAuthenticationContext();
  const [data, setData] = useState();
  const [error, setError] = useState<string | undefined>();

  const fetchResult = useCallback(
    async (chatId: string) => {
      try {
        const response = await fetch(
          `https://graph.microsoft.com/beta/me/chats/${chatId}/messages`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              authorization: 'bearer ' + accessToken,
            },
            mode: 'cors',
            cache: 'default',
          }
        );
        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          setError('Something went wrong.');
        }
      } catch (error) {
        setError(error.message);
      }
    },
    [accessToken]
  );

  return { fetchResult, data, error };
};
