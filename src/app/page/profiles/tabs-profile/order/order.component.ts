import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { takeWhile } from 'rxjs/operators';
import { IDocument } from '../../../../interface/idocument';

@Component( {
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: [ './order.component.styl' ]
} )
export class OrderComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public orders;

  private isActive: boolean;

  constructor( private orderService: OrderService ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.initBooking();
  }

  private initBooking() {
    this.orderService.getBooking( 211521 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe(  value  => {
        console.log(value);
        this.orders = value;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
