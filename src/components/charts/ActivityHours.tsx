import React from 'react';
import { Grid, Flex, Header } from '@fluentui/react-northstar';

const getContent = (data: number[]) => {
  const min = Math.min(...data, 0);
  const max = Math.max(...data, 0);

  const range = Math.max(max - min, 1);

  const brightness = getBrightness(range);

  return Array(7 * 24)
    .fill('')
    .map((_value, index) => {
      return (
        <Flex
          key={`flexItem-${index}`}
          styles={{
            margin: '3px',
            background: `${brightness(data[index])}`,
            msGridColumn: (index + 1) % 7 === 0 ? 1 : (index + 1) % 7,
            msGridRow: Math.floor((index + 1) / 24),
            outline: '1px solid rgba(27,31,35,.04)',
          }}
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
  .map((_, index) => <span key={`$rowHeader-${index}`}>Day {index}</span>);

interface ActivityHours {
  data: number[];
}

const getBrightness = (range: number) => (value: number): string => {
  const opacity = value ? Math.max((value * 1.0) / range, 0.2) : 0;
  console.log('opacity: ', opacity, range);
  return value ? `rgba(136, 132, 216, ${opacity})` : `rgb(235, 237, 240)`;
};

export const ActivityHours: React.FC<ActivityHours> = ({ data }) => {
  console.log('data: ', data);
  return (
    <>
      <div>
        <Header content="Active hours" />
      </div>
      <Grid
        content={colHeader}
        style={{
          gridTemplateColumns: 'repeat(24, 50px)',
          msGridColumns: '(50px)[24]',
          width: '80%',
          margin: '0 auto',
        }}
      />
      <Grid
        style={{
          gridTemplateColumns: 'repeat(24, 50px)',
          msGridColumns: '(50px)[24]',
          height: '200px',
          width: '80%',
          margin: '0 auto',
        }}
        columns={24}
        content={getContent(data)}
      />
    </>
  );
};
