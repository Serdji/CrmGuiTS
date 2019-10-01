import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getTask( id: number ): Observable< any > {
    return this.http.get( this.configService.crmApi + `/crm/task/${id}`, ).pipe( this.retryRequestService.retry() );
  }

  tackActivate( send ) {
    return this.http.post( this.configService.crmApi + '/crm/task/taskActivity', send ).pipe( this.retryRequestService.retry() );
  }

}
