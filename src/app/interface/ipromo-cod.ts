export interface IPromoCod {
  result: {
    promoCodeId: number;
    promotionId: number;
    code: string;
    accountCode: number;
    description: string;
    reason: string;
    dateFrom: string;
    dateTo: string;
    flightDateFrom: string;
    flightDateTo: string;
    usesPerPerson: number;
    usesTotal: number;
    val: number;
    promoCodeValTypeId: number;
    promoCodeBrandList: string[];
    promoCodeFlightList: string[];
    promoCodeRbdList: string[];
    promoCodeRouteList: {
        dep_Location: string;
        arr_Location: string
      }[];
    customersIds: number[];
    customers: any;
    customerGroupsIds: number[];
    customerGroups: any;
    segmentationsIds: number[];
    segmentations: any;
  }[];
  totalCount: number;
};
