export interface IProfilePromoCode {
  result: {
      customerId: number;
      gender: string;
      dob: string;
      comment: string;
      customerNames: {
          customerNameId: number;
          customerId: number;
          customerNameType: number;
          firstName: string;
          secondName: string;
          lastName: string;
        }[];
      segmentations: any;
      customerGroupRelations: any;
    }[];
  totalCount: number;
}
