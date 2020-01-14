export interface ICustomSegmentationParams {
  'CustomSegmentationTemplateId': number;
  'Title': string;
  'Description': string;
  'CustomSegmentationParameters': {
    'ParameterId': number;
    'Value': number | number[];
  }[];
}
