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
  'orders': ICompanionOrders[];
}

export interface ICompanionOrders {
  'bookingCreateDate': string;
  'recLoc': string;
  'coupons': ICoupons[];
}

export interface ICoupons {
  'coupon': string;
  'depDate': Date;
  'from': string;
  'ticketNum': string;
  'to': string;

}
