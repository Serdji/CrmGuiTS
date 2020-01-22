export interface ISegmentation {
  segmentationId: number;
  title: string;
  isComplex: boolean;
  isCustom: boolean;
  childSegmentations: ISegmentation[];
  segmentationGranularity: number;
}
