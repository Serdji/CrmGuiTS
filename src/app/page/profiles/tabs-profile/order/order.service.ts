import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../../../node_modules/@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { map, retry } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable( {
  providedIn: 'root'
} )
export class OrderService {

  constructor( private http: HttpClient ) { }


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
              let T = 0, B = 0, E = 0, TB, TE, CurrencyG;
              for ( const MonetaryInfo of order.MonetaryInfo ) {
                const { emd, ticket, Code, Amount, Currency } = MonetaryInfo;
                if ( Code === 'T' || Code === 'B' || Code === 'E' ) {
                  CurrencyG = Currency;
                  switch ( Code ) {
                    case 'T':
                      T += Amount;
                      break;
                    case 'B':
                      B += Amount;
                      break;
                    case 'E':
                      E += Amount;
                      break;
                  }
                }
              }

              if ( T && E ) {
                TE = T - E;
                order.MonetaryInfo.push( { Code: 'TG', Amount: T, Currency: CurrencyG } );
                order.MonetaryInfo.push( { Code: 'TE', Amount: TE, Currency: CurrencyG } );
              }

              if ( T && B && !TE ) {
                TB = T - B;
                order.MonetaryInfo.push( { Code: 'TG', Amount: T, Currency: CurrencyG } );
                order.MonetaryInfo.push( { Code: 'TB', Amount: TB, Currency: CurrencyG } );
              }
            }
          }
          const ticket = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountCur' );


          const emd = _( orders )
            .map( 'MonetaryInfo' )
            .flattenDeep()
            .filter( 'emd' )
            .filter( [ 'Code', 'T' ] )
            .sumBy( 'AmountCur' );

          const { lut } = _.maxBy( orders, o => o.lut );

          orders.push( {
            counterServicesIsEmd,
            lut,
            totalAmount: {
              ticket,
              emd
            }
          } );
          return orders;
        } )
      );
  }

}
