import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';

@Injectable()
export class ListUsersService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getListUsers(): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/admin/user` ).pipe( this.retryRequestService.retry() );
  }

}
















