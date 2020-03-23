export interface IPromoCode {
  usedHostRecLoc?: {
    hostRecLoc: string;
    useDt: string;
  }[];
  usedHostRecLocTotalCount?: number;
  promoCodeId: number;
  promotionId: number;
  promotion: {
    promotionId: number;
    promotionName: string;
  };
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
  usesFact: number;
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
  title: string;
}


export interface IPromoCodes {
  result: IPromoCode[];
  totalCount: number;
};
