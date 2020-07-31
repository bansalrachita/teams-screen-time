import { Team } from './deriveUserData';

export interface ChartData {
  name: string;
  metaData: string;
  value: number;
}

export const getPieChartData = (
  teams: { [id: string]: Team } = {},
  selectedTeam?: Team
): ChartData[] => {
  const teamsToIterate = selectedTeam
    ? { [selectedTeam.id]: teams[selectedTeam.id] }
    : teams;

  return Object.keys(teamsToIterate).reduce((acc: ChartData[], key: string) => {
    for (let channel in teamsToIterate[key].channels) {
      const channelObj = teamsToIterate[key].channels;

      acc.push({
        name: channelObj?.[channel].displayName,
        value: channelObj?.[channel].totalActiveHours,
        metaData: teamsToIterate[key].displayName,
      });
    }

    return acc;
  }, []);
};
