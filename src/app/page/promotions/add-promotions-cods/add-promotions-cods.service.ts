import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { Observable } from 'rxjs';
import { IPromoCod } from '../../../interface/ipromo-cod';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';

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
    return this.http.get( this.configService.crmApi + '/crm/promoCodes', { params } )
      .pipe(
        this.retryRequestService.retry(),
        map( ( promoCods: IPromoCod ) => {
          _.each( promoCods.result, promoCod => {
            const { code, accountCode, dateFrom, dateTo } = promoCod;
            _.set(
              promoCod,
              'title',
              'Название промокода: ' + code + '. ' +
              'Аккаунт код: ' + accountCode + '. ' +
              'Срок действия: ' + 'От ' + moment( dateFrom ).format( 'DD.MM.YYYY' ) + ' До ' + moment( dateTo ).format( 'DD.MM.YYYY' )
            );
          } );
          return promoCods;
        } )
      );
  }

  savePromoCode( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/promoCodes', params ).pipe( this.retryRequestService.retry() );
  }

}
