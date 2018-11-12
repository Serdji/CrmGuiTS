export interface IMessages {
  'distributionCustomerId': number;
  'customerId': number;
  'distributionId': number;
  'parsedSubject': string;
  'parsedText': string;
  'parsedFooter': string;
  'distributionCustomerStatus': {
    'distributionCustomerStatusId': number;
    'statusNameRus': string;
  }
}
