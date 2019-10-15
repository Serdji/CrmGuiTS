import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config-service.service';
import { RetryRequestService } from '../../services/retry-request.service';

@Injectable({
  providedIn: 'root'
})
export class DistributionService {

  public distributionSubject = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getProfileDistribution( params: any ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/distribution/search`, { params } ).pipe( this.retryRequestService.retry() );
  }

  startEmailDistribution( id: number ): Observable<any> {
    return this.http.post( this.configService.crmApi + `/crm/distribution/${id}/Start`, { id } ).pipe( this.retryRequestService.retry() );
  }

  stopEmailDistribution( id: number ): Observable<any> {
    return this.http.post( this.configService.crmApi + `/crm/distribution/${id}/Cancel`, { id } ).pipe( this.retryRequestService.retry() );
  }
}
