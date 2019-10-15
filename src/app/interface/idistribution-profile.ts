export interface IDistributionProfile {
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
    distributionStatuses: IDistributionStatuses;
  }[];
  'distributionId': number;
  'status': {
    'distributionStatusId': number;
    'statusNameRus': string
  };
  distributionStatuses: IDistributionStatuses;
  'totalCount': number;
  'dateFrom': string;
  'dateTo': string;
  'lastTryDT': string;
  'errorMessage': string;
  'subject': string;
  'text': string;
  'footer': string;
}

interface IDistributionStatuses {
  'bouncedCount': number;
  'bouncedNameRus': string;
  'clickedCount': number;
  'clickedNameRus': string;
  'deliveredCount': number;
  'deliveredNameRus': string;
  'errorCount': number;
  'errorNameRus': string;
  'notSentCount': number;
  'notSentNameRus': string;
  'readCount': number;
  'readNameRus': string;
  'rejectedCount': number;
  'rejectedNameRus': string;
  'sendToCustomerCount': number;
  'sendToCustomerNameRus': string;
  'sentToGatewayCount': number;
  'sentToGatewayNameRus': string;
}
