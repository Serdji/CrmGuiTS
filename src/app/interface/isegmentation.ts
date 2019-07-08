export interface ISegmentation {
  segmentationId: number;
  title: string;
  isComplex: boolean;
  childSegmentations: ISegmentation[];
}
