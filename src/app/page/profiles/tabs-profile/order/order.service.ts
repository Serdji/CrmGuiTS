import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { map, retry } from 'rxjs/operators';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../services/config-service.service';

@Injectable( {
  providedIn: 'root'
} )
export class OrderService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }


  getBooking( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/customer/${id}/booking` )
      .pipe(
        retry( 10 ),
        map( ( orders: any ) => {
          orders = _( orders ).sortBy( 'lut' ).reverse().value();
          let counterServicesIsEmd = 0;

          for ( const order of orders ) {
            if ( order.distrRecloc ) _.merge( _.find( order.pos ), { distrRecloc: _.find( order.distrRecloc ) } );
            if ( order.ssrs ) {
              if ( order.services ) {
                for ( const ssr of order.ssrs ) {
                  if ( ssr.segNum || ssr.passNum ) {
                    order.services.push( ssr );
                  }
                }
              } else {
                _.set( order, 'services', _.filter( order.ssrs, ssr => ssr.segNum || ssr.passNum ) );
              }
            }

            if ( order.services ) {
              for ( const service of order.services ) {
                if ( service.emd ) ++counterServicesIsEmd;
              }
            }


            for ( const segment of order.segments ) {
              if ( order.tickets ) {
                for ( const ticket of order.tickets ) {
                  if ( segment.segNum === ticket.segNum ) {
                    _.merge( ticket, { segment } );
                  }
                }
              }


              if ( order.services ) {
                for ( const service of order.services ) {
                  if ( segment.segNum === service.segNum ) {
                    _.merge( service, { segment } );
                  }
                }
              }
            }

            if ( order.MonetaryInfo ) {
              let T = 0, Teur = 0, Tusd = 0, B = 0, Beur = 0, Busd = 0, E = 0, Eeur = 0, Eusd = 0, TE, CurrencyG;
              for ( const MonetaryInfo of order.MonetaryInfo ) {
                const { Code, Amount, AmountEur, AmountUsd, Currency } = MonetaryInfo;
                if ( Code === 'T' || Code === 'B' || Code === 'E' ) {
                  CurrencyG = Currency;
                  switch ( Code ) {
                    case 'T':
                      T += Amount;
                      Teur += AmountEur;
                      Tusd += AmountUsd;
                      break;
                    case 'B':
                      B += Amount;
                      Beur += AmountEur;
                      Busd += AmountUsd;
                      break;
                    case 'E':
                      E += Amount;
                      Eeur += AmountEur;
                      Eusd += AmountUsd;
                      break;
                  }
                }
              }

              if ( T && E ) {
                TE = T - E;
                order.MonetaryInfo.push(
                  { Code: 'TG', Amount: T, AmountEur: Teur, AmountUsd: Tusd, Currency: CurrencyG },
                  { Code: 'TE', Amount: TE, AmountEur: Teur - Eeur, AmountUsd: Tusd - Eusd, Currency: CurrencyG }
                );
              }

              if ( T && B && !TE ) {
                order.MonetaryInfo.push(
                  { Code: 'TG', Amount: T, AmountEur: Teur, AmountUsd: Tusd, Currency: CurrencyG },
                  { Code: 'TB', Amount: T - B, AmountEur: Teur - Beur, AmountUsd: Tusd - Busd, Currency: CurrencyG }
                );
              }
            }
          }

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
