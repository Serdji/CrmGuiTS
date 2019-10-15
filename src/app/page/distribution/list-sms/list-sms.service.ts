import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListSmsService {

  public subjectDistributionDelete = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getAllEmail( params ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/emailDistribution`, { params } ).pipe( this.retryRequestService.retry() );
  }

  deleteEmailDistributions( params ): Observable<any> {
    this.subjectDistributionDelete.next();
    const httpOptions = {
      headers: new HttpHeaders( { 'Content-Type': 'application/json' } ), body: params
    };
    return this.http.delete( `${this.configService.crmApi}/crm/distributions/deleteDistributions`, httpOptions ).pipe( this.retryRequestService.retry() );
  }

  deleteEmailDistribution( id: number ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/crm/distributions/${id}` ).pipe( this.retryRequestService.retry() );
  }

}
