import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config-service.service';
import { RetryRequestService } from './retry-request.service';
import { Observable } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class CurrencyDefaultService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getCurrencyDefault(): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/settings` ).pipe( this.retryRequestService.retry() );
  }
}
