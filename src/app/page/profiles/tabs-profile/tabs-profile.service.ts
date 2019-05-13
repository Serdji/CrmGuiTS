import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabsProfileService {

  public subjectControlTabsData = new Subject();

  constructor() { }
}
