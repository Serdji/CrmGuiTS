import { ISegmentation } from './isegmentation';
import { IcustomerGroupRelations } from './icustomer-group-relations';
import { IprofileNames } from './iprofile-names';

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
  createDate: string;
  customerNames: IprofileNames[];
  segmentations: ISegmentation[];
  customerGroupRelations: IcustomerGroupRelations[];
}
