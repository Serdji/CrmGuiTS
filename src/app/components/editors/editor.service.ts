import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config-service.service';
import { RetryRequestService } from '../../services/retry-request.service';
import { IprofileSearch } from '../../interface/iprofile-search';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorService {


  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  saveDistribution( params: IprofileSearch ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/distribution/searchAndCreateDistribution', params ).pipe( this.retryRequestService.retry() );
  }

  saveFromPromoCode( params: IprofileSearch ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/distribution/createFromPromocode', params ).pipe( this.retryRequestService.retry() );
  }
}
