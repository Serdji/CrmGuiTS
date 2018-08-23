import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../../../node_modules/@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { map, retry } from 'rxjs/operators';

@Injectable( {
  providedIn: 'root'
} )
export class OrderService {

  constructor( private http: HttpClient ) { }

  getBooking( id: number ): Observable<any> {
    return this.http.get( `${environment.crmApi}/crm/customer/${id}/booking` )
      .pipe(
        retry( 10 ),
        map( (orders: any) => {
          console.log( orders );
          for ( const order of orders ) {
            for ( const segment of order.segments ) {
              if ( order.tickets ) {
                for ( const ticket of order.tickets ) {
                  if ( segment.segNum === ticket.segNum ) {
                    Object.assign( ticket, { segment } );
                  }
                }
              }
              if ( order.services ) {
                for ( const service of order.services ) {
                  if ( segment.segNum === service.segNum ) {
                    Object.assign( service, { segment } );
                  }
                }
              }
            }
            if ( order.MonetaryInfo ) {
              for ( const MonetaryInfo of order.MonetaryInfo ) {
                if ( order.services ) {
                  for ( const service of order.services ) {
                    if ( MonetaryInfo.emd === service.emd.num ) {
                      Object.assign( service, { MonetaryInfo } );
                    }
                  }
                }
              }
            }

            if ( order.MonetaryInfo ) {
              let T, B, E, TB, TE;
              for ( const MonetaryInfo of order.MonetaryInfo ) {
                const { emd, ticket, Code, Amount, LCode } = MonetaryInfo;
                if ( Code === 'T' || Code === 'B' || Code === 'E' ) {
                  switch ( Code ) {
                    case 'T': T = Amount; break;
                    case 'B': B = Amount; break;
                    case 'E': E = Amount; break;
                  }
                  if ( T && E && ticket ) {
                    TE = T - E;
                    order.MonetaryInfo.push( { ticket, Code: 'TE', Amount: TE, LCode } );
                  }
                  if ( T && B && !TE && ticket ) {
                    TB = T - B;
                    order.MonetaryInfo.push( { ticket, Code: 'TB', Amount: TB, LCode } );
                  }
                }
              }
            }
          }
          return orders;
        } )
        );
  }

}
