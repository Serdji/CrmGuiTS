export const order = {
  'IdBooking': 16898822,
  'airline': 'FV',
  'lut': '20190915T102943.0000',
  'recloc': '203D96',
  'createDate': '2019-08-30',
  'BookingStatus': 'Active',
  'distrRecloc': [
    {
      'recloc': '5M689K',
      'system': '1H'
    }
  ],
  'pos': [
    {
      'agency': '68СПТ',
      'country': 'CY',
      'gds': '1H',
      'posId': '19500003'
    }
  ],
  'segments': [
    {
      'arrPoint': 'BCN',
      'arrTime': '20190915T200000',
      'bookTime': '20190830T082531',
      'cabin': 'Y',
      'depPoint': 'VKO',
      'depTime': '20190915T164500',
      'flight': 'FV-5731',
      'ns': 5,
      'rbd': 'Y',
      'segNum': 1,
      'segType': 'Inv',
      'status': 'HK'
    }
  ],
  'services': [
    {
      'airline': 'TK',
      'emd': {
        'coupon': 1,
        'num': '1954001029084',
        'amount': 2.573000000000000e+003,
        'Currency': 'RUB',
        'AmountCur': 2.573000000000000e+003,
        'AmountUsd': 3.893867561000000e+001,
        'AmountEur': 3.527377160000000e+001
      },
      'emdType': 'A',
      'nos': 'SPACE PLUS UPPER DECK B744',
      'passNum': 1,
      'point': '',
      'qtty': 1,
      'rfic': 'A',
      'rfisc': '042',
      'segNum': 1,
      'ssr': 'SEAT',
      'status': 'HI',
      'couponStatus': 'F',
      'FareCode': 'BGTOUR'
    }, {
      'airline': 'FV',
      'emd': {
        'coupon': 1,
        'num': '1954001029093',
        'amount': 0.000000000000000e+000,
        'Currency': 'RUB',
        'AmountCur': 3.000000000000000e+002,
        'AmountUsd': 4.540071000000000e+000,
        'AmountEur': 4.112760000000000e+000
      },
      'emdType': 'S',
      'nos': 'TRIP INSURANCE                                                  ',
      'passNum': 1,
      'qtty': 1,
      'rfisc': '0BG',
      'segNum': 1,
      'couponStatus': 'O',
      'FareCode': 'BGTOUR'
    }
  ],
  'tickets': [
    {
      'coupon': 1,
      'passNum': 1,
      'segNum': 1,
      'ticket': '1952434439691',
      'couponStatus': 'F',
      'FareCode': 'BGTOUR'
    }
  ],
  'Fops': [
    {
      'ticket': '1952434439691',
      'Indicator': 3,
      'Code': 'MS',
      'Amount': 0.000000000000000e+000,
      'Currency': 'RUB',
      'AmountCur': 0.000000000000000e+000,
      'AmountUsd': 0.000000000000000e+000,
      'AmountEur': 0.000000000000000e+000,
      'FreeText': 'CH\/'
    }, {
      'emd': '1954001029084',
      'Indicator': 3,
      'Code': 'CC',
      'Amount': 2.573000000000000e+003,
      'Currency': 'RUB',
      'AmountCur': 2.573000000000000e+003,
      'AmountUsd': 3.893867561000000e+001,
      'AmountEur': 3.527377160000000e+001,
      'Vendor': 'VI',
      'AccountNum': '************6720',
      'AppCode': '294120',
      'ExpDate': '2019-12-01T00:00:00'
    }
  ],
  'MonetaryInfo': [
    {
      'ticket': '1952434439691',
      'Code': 'Y2',
      'Amount': 0.000000000000000e+000,
      'Currency': 'RUB',
      'AmountCur': 0.000000000000000e+000,
      'AmountUsd': 0.000000000000000e+000,
      'AmountEur': 0.000000000000000e+000
    }, {
      'ticket': '1952434439691',
      'Code': 'Y',
      'Amount': 0.000000000000000e+000,
      'Currency': 'EUR',
      'AmountCur': 0.000000000000000e+000,
      'AmountUsd': 0.000000000000000e+000,
      'AmountEur': 0.000000000000000e+000
    }, {
      'ticket': '1952434439691',
      'Code': 'T'
    }, {
      'ticket': '1952434439691',
      'Code': 'B'
    }, {
      'emd': '1954001029084',
      'Code': 'D',
      'Amount': 7.350000000000000e+001,
      'Currency': 'RUB',
      'AmountCur': 7.350000000000000e+001,
      'AmountUsd': 1.112317395000000e+000,
      'AmountEur': 1.007626200000000e+000
    }, {
      'emd': '1954001029084',
      'Code': 'T',
      'Amount': 2.573000000000000e+003,
      'Currency': 'RUB',
      'AmountCur': 2.573000000000000e+003,
      'AmountUsd': 3.893867561000000e+001,
      'AmountEur': 3.527377160000000e+001
    }, {
      'emd': '1954001029084',
      'Code': 'E',
      'Amount': 2.573000000000000e+003,
      'Currency': 'RUB',
      'AmountCur': 2.573000000000000e+003,
      'AmountUsd': 3.893867561000000e+001,
      'AmountEur': 3.527377160000000e+001
    }, {
      'emd': '1954001029084',
      'Code': 'B',
      'Amount': 3.500000000000000e+001,
      'Currency': 'EUR',
      'AmountCur': 2.572500000000000e+003,
      'AmountUsd': 3.864108220000000e+001,
      'AmountEur': 3.500000000000000e+001
    }
  ]
};

export type IOrder = typeof order;
