import { Team } from './deriveUserData';

export interface UserBarChartData {
  name: string;
  teamName: string;
  totalReadHours: number;
  totalWriteHours: number;
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
          totalReadHours:
            channelObj?.[channel].totalActiveHours -
            channelObj?.[channel].totalWriteHours,
          totalWriteHours: channelObj?.[channel].totalWriteHours,
        });
      }

      return acc;
    },
    []
  );
};
