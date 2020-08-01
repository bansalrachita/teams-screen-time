import { Team } from './deriveUserData';

export interface UserBarChartData {
  name: string;
  teamName: string;
  totalReadTime: number;
  totalWriteTime: number;
}

export const getBarChartData = (
  teams: { [id: string]: Team } = {},
  selectedTeam?: Team
): UserBarChartData[] => {
  const teamsToIterate = selectedTeam
    ? { [selectedTeam.id]: teams[selectedTeam.id] }
    : teams;

  return Object.keys(teamsToIterate).reduce(
    (acc: UserBarChartData[], key: string) => {
      for (let channel in teamsToIterate[key]?.channels) {
        const channelObj = teamsToIterate[key]?.channels;
        const teamName = teamsToIterate[key].displayName;

        acc.push({
          teamName,
          name: channelObj?.[channel].displayName,
          totalReadTime:
            channelObj?.[channel].totalActiveHours -
            channelObj?.[channel].totalWriteTime,
          totalWriteTime: channelObj?.[channel].totalWriteTime,
        });
      }

      return acc;
    },
    []
  );
};
