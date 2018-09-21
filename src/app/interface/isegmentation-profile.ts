export interface ISegmentationProfile {
  'customers': {
      'customerId': number,
      'firstName': string,
      'secondName': string,
      'lastName': string,
    }[],
  totalCount: number;
}
