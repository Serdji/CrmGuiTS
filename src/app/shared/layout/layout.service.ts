import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LayoutService {

  public subjectToggle = new Subject();

  constructor() { }

  toggle() {
    this.subjectToggle.next();
  }
}
