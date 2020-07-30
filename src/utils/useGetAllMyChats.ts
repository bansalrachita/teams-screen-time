import { useAuthenticationContext } from '../components/authentication-context/AuthenticationContext';
import { useState, useCallback } from 'react';
import { Chat } from './deriveUserData';

export const useGetAllMyChats = () => {
  const accessToken = useAuthenticationContext();
  const [data, setData] = useState<Chat[]>();
  const [error, setError] = useState<string | undefined>();

  const fetchResult = useCallback(async () => {
    try {
      const response = await fetch(
        'https://graph.microsoft.com/beta/me/chats',
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
        setData(data.value);
      } else {
        setError('Something went wrong.');
      }
    } catch (error) {
      setError(error.message);
    }
  }, [accessToken]);

  return { fetchResult, data, error };
};
