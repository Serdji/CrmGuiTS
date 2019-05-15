import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ITabsControlData } from '../interface/itabs-control-data';

@Injectable({
  providedIn: 'root'
})
export class TabsProfileService {

  public subjectControlTabsData = new Subject();

  private controlTabsData: ITabsControlData;

  constructor() {}

  set setControlTabsData( params: ITabsControlData ) {
    this.controlTabsData = params;
  }

  get getControlTabsData(): ITabsControlData {
    return this.controlTabsData;
  }

}
