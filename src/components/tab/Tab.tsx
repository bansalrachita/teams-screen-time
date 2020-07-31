import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useGetChannelByTeams } from '../../utils/useGetChannelsByTeams';
import { CustomPieChart } from '../charts/CustomPieCharts';
import { CustomDropdown } from '../dropdown/CustomDropdown';
import { useTeamsContext } from '../../utils/useThemeContext';
import { Flex, Header, Loader } from '@fluentui/react-northstar';
import { CustomBarChart } from '../charts/CustomBarChart';
import { ActivityHours } from '../charts/ActivityHours';
import { getPieChartData } from '../../utils/getPieChartData';
import { getBarChartData } from '../../utils/getBarChartData';
import { useGetUserData } from '../../utils/useGetUserData';
import { Team } from '../../utils';

const inputTimeItems = ['Today', 'yesterday', 'Last 7 days', 'Last 30 days'];
/**
 * The 'PersonalTab' component renders the main tab content
 * of your app.
 */
export const Tab: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team>();
  const [selectedTime, setSelectedTime] = useState();
  const { data: teamsAndChannelsData } = useGetChannelByTeams();
  const [context] = useTeamsContext();
  let userId = (context && context['userObjectId']) ?? '';
  const { data: usersData, fetchResult: fetchUserData } = useGetUserData(
    userId
  );
  console.log('usersData: ', usersData);
  const usersTeamsData = usersData?.teams;

  useEffect(() => {
    if (!usersData && teamsAndChannelsData) {
      fetchUserData(teamsAndChannelsData);
    }
  }, [fetchUserData, usersData, teamsAndChannelsData]);

  const channelsPieChartData = useMemo(
    () => getPieChartData(usersTeamsData, selectedTeam),
    [usersTeamsData, selectedTeam]
  );

  const channelsBarChartData = useMemo(
    () => getBarChartData(usersTeamsData, selectedTeam),
    [usersTeamsData, selectedTeam]
  );

  const onChangeTeam = useCallback(
    (data) => {
      setSelectedTeam(data.value);
    },
    [setSelectedTeam]
  );

  const onChangeTime = useCallback(
    (data) => {
      setSelectedTime(data.value);
    },
    [setSelectedTime]
  );

  if (!teamsAndChannelsData) {
    return (
      <Flex vAlign="center" hAlign="center" styles={{ heihgt: '100%' }}>
        <Loader />
      </Flex>
    );
  }

  return (
    <Flex styles={{ padding: '30px' }} column>
      <Header content="Channel activity" />
      <Flex gap="gap.medium">
        <CustomDropdown
          inputItems={teamsAndChannelsData}
          uniqueKey="displayName"
          placeholder="Select a team"
          clearable
          value={selectedTeam}
          onChange={onChangeTeam}
        />
        <CustomDropdown
          inputItems={inputTimeItems}
          placeholder="Select a time"
          clearable
          value={selectedTime}
          onChange={onChangeTime}
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
