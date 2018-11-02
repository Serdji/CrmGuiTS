export interface Idistribution {
  'distributionId': number;
  'status': {
    'distributionStatusId': number;
    'statusNameRus': string;
  };
  'count': number;
  'dateFrom': string;
  'dateTo': string;
  'lastTryDT': string;
  'errorMessage': string;
  'subject': string;
  'text': string;
  'footer': string;
}
