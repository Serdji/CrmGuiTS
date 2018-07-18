import { originDestinationObj } from './origin-destination';
import { Observable, of, Subject } from 'rxjs';
import { Icity } from '../../interface/icity';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IprofileSearch } from '../../interface/iprofile-search';
import { retry } from 'rxjs/operators';

@Injectable()
export class ProfileSearchService {

  private params: any;
  public subjectDeleteProfile = new Subject();

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

  getProfileSearch( params: IprofileSearch ): Observable<any> {
    this.params = params;
    return this.http.get( environment.crmApi + '/crm/customer/search', { params: this.params } ).pipe( retry( 10 ) );
  }

  deleteProfiles( params ): Observable<any> {
    this.subjectDeleteProfile.next();
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: params
    };
    return this.http.delete(environment.crmApi + '/crm/customer/deleteCustomers', httpOptions ).pipe( retry( 10 ) );
  }


}
