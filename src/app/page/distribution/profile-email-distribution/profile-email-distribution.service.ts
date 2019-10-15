import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { Observable, Subject } from 'rxjs';
import { RetryRequestService } from '../../../services/retry-request.service';

@Injectable( {
  providedIn: 'root'
} )
export class ProfileEmailDistributionService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getProfileDistribution( params: any ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/distribution/search`, { params } ).pipe( this.retryRequestService.retry() );
  }


}
