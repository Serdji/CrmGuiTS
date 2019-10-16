import { ISegmentation } from './isegmentation';

export interface IComplexSegmentation {
  'segmentationId': number;
  'segmentationTitle': string;
  'childSegmentations': ISegmentation[];
}
