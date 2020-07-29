import { useGetAllMyJoinedTeams } from './useGetAllMyJoinedTeams';
import { useEffect } from 'react';
import { useGetChannelsByTeamId } from './useGetChannelsByTeamId';

export const useGetChannelByTeams = () => {
  const { data: teamsList, fetchResult } = useGetAllMyJoinedTeams();
  const {
    data: channelsList,
    error: channelsListError,
    fetchResult: fetchChannelsByTeamId,
  } = useGetChannelsByTeamId();

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  useEffect(() => {
    if (teamsList) {
      fetchChannelsByTeamId(teamsList);
    }
  }, [teamsList, fetchChannelsByTeamId]);

  return { data: channelsList, error: channelsListError };
};
