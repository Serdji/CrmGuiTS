import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';
import { IMessages } from '../../../../interface/imessages';
import * as _ from 'lodash';
import { RetryRequestService } from '../../../../services/retry-request.service';

@Injectable( {
  providedIn: 'root'
} )
export class MessagesService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getMessages( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/distributions/customerEmails/${id}` )
      .pipe(
        this.retryRequestService.retry(),
        map( ( messages: IMessages[] ) => _( messages ).sortBy( 'Код авиакомпании' ).reverse().value() )
      );
  }

}
