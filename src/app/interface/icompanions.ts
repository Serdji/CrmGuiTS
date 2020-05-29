export interface ICompanion{
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
}
