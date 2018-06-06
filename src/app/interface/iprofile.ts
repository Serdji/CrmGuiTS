export interface Iprofile {
  Data: {
    Id: number;
    Sex: string;
    Dob: string;
    FirstName: string;
    LastName: string;
    MiddleName: string;
    BirthPlace: string;
    Modified: string;
    Created: string;
    IsValid: string;
    CompanionAmount: number;
    DateCome: string;
    SumAmount: number;
    Documents: {
      Id: number;
      IdDocType: number;
      IdCustomer: number;
      Code: string;
      DateOf: string;
      Organization: string;
      Address: string;
      Sort: number;
      IsValid: string;
      Modified: string;
      Created: string;
      DocTypeRCode: string;
      DocTypeLCode: string;
      DocTypeRName: string;
      DocTypeLName: string;
      CountryRName: string;
      CountryLName: string;
      CountryRCode: string;
      CountryLCode: string;
    };
    Contacts: {
      Id: number;
      Type: string;
      Kind: string;
      Text: string;
      IdCustomer: number;
      IdAgency: number;
      IsValid: string;
      Modified: string;
      Created: string;
    };
    Segments: {
      Id: number;
      Name: string;
      Periods: {
        ID: number;
        Type: number;
        From: number;
        To: number;
        ValueFrom: number;
        ValueTo: number;
      };
    };
    Groups: {
      Id: number;
      Name: string;
    };
  };
  ErrorDescSystem: string;
}
