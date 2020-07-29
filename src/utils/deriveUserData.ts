import moment from 'moment';

export interface Team {
  id: string;
  activeHours?: number;
  displayName?: string;
  channels: { [id: string]: Channel };
}

export interface Channel {
  id: string;
  activeHours: number[];
  name?: string;
}

export interface User {
  id: string;
  displayName?: string;
  createdTime?: string;
  channels?: { [id: string]: Channel };
  teams?: { [id: string]: Team };
  activeHours?: number[];
}

export const users: { [id: string]: User } = {};

const getHourOfDay = (time: string) => {
  const hourOfDayInUTC = moment(time).hours();
  return hourOfDayInUTC;
};

export const deriveUserData = (messageData: any) => {
  console.log('messageData: ', messageData);
  for (let element of messageData.value) {
    let user: User = {
      id: '',
    };
    const userId: string = element.from.user.id;
    const teamId: string = element.channelIdentity.teamId;
    const channelId: string = element.channelIdentity.channelId;
    const activeHour = getHourOfDay(
      element.lastModifiedDateTime ?? element.createdDateTime
    );

    // If user exists
    if (users[userId]) {
      user = users[userId];
    } else {
      user.id = userId;
      user.displayName = element.from.user.displayName;
      user.channels = {};
      user.teams = {};
      users[userId] = user;
    }

    // If team doesn't exist.
    if (user.teams && !user.teams?.[teamId]) {
      const activeHours = Array(24).fill(0);
      activeHours[activeHour] = 1;

      user.teams[teamId] = {
        activeHours: 0,
        id: teamId,
        channels: {
          [channelId]: {
            id: channelId,
            activeHours,
          },
        },
      };
      // If team exists but no channel.
    } else if (user.teams?.[teamId]) {
      const channel: Channel = user.teams[teamId].channels[channelId];

      if (!channel) {
        const activeHours = Array(24).fill(0);
        activeHours[activeHour] = 1;

        user.teams[teamId].channels[channelId] = {
          id: channelId,
          activeHours,
        };
        // if channel exists.
      } else {
        channel.activeHours[activeHour] = 1;
      }
    }
  }
};
