import { ISegmentation } from './isegmentation';

export interface Iprofile {
  customerId: number;
  customerNameId: number;
  customerNameType: number;
  gender: string;
  lastName: string;
  firstName: string;
  secondName: string;
  dob: string;
  segmentations: ISegmentation[];
}
