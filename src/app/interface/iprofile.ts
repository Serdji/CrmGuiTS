import { ISegmentation } from './isegmentation';
import { IcustomerGroupRelations } from './icustomer-group-relations';

export interface Iprofile {
  customerId: number;
  customerNameId: number;
  customerNameType: number;
  gender: string;
  lastName: string;
  firstName: string;
  secondName: string;
  dob: string;
  comment: string;
  segmentations: ISegmentation[];
  customerGroupRelations: IcustomerGroupRelations[];
}
