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
            let { dateFrom, dateTo } = promoCod;
            const { code, accountCode} = promoCod;
            dateFrom = dateFrom ? moment( dateFrom ).format( 'DD.MM.YYYY' ) : '';
            dateTo = dateTo ? moment( dateTo ).format( 'DD.MM.YYYY' ) : '';
            _.set(
              promoCod,
              'title',
              'Название промокода: ' + code + ' | ' +
              'Аккаунт код: ' + accountCode + ' | ' +
              'Срок действия: ' +
              'От ' + dateFrom +
              ' До ' + dateTo
            );
          } );
          return promoCods;
        } )
      );
  }

  getPromoCode( id: number ) {
    return this.http.get( this.configService.crmApi + '/crm/promoCodes/' + id ).pipe( this.retryRequestService.retry() );
  }

  savePromoCode( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/promoCodes', params ).pipe( this.retryRequestService.retry() );
  }

}
