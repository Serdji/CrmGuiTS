import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IpagPage } from '../interface/ipag-page';

@Injectable()
export class TableAsyncService {

  public count: number;
  public subjectPage = new Subject();
  public subjectFilter = new Subject();
  public subjectTableDataSource = new Subject();

  constructor() { }

  set countPage( count: number ) {
    this.count = count;
  }

  get countPage() {
    return this.count;
  }

  setPagPage( params: IpagPage ) {
    this.subjectPage.next( params );
  }

  setParamsFilter( paramsFilter ) {
    this.subjectFilter.next( paramsFilter );
  }

  setTableDataSource( params: any ) {
    this.subjectTableDataSource.next( params );
  }

}
