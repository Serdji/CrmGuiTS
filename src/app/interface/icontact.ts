export interface Icontact {
  contactId: number;
  customerId: number;
  contactText: string;
  contactType: {
    contactTypeId: number;
    contactTypeCode: string;
    contactTypeName: any
  };
}
