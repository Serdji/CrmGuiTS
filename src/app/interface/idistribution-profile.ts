export interface IdistributionProfile {
  'customers': {
      'customerId': number;
      'distributionCustomerId': number;
      'firstName': string;
      'secondName': string;
      'lastName': string;
      'gender': string;
      'dob': string;
      'comment': string;
      'subject': string;
      'text': string;
      'footer': string;
      'distributionCustomerStatus': {
        'distributionCustomerStatusId': number;
        'statusNameRus': string
      }
  }[];
  'distributionId': number;
  'status': {
    'distributionStatusId': number;
    'statusNameRus': string
  };
  'totalCount': number;
  'dateFrom': string;
  'dateTo': string;
  'lastTryDT': string;
  'errorMessage': string;
  'subject': string;
  'text': string;
  'footer': string;
}
