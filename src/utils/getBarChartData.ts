import { Team } from './deriveUserData';

export interface UserBarChartData {
  name: string;
  teamName: string;
  totalReadHours: number;
  totalWriteHours: number;
}

export const getBarChartData = (
  teams: { [id: string]: Team } = {}
): UserBarChartData[] => {
  return Object.keys(teams).reduce((acc: UserBarChartData[], key: string) => {
    for (let channel in teams[key].channels) {
      const channelObj = teams[key].channels;
      const teamName = teams[key].displayName;

      acc.push({
        teamName,
        name: channelObj?.[channel].displayName,
        totalReadHours:
          channelObj?.[channel].totalActiveHours -
          channelObj?.[channel].totalActiveHours,
        totalWriteHours: channelObj?.[channel].totalWriteHours,
      });
    }

    return acc;
  }, []);
};
