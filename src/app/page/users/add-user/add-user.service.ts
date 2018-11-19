import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { IcreateUser } from '../../../interface/icreate-user';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';

@Injectable()
export class AddUserService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  createUser( params: IcreateUser ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/admin/user', params ).pipe( this.retryRequestService.retry() );
  }

}
