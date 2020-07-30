import { ChannelsAndTeams } from './useGetChannelsByTeamId';
import { useEffect, useCallback } from 'react';
import { useGetMessagesByChannel } from './useGetMessagesByChannel';
import { useGetAllMyChats } from './useGetAllMyChats';
import { useGetAllMessagesByChatId } from './useGetAllMessagesByChatId';
import { User } from './deriveUserData';

export const useGetUserData = (
  userObjectId: string
): {
  data?: User;
  fetchResult: (teamsAndChannelsData: ChannelsAndTeams[]) => Promise<void>;
} => {
  const {
    data: channelUserData,
    fetchData: fetchChannelMessages,
  } = useGetMessagesByChannel();
  const { fetchResult: fetchAllChats, data: allChats } = useGetAllMyChats();
  const {
    fetchResult: fetchAllMessageByChatId,
    data,
  } = useGetAllMessagesByChatId(userObjectId);

  const fetchUserData = useCallback(
    async (teamsAndChannelsData: ChannelsAndTeams[]) => {
      if (!channelUserData && teamsAndChannelsData) {
        fetchChannelMessages(teamsAndChannelsData);
        fetchAllChats();
      }
    },
    [fetchChannelMessages, channelUserData, fetchAllChats]
  );

  useEffect(() => {
    if (channelUserData && allChats) {
      fetchAllMessageByChatId(allChats);
    }
  }, [channelUserData, allChats, fetchAllMessageByChatId]);

  return { data, fetchResult: fetchUserData };
};
