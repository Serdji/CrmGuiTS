export interface IDocument {
  documentId: number;
  customerId: number;
  num: string;
  documentType:  {
    documentTypeId: number;
    documentTypeCode: string;
    documentTypeName: any;
  };
  firstName: string;
  secondName: string;
  lastName: string;
  expDate: string;
  country: string;
}
