import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { Observable, Subject } from 'rxjs';
import { RetryRequestService } from '../../../services/retry-request.service';

@Injectable( {
  providedIn: 'root'
} )
export class ListEmailService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getAllEmail( params ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/emailDistribution`, { params } ).pipe( this.retryRequestService.retry() );
  }
}
