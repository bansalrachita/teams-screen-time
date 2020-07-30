import { Team } from './deriveUserData';

export interface ChartData {
  name: string;
  metaData: string;
  value: number;
}

export const getPieChartData = (
  teams: { [id: string]: Team } = {}
): ChartData[] => {
  return Object.keys(teams).reduce((acc: ChartData[], key: string) => {
    for (let channel in teams[key].channels) {
      const channelObj = teams[key].channels;

      acc.push({
        name: channelObj?.[channel].displayName,
        value: channelObj?.[channel].totalActiveHours,
        metaData: teams[key].displayName,
      });
    }

    return acc;
  }, []);
};
