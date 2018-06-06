import { originDestinationObj } from './origin-destination';
import { Observable, of } from 'rxjs';
import { Icity } from '../../interface/icity';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'

@Injectable()
export class ProfileSearchService {

  private params: string;

  constructor( private http: HttpClient ) { }

  getCity(): Observable<Icity[]> {
    return of( originDestinationObj );
  }

  getTree(): Observable<any> {
    return this.http.get(environment.crmApi + '/api/api/Segmentation/tree');
  }

  getGroups(): Observable<any> {
    return this.http.get(environment.crmApi + '/api/api/CustomerGroup/groups');
  }

  getProfileSearchCount( params: string ): Observable<any> {
    this.params = params;
    return this.http.get(environment.crmApi + '/api/api/Customer/quicksearch/count' + params);
  }

  getProfileSearch( count: string ): Observable<any> {
    return this.http.get(environment.crmApi + '/api/api/Customer/quicksearch' + this.params + count);
  }

}
