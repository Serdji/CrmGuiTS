import { IParamsDynamicForm } from './iparams-dynamic-form';
import { ISegmentation } from './isegmentation';

export interface ICustomSegmentationGetParams extends ISegmentation {
  'customSegmentationParameters': IParamsDynamicForm[];
}
