// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React, { useEffect } from 'react';
import { useGetMessagesByChannel } from '../../utils';
import { useGetChannelByTeams } from '../../utils/useGetChannelsByTeams';
import { CustomPieChart } from '../charts/CustomPieCharts';
import { CustomDropdown } from '../drop-down/CustomDropDown';
import { useTeamsContext } from '../../utils/useThemeContext';
import { Flex } from '@fluentui/react-northstar';

/**
 * The 'PersonalTab' component renders the main tab content
 * of your app.
 */
export const Tab: React.FC = () => {
  const { data, fetchData } = useGetMessagesByChannel();
  const { data: teamsAndChannelsData } = useGetChannelByTeams();
  const [context] = useTeamsContext();
  // const {
  //   fetchResult: fetchAllMessageByChatId,
  //   data: allMessages,
  // } = useGetAllMessagesByChatId();

  // const { fetchResult: fetchAllChats, data: allChats } = useGetAllMyChats();
  console.log('data: ', data);
  // console.log('allChats: ', allChats);
  // console.log('allMessages: ', allMessages);

  useEffect(() => {
    if (!data && teamsAndChannelsData) {
      fetchData(teamsAndChannelsData);
      // fetchAllChats();
      // fetchAllMessageByChatId(
      //   '19:0b736906-3bd6-48bd-bf88-3abc6858c145_0baf191e-9901-42d4-b832-7021145caa61@unq.gbl.spaces'
      // );
    }
  }, [fetchData, data, teamsAndChannelsData]);

  let userName =
    context && Object.keys(context).length > 0 ? context['upn'] : '';

  return (
    <Flex styles={{ padding: '30px' }}>
      <Flex gap="gap.medium">
        <CustomDropdown />
        <CustomDropdown />
      </Flex>
      <CustomPieChart />
    </Flex>
  );
};
