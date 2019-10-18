import { ISegmentation } from './isegmentation';

export interface IComplexSegmentation {
  'isComplex': boolean;
  'segmentationId': number;
  'segmentationTitle': string;
  'childSegmentations': ISegmentation[];
}
