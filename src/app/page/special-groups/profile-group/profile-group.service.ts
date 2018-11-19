import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { Observable, Subject } from 'rxjs';
import { RetryRequestService } from '../../../services/retry-request.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGroupService {

  public subjectProfileGroup = new Subject();
  public subjectDeleteProfileGroups = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getProfileGroup( ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customerGroup` ).pipe( this.retryRequestService.retry() );
  }

  addProfileGroup( params ): Observable<any> {
    return this.http.post( `${this.configService.crmApi}/crm/customerGroup`,  params  ).pipe( this.retryRequestService.retry() );
  }

  addProfileGroupRelation( params ): Observable<any> {
    return this.http.post( `${this.configService.crmApi}/crm/customerGroupRelation`,  params  ).pipe( this.retryRequestService.retry() );
  }

  deleteProfileGroupRelation( id: number ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/crm/customerGroupRelation/${id}` ).pipe( this.retryRequestService.retry() );
  }

  deleteCustomerGroups( params ): Observable<any> {
    this.subjectDeleteProfileGroups.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/customerGroup/deleteCustomerGroups`, httpOptions ).pipe( this.retryRequestService.retry() );
  }

}
