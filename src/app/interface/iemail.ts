export interface IEmail {
  'totalRows': number;
  result: {
    'distributionId': number;
    'status': {
      'distributionStatusId': number;
      'statusNameRus': string;
    };
    distributionStatuses: {
      'bouncedCount': number
      'bouncedNameRus': string;
      'clickedCount': number
      'clickedNameRus': string;
      'deliveredCount': number
      'deliveredNameRus': string;
      'errorCount': number
      'errorNameRus': string;
      'notSentCount': number
      'notSentNameRus': string;
      'readCount': number
      'readNameRus': string;
      'rejectedCount': number
      'rejectedNameRus': string;
      'sendToCustomerCount': number
      'sendToCustomerNameRus': string;
      'sentToGatewayCount': number
      'sentToGatewayNameRus': string;
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
