export interface IuserSearch {
  Data: {
    ErrorMsg: string;
    Result: number;
    Users: [{
      AirlineCode: string;
      Email: string;
      ErrorMsg: string;
      FirstName: string;
      Id: string;
      JoinDate: string;
      LastName: string;
      LockoutEnabled: boolean;
      LockoutEndDateUtc: any;
      Password: string;
      Result: number;
      UserName: string;
    }]
  };
  ErrorDescSystem: string;
}
