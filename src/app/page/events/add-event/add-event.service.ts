import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { Observable } from 'rxjs';
import { ITask } from '../../../interface/itask';

@Injectable({
  providedIn: 'root'
})
export class AddEventService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  createTask( params: ITask ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/task', params ).pipe( this.retryRequestService.retry() );
  }

  tackActivate( send ) {
    return this.http.post( this.configService.crmApi + '/crm/task/taskActivity', send ).pipe( this.retryRequestService.retry() );
  }

}
