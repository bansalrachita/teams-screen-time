import { useAuthenticationContext } from '../components/authentication-context/AuthenticationContext';
import { useState, useCallback } from 'react';
import { deriveUserData, User, users } from './deriveUserData';
import { ChannelsAndTeams } from './useGetChannelsByTeamId';

// 3. Get the server side token and use it to call the Graph API
export const useGetMessagesByChannel = () => {
  const accessToken = useAuthenticationContext();
  const [data, setData] = useState<{ [id: string]: User }>();
  const [error, setError] = useState<string | undefined>();

  const fetchMessagesByChannelIdAndTeamId = useCallback(
    async ({ teamId, channelId, teamName, channelName }) => {
      try {
        const response = await fetch(
          `https://graph.microsoft.com/beta/teams/${teamId}/channels/${decodeURIComponent(
            channelId
          )}/messages`,
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
          deriveUserData(data, { teamName, channelName });
        } else {
          throw new Error('Something went wrong.');
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    [accessToken]
  );

  const fetchMessages = useCallback(
    (channelAndTeams: ChannelsAndTeams[]) => {
      const queries = [];
      for (let team of channelAndTeams) {
        for (let channel of team.value) {
          queries.push(
            fetchMessagesByChannelIdAndTeamId({
              teamId: team.id,
              channelId: channel.id,
              channelName: channel.displayName,
              teamName: team.displayName,
            })
          );
        }
      }

      Promise.allSettled(queries).then((results) => {
        console.log('results: ', results);
        for (let result of results) {
          if (result.status === 'rejected') {
            setError(result.reason);
          }
        }
        setData(users);
      });
    },
    [fetchMessagesByChannelIdAndTeamId]
  );

  return { data, error, fetchData: fetchMessages };
};
