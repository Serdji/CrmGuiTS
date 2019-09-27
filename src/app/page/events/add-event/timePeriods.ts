interface ITimePeriods {
  [ key: string ]: {
    seconds: number,
    index: number,
    formatTime: string,
  };
}

export const timePeriods: ITimePeriods = {
  '5min': {
    seconds: 300,
    index: 1,
    formatTime: '5м',
  },
  '10min': {
    seconds: 600,
    index: 2,
    formatTime: '10м',
  },
  '15min': {
    seconds: 900,
    index: 3,
    formatTime: '15м',
  },
  '30min': {
    seconds: 1800,
    index: 4,
    formatTime: '30м',
  },
  '60min': {
    seconds: 3600,
    index: 5,
    formatTime: '60м',
  },
  '3hours': {
    seconds: 10800,
    index: 6,
    formatTime: '3ч',
  },
  '6hours': {
    seconds: 21600,
    index: 7,
    formatTime: '6ч',
  },
  '8hours': {
    seconds: 28800,
    index: 8,
    formatTime: '8ч',
  },
  '12hours': {
    seconds: 43200,
    index: 9,
    formatTime: '12ч',
  },
  '24hours': {
    seconds: 86400,
    index: 10,
    formatTime: '24ч',
  },
};