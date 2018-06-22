export interface Iairlines {
  Data: {
    ErrorMsg: string;
    Result: number;
    Airlines: [{
      AirlineCode: string;
      AirlineName: string;
      ConnectionString: string;
      DefaultSchema: string;
      Description: string;
      ErrorMsg: string;
      ID: string;
      IdentityDb: string;
      Result: number;
      RoleTable: string;
      UserClaimTable: string;
      UserLoginTable: string;
      UserRoleTable: string;
      UserTable: string;
    }]
  };
  ErrorDescSystem: string;
}
