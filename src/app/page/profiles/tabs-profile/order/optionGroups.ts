export interface IOptionValue {
  controlName: string[];
  controlGroupName: string;
  isDate: boolean;
}

export interface IOptionGroups {
  groupName: string;
  option: {
    value: IOptionValue;
    viewValue: string;
  }[];
}


export const optionGroups: IOptionGroups[] = [
  {
    groupName: 'PAGE.PROFILES.TABS_PROFILE.ORDER.OPTION_GROUPS.ALL_SEARCH',
    option: [
      {
        value: { controlName: [ 'all' ], controlGroupName: 'all', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.OPTION_GROUPS.ALL'
      },
    ]
  },
  {
    groupName: 'PAGE.PROFILES.TABS_PROFILE.ORDER.OPTION_GROUPS.POS',
    option: [
      {
        value: { controlName: [ 'distrRecloc', 'recloc' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.POS.REC_LOC'
      },
      {
        value: { controlName: [ 'gds' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.POS.GDS'
      },
      {
        value: { controlName: [ 'posId' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.POS.POS_ID'
      },
      {
        value: { controlName: [ 'agency' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.POS.AGENCY'
      },
      {
        value: { controlName: [ 'termId' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.POS.TERMINAL'
      },
      {
        value: { controlName: [ 'country' ], controlGroupName: 'pos', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.POS.COUNTRY'
      },
    ]
  },
  {
    groupName: 'PAGE.PROFILES.TABS_PROFILE.ORDER.OPTION_GROUPS.SEGMENTS',
    option: [
      {
        value: { controlName: [ 'arrPoint' ], controlGroupName: 'segments', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SEGMENTS.ARR_POINT'
      },
      {
        value: { controlName: [ 'depTime' ], controlGroupName: 'segments', isDate: true },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SEGMENTS.DEP_TIME'
      },
      {
        value: { controlName: [ 'depPoint' ], controlGroupName: 'segments', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SEGMENTS.DEP_POINT'
      },
      {
        value: { controlName: [ 'arrTime' ], controlGroupName: 'segments', isDate: true },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SEGMENTS.ARR_TIME'
      },
      {
        value: { controlName: [ 'flight' ], controlGroupName: 'segments', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SEGMENTS.FLIGHT'
      },
      {
        value: { controlName: [ 'cabin' ], controlGroupName: 'segments', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SEGMENTS.CABIN'
      },
      {
        value: { controlName: [ 'rbd' ], controlGroupName: 'segments', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SEGMENTS.RBD'
      },
      {
        value: { controlName: [ 'status' ], controlGroupName: 'segments', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SEGMENTS.STATUS'
      },
    ]
  },
  {
    groupName: 'PAGE.PROFILES.TABS_PROFILE.ORDER.OPTION_GROUPS.TICKETS',
    option: [
      {
        value: { controlName: [ 'segment', 'arrPoint' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.TICKETS.ARR_POINT'
      },
      {
        value: { controlName: [ 'segment', 'depTime' ], controlGroupName: 'tickets', isDate: true },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.TICKETS.DEP_TIME'
      },
      {
        value: { controlName: [ 'segment', 'depPoint' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.TICKETS.DEP_POINT'
      },
      {
        value: { controlName: [ 'segment', 'arrTime' ], controlGroupName: 'tickets', isDate: true },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.TICKETS.ARR_TIME'
      },
      {
        value: { controlName: [ 'ticket' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.TICKETS.NUM_DER_TICKET'
      },
      {
        value: { controlName: [ 'coupon' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.TICKETS.COUPON'
      },
      {
        value: { controlName: [ 'FareCode' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.TICKETS.FARE_CODE'
      },
      {
        value: { controlName: [ 'couponStatus' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.TICKETS.STATUS'
      },
      {
        value: { controlName: [ 'PtkSellType' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.TICKETS.SELL_TYPE'
      },
      {
        value: { controlName: [ 'IdSellCountry' ], controlGroupName: 'tickets', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.TICKETS.SELL_COUNTRY'
      },
    ]
  },
  {
    groupName: 'PAGE.PROFILES.TABS_PROFILE.ORDER.OPTION_GROUPS.SERVICES',
    option: [
      {
        value: { controlName: [ 'emdType' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.SVC_TYPE'
      },
      {
        value: { controlName: [ 'segment', 'arrPoint' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.ARR_POINT'
      },
      {
        value: { controlName: [ 'segment', 'depTime' ], controlGroupName: 'services', isDate: true },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.DEP_TIME'
      },
      {
        value: { controlName: [ 'segment', 'depPoint' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.DEP_POINT'
      },
      {
        value: { controlName: [ 'segment', 'arrTime' ], controlGroupName: 'services', isDate: true },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.ARR_TIME'
      },
      {
        value: { controlName: [ 'segment', 'flight' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.FLIGHT'
      },
      {
        value: { controlName: [ 'status' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.STATUS'
      },
      {
        value: { controlName: [ 'nos' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.NOS.NAME_SERVICES'
      },
      {
        value: { controlName: [ 'text' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.NOS.COMMENT'
      },
      {
        value: { controlName: [ 'rfisc' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.RFISC'
      },
      {
        value: { controlName: [ 'ssr' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.SSR'
      },
      {
        value: { controlName: [ 'emd', 'coupon' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.COUPON'
      },
      {
        value: { controlName: [ 'emdType' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.EMD_TYPE'
      },
      {
        value: { controlName: [ 'couponStatus' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.COUPON_STATUS'
      },
      {
        value: { controlName: [ 'emd', 'num' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.EMD'
      },
      {
        value: { controlName: [ 'qtty' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.QTTY'
      },

      {
        value: { controlName: [ 'PtkSellType' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.SELL_TYPE'
      },
      {
        value: { controlName: [ 'IdSellCountry' ], controlGroupName: 'services', isDate: false },
        viewValue: 'PAGE.PROFILES.TABS_PROFILE.ORDER.EXPANSION.TEMPLATE.SERVICES.SELL_COUNTRY'
      },
    ]
  }
];



















