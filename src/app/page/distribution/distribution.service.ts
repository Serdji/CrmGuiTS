import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../services/config-service.service';
import { RetryRequestService } from '../../services/retry-request.service';

@Injectable({
  providedIn: 'root'
})
export class DistributionService {

  public distributionSubject = new Subject();
  public subjectDistributionDelete = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  startDistribution( id: number ): Observable<any> {
    return this.http.post( this.configService.crmApi + `/crm/distribution/${id}/Start`, { id } ).pipe( this.retryRequestService.retry() );
  }

  stopDistribution( id: number ): Observable<any> {
    return this.http.post( this.configService.crmApi + `/crm/distribution/${id}/Cancel`, { id } ).pipe( this.retryRequestService.retry() );
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
