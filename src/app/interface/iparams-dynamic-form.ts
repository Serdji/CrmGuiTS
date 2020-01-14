export interface IParamsDynamicForm {
  'id': number;
  'name': string;
  'dataType': number;
  'nullable': boolean;
  'allowBlank': boolean;
  'multiValue': boolean;
  'isQueryParameter': boolean;
  'prompt': string;
  'promptUser': true;
  'values': string[];
}
