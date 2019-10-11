import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { IprofileSearch } from '../../../interface/iprofile-search';
import { Observable } from 'rxjs';
import { RetryRequestService } from '../../../services/retry-request.service';

@Injectable( {
  providedIn: 'root'
} )
export class EditorEmailService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }


  getDistributionPlaceholders(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/dictionary/distributionPlaceholders' ).pipe( this.retryRequestService.retry() );
  }

  getTemplates(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/distribution/templates' ).pipe( this.retryRequestService.retry() );
  }

  getEmailLimits(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/distributions/emailLimits' ).pipe( this.retryRequestService.retry() );
  }

  getTemplate( id: number ): Observable<any> {
    return this.http.get( this.configService.crmApi + `/crm/distribution/templates/${id}` ).pipe( this.retryRequestService.retry() );
  }

}











