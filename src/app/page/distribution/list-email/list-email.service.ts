import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { Observable, Subject } from 'rxjs';
import { RetryRequestService } from '../../../services/retry-request.service';

@Injectable( {
  providedIn: 'root'
} )
export class ListEmailService {

  public subjectDistributionDelete = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getDistribution(): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/distribution` ).pipe( this.retryRequestService.retry() );
  }

  deleteDistributions( params ): Observable<any> {
    this.subjectDistributionDelete.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/distributions/deleteDistributions`, httpOptions ).pipe( this.retryRequestService.retry() );
  }

  deleteDistribution( id: number ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/crm/distributions/${id}` ).pipe( this.retryRequestService.retry() );
  }

}
