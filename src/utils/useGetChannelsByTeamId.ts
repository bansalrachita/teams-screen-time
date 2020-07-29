import { useAuthenticationContext } from '../components/authentication-context/AuthenticationContext';
import { useState, useCallback } from 'react';
import { Team, Channel } from './deriveUserData';

export interface ChannelsAndTeams {
  id: string;
  displayName?: string;
  value: Channel[];
}

export const useGetChannelsByTeamId = () => {
  const accessToken = useAuthenticationContext();
  const [data, setData] = useState<ChannelsAndTeams[]>();
  const [error, setError] = useState<string | undefined>();

  const fetchchannelsByTeamId = useCallback(
    async (teamId: string) => {
      try {
        const response = await fetch(
          `https://graph.microsoft.com/v1.0/teams/${teamId}/channels`,
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
          return await response.json();
        } else {
          throw new Error('Something went wrong.');
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    [accessToken]
  );

  const fetchResult = useCallback(
    async (teamsList: Team[]) => {
      const channelQueries = [];
      const data: ChannelsAndTeams[] = [];

      for (let teamId of teamsList) {
        channelQueries.push(fetchchannelsByTeamId(teamId.id));
      }

      Promise.allSettled(channelQueries).then((results) => {
        for (let i = 0; i < results.length; ++i) {
          const result = results[i];
          if (result.status === 'fulfilled') {
            data.push({
              value: result.value.value,
              id: teamsList[i].id,
              displayName: teamsList[i].displayName,
            });
          } else {
            setError(result.reason);
          }
        }
        setData(data);
      });
    },
    [fetchchannelsByTeamId]
  );

  return { fetchResult, data, error };
};
