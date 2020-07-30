import { useAuthenticationContext } from '../components/authentication-context/AuthenticationContext';
import { useState, useCallback } from 'react';
import { Chat, users, User, deriveChatUserData } from '../utils/deriveUserData';

export const useGetAllMessagesByChatId = (userObjectId: string) => {
  const accessToken = useAuthenticationContext();
  const [data, setData] = useState<User>();
  const [error, setError] = useState<string | undefined>();

  const fetchResultByChatId = useCallback(
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
          deriveChatUserData(data, userObjectId);
        } else {
          throw new Error('Something went wrong.');
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    [accessToken, userObjectId]
  );

  const fetchResult = useCallback(
    async (chatList: Chat[]) => {
      const chatQueries = [];
      for (let chatId of chatList) {
        chatQueries.push(fetchResultByChatId(chatId.id));
      }

      Promise.allSettled(chatQueries).then((results) => {
        for (let i = 0; i < results.length; ++i) {
          const result = results[i];
          if (result.status === 'rejected') {
            setError(result.reason);
          }
        }
        setData(users[userObjectId]);
      });
    },
    [fetchResultByChatId, userObjectId]
  );

  return { fetchResult, data, error };
};
