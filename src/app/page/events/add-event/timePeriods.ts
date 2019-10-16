import * as moment from 'moment';

interface ITimePeriods {
  [ key: string ]: {
    seconds: number,
    index: number,
    formatTime: string,
  };
}

export const timePeriods: ITimePeriods = {
  '5min': {
    seconds: moment.duration(5, 'm').asSeconds(),
    index: 1,
    formatTime: '5м',
  },
  '10min': {
    seconds: moment.duration(10, 'm').asSeconds(),
    index: 2,
    formatTime: '10м',
  },
  '15min': {
    seconds: moment.duration(15, 'm').asSeconds(),
    index: 3,
    formatTime: '15м',
  },
  '30min': {
    seconds: moment.duration(30, 'm').asSeconds(),
    index: 4,
    formatTime: '30м',
  },
  '60min': {
    seconds: moment.duration(60, 'm').asSeconds(),
    index: 5,
    formatTime: '60м',
  },
  '3hours': {
    seconds: moment.duration(3, 'h').asSeconds(),
    index: 6,
    formatTime: '3ч',
  },
  '6hours': {
    seconds: moment.duration(6, 'h').asSeconds(),
    index: 7,
    formatTime: '6ч',
  },
  '8hours': {
    seconds: moment.duration(8, 'h').asSeconds(),
    index: 8,
    formatTime: '8ч',
  },
  '12hours': {
    seconds: moment.duration(10, 'h').asSeconds(),
    index: 9,
    formatTime: '12ч',
  },
  '24hours': {
    seconds: moment.duration(24, 'h').asSeconds(),
    index: 10,
    formatTime: '24ч',
  },
};