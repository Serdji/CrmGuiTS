export interface Icontact {
  contactId: number;
  customerId: number;
  contactText: string;
  useForDistribution: boolean;
  contactType: {
    contactTypeId: number;
    contactTypeCode: string;
    contactTypeName: any
  };
}
