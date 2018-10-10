import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { Observable, Subject } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileGroupService {

  public subjectProfileGroup = new Subject();
  public subjectDeleteProfileGroups = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getProfileGroup( ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customerGroup` ).pipe( retry( 10 ) );
  }

  addProfileGroup( params ): Observable<any> {
    return this.http.post( `${this.configService.crmApi}/crm/customerGroup`,  params  ).pipe( retry( 10 ) );
  }

  addProfileGroupRelation( params ): Observable<any> {
    return this.http.post( `${this.configService.crmApi}/crm/customerGroupRelation`,  params  ).pipe( retry( 10 ) );
  }

  deleteProfileGroupRelation( id: number ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/crm/customerGroupRelation/${id}` ).pipe( retry( 10 ) );
  }

  deleteCustomerGroups( params ): Observable<any> {
    this.subjectDeleteProfileGroups.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/customerGroup/deleteCustomerGroups`, httpOptions ).pipe( retry( 10 ) );
  }

}
