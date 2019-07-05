import { ISegmentation } from './isegmentation';

export interface IComplexSegmentatio {
  'segmentationId': number;
  'title': string;
  'childSegmentations': ISegmentation[];
}
