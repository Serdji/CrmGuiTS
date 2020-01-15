export interface ICustomSegmentationParams {
  'CustomSegmentationId'?: number;
  'CustomSegmentationTemplateId': number;
  'Title': string;
  'Description': string;
  'CustomSegmentationParameters': {
    'ParameterId': number;
    'Value': any | any[];
  }[];
}
