import moment from 'moment';

export interface Team {
  id: string;
  activeHours: number;
  displayName: string;
  channels: { [id: string]: Channel };
}

export interface Channel {
  id: string;
  totalActiveHours: number;
  totalWriteHours: number;
  activeHours: number[];
  displayName: string;
}

export interface User {
  id: string;
  displayName?: string;
  createdTime?: string;
  teams?: { [id: string]: Team };
  activeHours?: number[];
}

export interface ChatMessage {
  chatId: string;
  from: {
    user: {
      id: string;
      displayName: string;
    };
  };
  body: {
    content: string;
  };
}
export interface Chat {
  id: string;
  createdDateTime: string;
  value: ChatMessage[];
  lastUpdatedDateTime: string;
}

export const users: { [id: string]: User } = {};

const hourOfWeek = (time: string) => {
  const hourOfDayInUTC = moment(time).hours();
  const dayOftheWeek = moment(time).day();
  const hourOfTheWeek = 24 * dayOftheWeek + hourOfDayInUTC;
  return hourOfTheWeek;
};

export const deriveUserData = (
  messageData: any,
  metaData: { [name: string]: string },
  userObjectId: string
) => {
  const lastWeek = moment.utc(new Date()).subtract(1, 'week').format();

  for (let element of messageData.value) {
    // if (element.createdDateTime >= lastWeek) {
    let user: User = {
      id: '',
    };
    const userId: string = element.from.user.id;
    const teamId: string = element.channelIdentity.teamId;
    const channelId: string = element.channelIdentity.channelId;
    const activeHour = hourOfWeek(
      element.lastModifiedDateTime ?? element.createdDateTime
    );
    const message = element.body.content;
    const messageWriteTime = calculateMessageWriteTime(message);

    // If user exists
    if (users[userId]) {
      user = users[userId];
    } else {
      user.id = userId;
      user.displayName = element.from.user.displayName;
      user.teams = {};
      user.activeHours = Array(24 * 7).fill(0);
      users[userId] = user;
    }

    if (user.activeHours) {
      user.activeHours[activeHour] += messageWriteTime;
    }

    // If team doesn't exist.
    if (user.teams && !user.teams?.[teamId]) {
      const activeHours = Array(24 * 7).fill(0);
      activeHours[activeHour] = messageWriteTime;

      user.teams[teamId] = {
        activeHours: messageWriteTime,
        id: teamId,
        displayName: metaData.teamName,
        channels: {
          [channelId]: {
            id: channelId,
            activeHours,
            totalActiveHours: messageWriteTime,
            totalWriteHours: messageWriteTime,
            displayName: metaData.channelName,
          },
        },
      };
      // If team exists but no channel.
    } else if (user.teams?.[teamId]) {
      const channel: Channel = user.teams[teamId].channels[channelId];

      if (!channel) {
        const activeHours = Array(24 * 7).fill(0);
        activeHours[activeHour] = messageWriteTime;

        user.teams[teamId].activeHours += messageWriteTime;

        user.teams[teamId].channels[channelId] = {
          id: channelId,
          activeHours,
          totalActiveHours: messageWriteTime,
          totalWriteHours: messageWriteTime,
          displayName: metaData.channelName,
        };
        // if channel exists.
      } else if (!channel.activeHours[activeHour]) {
        user.teams[teamId].activeHours += messageWriteTime;
        channel.activeHours[activeHour] += messageWriteTime;
        channel.totalActiveHours += messageWriteTime;
        channel.totalWriteHours += messageWriteTime;
      }
    }
    // }
  }

  for (let element of messageData.value) {
    // if (element.createdDateTime >= lastWeek) {
    const userId: string = element.from.user.id;

    if (users[userId].id !== userObjectId) {
      const teamId: string = element.channelIdentity.teamId;
      const channelId: string = element.channelIdentity.channelId;
      const message = element.body.content;
      const messageReadTime = calculateMessageReadTime(message);
      // if there some user activity in the team and channel
      const userChannel =
        users[userObjectId]?.teams?.[teamId]?.channels?.[channelId];
      const userTeam = users[userObjectId]?.teams?.[teamId];

      if (userChannel && userTeam) {
        userChannel.totalActiveHours += messageReadTime;
        userTeam.activeHours += messageReadTime;
      }
    }
    // }
  }
};

const WORDS_READ_PER_MINUTE = 238;
const LETTERS_READ_PER_SECOND = (WORDS_READ_PER_MINUTE * 6) / 60; // Avg english letter is 5 to 6 letters long.
const WORDS_WRITE_PER_MINUTE = 40;
const LETTERS_WRITE_PER_SECOND = (WORDS_WRITE_PER_MINUTE * 6) / 60;

export const calculateMessageReadTime = (message: string) => {
  const messageLength = message.length; // TODO: very raw right now. Needs html text sanitization etc.
  const timeToReadMessage = messageLength / (LETTERS_READ_PER_SECOND * 60);

  return Math.round((timeToReadMessage + Number.EPSILON) * 100) / 100;
};

export const calculateMessageWriteTime = (message: string) => {
  const messageLength = message.length; // TODO: very raw right now. Needs html text sanitization etc.
  const timeToWriteMessage = messageLength / (LETTERS_WRITE_PER_SECOND * 60);

  return Math.round((timeToWriteMessage + Number.EPSILON) * 100) / 100;
};

export const deriveChatUserData = (chats: any, userObjectId: string) => {
  for (let element of chats.value) {
    if (!users?.[userObjectId]) {
      let user: User = {
        id: '',
      };
      const userId: string = element.from.user.id;
      user.id = userId;
      user.activeHours = Array(24 * 7).fill(0);
      users[userObjectId] = user;
    }

    const activeHour = hourOfWeek(
      element.lastModifiedDateTime ?? element.createdDateTime
    );

    const message = element.body.content;
    const from = element.from.user.id;
    const activeHours = users[userObjectId].activeHours;

    // same user? caculate write time.
    if (from === userObjectId && activeHours) {
      const messageWriteTime = calculateMessageWriteTime(message);
      activeHours[activeHour] += messageWriteTime;
    } else if (activeHours) {
      const messageReadTime = calculateMessageReadTime(message);
      activeHours[activeHour] += messageReadTime;
    }
  }
};
