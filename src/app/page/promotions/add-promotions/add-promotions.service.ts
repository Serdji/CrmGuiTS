import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddPromotionsService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  savePromotions( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/promotions', params ).pipe( this.retryRequestService.retry() );
  }

  getAllPromotions( params ): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/promotions', { params } ).pipe( this.retryRequestService.retry() );
  }

}
