import React, { useEffect, useMemo } from 'react';
import { useGetChannelByTeams } from '../../utils/useGetChannelsByTeams';
import { CustomPieChart } from '../charts/CustomPieCharts';
import { CustomDropdown } from '../dropdown/CustomDropdown';
import { useTeamsContext } from '../../utils/useThemeContext';
import { Flex, Header } from '@fluentui/react-northstar';
import { CustomBarChart } from '../charts/CustomBarChart';
import { ActivityHours } from '../charts/ActivityHours';
import { getPieChartData } from '../../utils/getPieChartData';
import { getBarChartData } from '../../utils/getBarChartData';
import { useGetUserData } from '../../utils/useGetUserData';

const inputTimeItems = ['Today', 'yesterday', 'Last 7 days', 'Last 30 days'];
/**
 * The 'PersonalTab' component renders the main tab content
 * of your app.
 */
export const Tab: React.FC = () => {
  const { data: teamsAndChannelsData } = useGetChannelByTeams();
  const [context] = useTeamsContext();
  let userId = (context && context['userObjectId']) ?? '';
  const { data: usersData, fetchResult: fetchUserData } = useGetUserData(
    userId
  );
  const usersTeamsData = usersData?.teams;

  useEffect(() => {
    if (!usersData && teamsAndChannelsData) {
      fetchUserData(teamsAndChannelsData);
    }
  }, [fetchUserData, usersData, teamsAndChannelsData]);

  const channelsPieChartData = useMemo(() => getPieChartData(usersTeamsData), [
    usersTeamsData,
  ]);

  const channelsBarChartData = useMemo(() => getBarChartData(usersTeamsData), [
    usersTeamsData,
  ]);

  return (
    <Flex styles={{ padding: '30px' }} column>
      <Header content="Channel activity" />
      <Flex gap="gap.medium">
        <CustomDropdown
          inputItems={teamsAndChannelsData}
          uniqueKey="displayName"
          placeholder="Select a team"
        />
        <CustomDropdown
          inputItems={inputTimeItems}
          placeholder="Select a time"
          checkable
        />
      </Flex>
      <Flex gap="gap.medium" vAlign="center" hAlign="start">
        <CustomPieChart data={channelsPieChartData} />
        <CustomBarChart
          data={channelsBarChartData}
          stackDataKeys={['totalWriteHours', 'totalReadHours']}
        />
      </Flex>
      <ActivityHours data={usersData?.activeHours ?? []} />
    </Flex>
  );
};
