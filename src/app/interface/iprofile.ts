export interface Iprofile {
  totalRows: string;
  result: {
      customerId: number;
      gender: string;
      prefix: string;
      lastName: string;
      firstName: string;
      middleName: string;
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
