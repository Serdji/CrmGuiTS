import { IcustomerGroup } from './icustomer-group';

export interface IcustomerGroupRelations {
  'customerGroupRelationId': number;
  'customerId': number;
  'customerGroupId': number;
  'customerGroup': IcustomerGroup;
}
