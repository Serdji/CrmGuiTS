export interface ISegmentationParameters {
  segmentationTitle: string;
  segmentationGranularity: string;
  customer: {
    ageGroup: string;
    dobFromInclude: string;
    dobToExclude: string;
    withChild: string;
    relevanceFrom: number;
    relevanceTo: number;
    gender: string;
  };
  booking: {
    bookingCreateDateFromInclude: string;
    bookingCreateDateToExclude: string;
  };
  payment: {
    moneyAmountFromInclude: number;
    moneyAmountToExclude: number;
    currency: string;
    eDocTypeP: string;
  };
  segment: {
    segmentsCountFromInclude: number;
    segmentsCountToExclude: number;
    eDocTypeS: string;
  };
  ticket: {
    timeBeforeDepartureT: string | number;
    arrivalDFromIncludeT: string;
    arrivalDToExcludeT: string;
    airlineLCodeIdT: number | string;
    airlineLCodeT?: string;
    flightNoT: string;
    departureLocationCodeT: string;
    arrivalLocationCodeT: string;
    cabinT: string;
    rbdT: string;
    fareCodeT: string;
    posGdsT: string;
    posIdT: number;
    posAgencyT: string;
  };
  emd: {
    timeBeforeDepartureE: string | number;
    arrivalDFromIncludeE: string;
    arrivalDToExcludeE: string;
    airlineLCodeIdE: number | string;
    airlineLCodeE?: string;
    flightNoE: string;
    departureLocationCodeE: string;
    arrivalLocationCodeE: string;
    serviceCodeE: string;
    notServiceCodeE: string;
    posGdsE: string
    posIdE: number;
    posAgencyE: string
    emdIdSellTypeE: number | string;
    emdSellTypeE?: string;
    craftE: string;
    dateOfServiceFromIncludeE: string;
    dateOfServiceToExcludeE: string;
    dateTransFromIncludeE: string;
    dateTransToExcludeE: string;
  };
}
