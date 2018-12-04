import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { Observable } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class AddPromotionsCodsService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService ) { }

  getPromoCodeValTypes(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/promoCodeValTypes' ).pipe( this.retryRequestService.retry() );
  }

  getAllPromoCodes( params ): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/promoCodes', { params } ).pipe( this.retryRequestService.retry() );
  }

  savePromoCode( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/promoCodes', params ).pipe( this.retryRequestService.retry() );
  }

}
