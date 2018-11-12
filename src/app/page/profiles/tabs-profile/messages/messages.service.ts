import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';
import { IMessages } from '../../../../interface/imessages';
import * as _ from 'lodash';

@Injectable( {
  providedIn: 'root'
} )
export class MessagesService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getMessages( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/distributions/customerEmails/${id}` )
      .pipe(
        retry( 10 ),
        map( ( messages: IMessages[] ) => _( messages ).sortBy( 'lastTryDT' ).reverse().value() )
      );
  }

}
