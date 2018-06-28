import { originDestinationObj } from './origin-destination';
import { Observable, of } from 'rxjs';
import { Icity } from '../../interface/icity';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IprofileSearch } from '../../interface/iprofile-search';

@Injectable()
export class ProfileSearchService {

  private params: any;

  constructor( private http: HttpClient ) { }

  getCity(): Observable<Icity[]> {
    return of( originDestinationObj );
  }

  getTree(): Observable<any> {
    return this.http.get( environment.crmApi + '/api/api/Segmentation/tree' );
  }

  getGroups(): Observable<any> {
    return this.http.get( environment.crmApi + '/api/api/CustomerGroup/groups' );
  }

  getProfileSearchCount( params: IprofileSearch ): Observable<any> {
    this.params = params;
    return this.http.get( environment.crmApi + '/api/api/Customer/quicksearch/count', { params: this.params } );
  }

  getProfileSearch( count: IprofileSearch ): Observable<any> {
    const params = Object.assign({}, this.params, count);
    return this.http.get( environment.crmApi + '/api/api/Customer/quicksearch', { params: params } );
  }

}
