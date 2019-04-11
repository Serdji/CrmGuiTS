export interface IPrivileges {
  'result': {
    'customerId': number;
    'saleDate': string;
    'flightDate': string;
    'price': number;
    'discountSum': number;
    'departureLocationCode': string;
    'arrivalLocationCode': string;
    'externalDiscountSourceName': string;
    'externalDiscountStatusName': string;
  }[];
}
