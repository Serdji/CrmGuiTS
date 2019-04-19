export interface IPrivileges {
  'result': {
    'customerId': number;
    'saleDate': string;
    'flightDate': string;
    'price': number;
    'recLoc': string;
    'discountSum': number;
    'departureLocationCode': string;
    'arrivalLocationCode': string;
    'externalDiscountSourceName': string;
    'externalDiscountStatusName': string;
    'coupon': number;
    'ticket': string;
  }[];
}
