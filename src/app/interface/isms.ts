export interface ISms {
  'totalRows': number;
  result: {
    'distributionId': number;
    'status': {
      'distributionStatusId': number;
      'statusNameRus': string;
    };
    distributionStatuses: {
      'errorCount': number
      'errorNameRus': string;
      'notSentCount': number
      'notSentNameRus': string;
      'sendToCustomerCount': number
      'sendToCustomerNameRus': string
    };
    'count': number;
    'dateFrom': string;
    'dateTo': string;
    'lastTryDT': string;
    'errorMessage': string;
    'subject': string;
    'text': string;
    'footer': string;
  }[];
  'pagingInfo': {
    'from': number;
    'count': number;
  }
}
