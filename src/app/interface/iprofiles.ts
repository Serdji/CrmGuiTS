export interface Iprofiles {
  totalRows: string;
  result: {
    customerId: number;
    gender: string;
    customerNames: {
      customerNameId: number;
      customerId: number;
      customerNameType: number;
      firstName: string;
      secondName: any;
      lastName: string;
    }[];
    dob: string;
  }[];
  filter: {
    customerId: number;
    gender: string;
    prefix: string;
    lastName: string;
    firstName: string;
    middleName: string;
    dobFromInclude: string;
    dobToExclude: string;
  };
  pagingInfo: {
    from: number;
    count: number;
    orderField: string;
  };
}
