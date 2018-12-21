import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';
import { RetryRequestService } from '../../../../services/retry-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService,
  ) { }

  getPromoCodes( params ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/promoCodes/findUsableForCustomer`, { params } ).pipe( this.retryRequestService.retry() );
  }

}
