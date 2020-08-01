import React from 'react';
import { Grid, Flex, Header, Tooltip, Text } from '@fluentui/react-northstar';
import moment from 'moment';

const getContent = (data: number[]) => {
  const min = Math.min(...data, 0);
  const max = Math.max(...data, 0);

  const range = Math.max(max - min, 1);

  const brightness = getBrightness(range);
  return Array(7 * 24)
    .fill('')
    .map((_value, index) => {
      return (
        <Tooltip
          key={`flexItem-${index}`}
          trigger={
            <Flex
              styles={{
                margin: '3px',
                background: `${brightness(data[index])}`,
                msGridColumn: (index + 1) % 7 === 0 ? 1 : (index + 1) % 7,
                msGridRow: Math.floor((index + 1) / 24),
                outline: '1px solid rgba(27,31,35,.04)',
              }}
            />
          }
          content={
            <Flex column>
              <Text
                content={`Active hours on ${moment
                  .utc(new Date())
                  .subtract(index, 'hours')
                  .format('LL')}:`}
              />
              <Text
                weight="semibold"
                content={`${data[index]?.toFixed(2) ?? 0} mins`}
              />
            </Flex>
          }
        />
      );
    });
};

const colHeader = Array(24)
  .fill(0)
  .map((_, index) => (
    <Flex hAlign="center" key={`$colHeader-${index}`}>
      {index}
    </Flex>
  ));

const colRows = Array(7)
  .fill(0)
  .map((_, index) => (
    <Text
      content={`${moment
        .utc(new Date())
        .subtract(index, 'days')
        .format('dddd')
        .substring(0, 3)}`}
    />
  ));

interface ActivityHours {
  data: number[];
}

const getBrightness = (range: number) => (value: number): string => {
  const opacity = value ? Math.max((value * 1.0) / range, 0.2) : 0;
  return value ? `rgba(136, 132, 216, ${opacity})` : `rgb(235, 237, 240)`;
};

export const ActivityHours: React.FC<ActivityHours> = ({ data }) => {
  return (
    <Flex column fill>
      <Flex column>
        <Header content="Active hours" />
        <Text content="Time spent over the last week that includes personal/group chats and engagement in channels across teams." />
      </Flex>
      <Flex column>
        <Grid
          content={colHeader}
          style={{
            gridTemplateColumns: 'repeat(24, 30px)',
            msGridColumns: '(30px)[24]',
            width: '50%',
            marginLeft: '125px',
            paddingTop: '30px',
          }}
        />
        <Flex>
          <Grid
            style={{
              gridTemplateRows: 'repeat(7, 30px)',
              msGridRows: '(30px)[7]',
              height: '200px',
              width: '35px',
            }}
            rows={7}
            content={colRows}
          />
          <Grid
            style={{
              gridTemplateColumns: 'repeat(24, 30px)',
              msGridColumns: '(30px)[24]',
              height: '200px',
              width: '50%',
              marginLeft: '90px',
            }}
            columns={24}
            content={getContent(data)}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
