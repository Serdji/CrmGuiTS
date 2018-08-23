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
    this.orderService.getBooking( this.id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( orders => {
        this.orders = orders;
        this.progress = false;
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
