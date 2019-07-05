import { ISegmentation } from './isegmentation';

export interface IComplexSegmentation {
  'segmentationId': number;
  'title': string;
  'childSegmentations': ISegmentation[];
}
