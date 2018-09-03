import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../../../node_modules/@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { map, retry } from 'rxjs/operators';
import * as _ from 'lodash';
import { isGeneratedFile } from '../../../../../../node_modules/@angular/compiler/src/aot/util';

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
          orders = _.sortBy( orders, o => o.lut );
          _.reverse( orders );
          console.log( orders );
          let counterServicesIsEmd = 0;

          for ( const order of orders ) {
            if ( order.distrRecloc ) _.merge( _.head( _.filter( order.pos ) ), { distrRecloc: _.head( _.filter( order.distrRecloc ) ) } );
            if ( order.ssrs ) order.services.push(  _.head( _.filter( order.ssrs ) ) );

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
              let T = 0, B = 0, E = 0, TB, TE, LCodeG;
              for ( const MonetaryInfo of order.MonetaryInfo ) {
                const { emd, ticket, Code, Amount, LCode } = MonetaryInfo;
                if ( Code === 'T' || Code === 'B' || Code === 'E' ) {
                  LCodeG = LCode;
                  switch ( Code ) {
                    case 'T': T += Amount; break;
                    case 'B': B += Amount; break;
                    case 'E': E += Amount; break;
                  }
                }
              }

              if ( T && E ) {
                TE = T - E;
                order.MonetaryInfo.push( { Code: 'TG', Amount: T, LCode: LCodeG } );
                order.MonetaryInfo.push( { Code: 'TE', Amount: TE, LCode: LCodeG } );
              }

              if ( T && B && !TE ) {
                TB = T - B;
                order.MonetaryInfo.push( { Code: 'TG', Amount: T, LCode: LCodeG } );
                order.MonetaryInfo.push( { Code: 'TB', Amount: TB, LCode: LCodeG } );
              }
            }
          }

          orders.push( { counterServicesIsEmd: counterServicesIsEmd } );
          return orders;
        } )
      );
  }

}
