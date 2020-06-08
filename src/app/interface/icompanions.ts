export interface ICompanion {
  'result': ICompanions[];
}

export interface ICompanions {
  'customerId': number;
  'recLoc': string;
  'firstName': string;
  'secondName': string;
  'lastName': string;
  'dob': string;
  'ageGroup': string;
  'documentNumber': string;
  'orders': IOrders[];
}

interface IOrders {
  'bookingCreateDate': string;
  'recLoc': string;
  'coupons': ICoupons[];
}

interface ICoupons {
  'coupon': string;
  'depDate': string;
  'from': string;
  'ticketNum': string;
  'to': string;

}
