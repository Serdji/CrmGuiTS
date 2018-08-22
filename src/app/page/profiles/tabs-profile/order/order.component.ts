import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { map, takeWhile } from 'rxjs/operators';
import { IDocument } from '../../../../interface/idocument';

@Component( {
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: [ './order.component.styl' ]
} )
export class OrderComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public orders;
  public progress: boolean;

  private isActive: boolean;

  constructor( private orderService: OrderService ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.progress = true;
    this.initBooking();
  }

  private initBooking() {
    this.orderService.getBooking( 1078067 )
      .pipe(
        takeWhile( _ => this.isActive ),
        map( orders => {
          console.log( orders );
          for ( const order of orders ) {
            for ( const segment of order.segments ) {
              if ( order.tickets ) {
                for ( const ticket of order.tickets ) {
                  if ( segment.segNum === ticket.segNum ) {
                    Object.assign( ticket, segment );
                  }
                }
              }
            }

            if ( order.MonetaryInfo ) {
              let T;
              let B;
              let TB;
              for ( const MonetaryInfo of order.MonetaryInfo ) {
                const { emd, ticket, Code, Amount, LCode } = MonetaryInfo;
                if ( Code === 'T' || Code === 'B' ) {
                  switch ( Code ) {
                    case 'T': T = Amount; break;
                    case 'B': B = Amount; break;
                  }
                  if ( T && B && ticket ) {
                    TB = T - B;
                    order.MonetaryInfo.push( { ticket, Code: 'TB', Amount: TB, LCode } );
                  }
                }
              }
            }
          }

          return orders;
        } )
      )
      .subscribe( orders => {
        this.orders = orders;
        this.progress = false;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
