import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';
import { RetryRequestService } from '../../../../services/retry-request.service';

@Injectable( {
  providedIn: 'root'
} )
export class OrderService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private retryRequestService: RetryRequestService
  ) { }


  getBooking( id: number ): Observable<any> {
    return this.http.get( `${this.configService.crmApi}/crm/customer/${id}/booking` )
      .pipe(
        this.retryRequestService.retry(),
        map( ( orders: any ) => {
          orders = _( orders ).sortBy( 'lut' ).reverse().value();
          let counterServicesIsEmd = 0;

          _.each( orders, order => {
            if ( order.distrRecloc ) _.merge( _.find( order.pos ), { distrRecloc: _.find( order.distrRecloc ) } );
            if ( order.ssrs ) {
              if ( order.services ) {
                _.each( order.ssrs, ssr => {
                  if ( ssr.segNum || ssr.passNum ) {
                    order.services.push( ssr );
                  }
                } );
              } else {
                _.set( order, 'services', _.filter( order.ssrs, ssr => ssr.segNum || ssr.passNum ) );
              }
            }


            _.each( order.services, service => {
              if ( service.emd ) ++counterServicesIsEmd;
            } );

            _.each( order.segments, segment => {
              _.each( order.tickets, ticket => {
                if ( segment.segNum === ticket.segNum ) _.merge( ticket, { segment } );
              } );

              _.each( order.services, service => {
                if ( segment.segNum === service.segNum ) _.merge( service, { segment } );
              } );
            } );


            if ( order.MonetaryInfo ) {
              let T = 0, Teur = 0, Tusd = 0, Tcur = 0, B = 0, Beur = 0, Busd = 0, Bcur = 0, E = 0, Eeur = 0, Eusd = 0, Ecur = 0, TE, CurrencyG;
              _.each( order.MonetaryInfo, MonetaryInfo => {
                const { Code, Amount, AmountEur, AmountUsd, AmountCur, Currency } = MonetaryInfo;
                if ( Code === 'T' || Code === 'B' || Code === 'E' ) {
                  CurrencyG = Currency;
                  switch ( Code ) {
                    case 'T':
                      T += Amount;
                      Teur += AmountEur;
                      Tusd += AmountUsd;
                      Tcur += AmountCur;
                      break;
                    case 'B':
                      B += Amount;
                      Beur += AmountEur;
                      Busd += AmountUsd;
                      Bcur += AmountCur;
                      break;
                    case 'E':
                      E += Amount;
                      Eeur += AmountEur;
                      Eusd += AmountUsd;
                      Ecur += AmountCur;
                      break;
                  }
                }
              } );

              if ( T && E ) {
                TE = T - E;
                order.MonetaryInfo.push(
                  { Code: 'TG', Amount: T, AmountEur: Teur, AmountUsd: Tusd, AmountCur: Tcur, Currency: CurrencyG },
                  { Code: 'TE', Amount: TE, AmountEur: Teur - Eeur, AmountUsd: Tusd - Eusd, AmountCur: Tcur - Ecur, Currency: CurrencyG }
                );
              }

              if ( T && B && !TE ) {
                order.MonetaryInfo.push(
                  { Code: 'TG', Amount: T, AmountEur: Teur, AmountUsd: Tusd, AmountCur: Tcur, Currency: CurrencyG },
                  { Code: 'TB', Amount: T - B, AmountEur: Teur - Beur, AmountUsd: Tusd - Busd, AmountCur: Tcur - Bcur, Currency: CurrencyG }
                );
              }
            }
          } );

          const ticketCur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountCur' );
          const ticketEur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountEur' );
          const ticketUsd = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountUsd' );


          const emdCur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( 'emd' )
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountCur' );
          const emdEur = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( 'emd' )
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountEur' );
          const emdUsd = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( 'emd' )
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountUsd' );

          const { lut } = _.maxBy( orders, o => o.lut );

          orders.push( {
            counterServicesIsEmd,
            lut,
            totalAmount: {
              ticket: {
                ticketCur,
                ticketEur,
                ticketUsd
              },
              emd: {
                emdCur,
                emdEur,
                emdUsd
              }
            }
          } );
          return orders;
        } )
      );
  }

}
