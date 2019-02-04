import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../services/config-service.service';
import { RetryRequestService } from '../../../services/retry-request.service';
import { Observable, Subject } from 'rxjs';
import { IPromoCode } from '../../../interface/ipromo-code';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable( {
  providedIn: 'root'
} )
export class AddPromotionsCodesService {

  public subjectDeletePromotionsCodes = new Subject();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }

  getPromoCodeValTypes(): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/promoCodeValTypes' ).pipe( this.retryRequestService.retry() );
  }

  getAllPromoCodes( params ): Observable<any> {
    return this.http.get( this.configService.crmApi + '/crm/promoCodes', { params } )
      .pipe(
        this.retryRequestService.retry(),
        map( ( promoCodes: IPromoCode ) => {
          _.each( promoCodes.result, promoCod => {
            let { dateFrom, dateTo } = promoCod;
            const { code, accountCode } = promoCod;
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
          return promoCodes;
        } )
      );
  }

  getPromoCode( id: number ) {
    return this.http.get( this.configService.crmApi + '/crm/promoCodes/' + id ).pipe( this.retryRequestService.retry() );
  }

  savePromoCode( params ): Observable<any> {
    return this.http.post( this.configService.crmApi + '/crm/promoCodes', params ).pipe( this.retryRequestService.retry() );
  }

  updatePromoCode( params ): Observable<any> {
    return this.http.put( this.configService.crmApi + '/crm/promoCodes', params ).pipe( this.retryRequestService.retry() );
  }

  deletePromoCode( id: number ): Observable<any> {
    return this.http.delete( `${this.configService.crmApi}/crm/promoCodes/${id}` ).pipe( this.retryRequestService.retry() );
  }

  getProfiles( params ) {
    return this.http.get( this.configService.crmApi + '/crm/customer/searchByPromoCode', { params } ).pipe( this.retryRequestService.retry() );
  }

}














