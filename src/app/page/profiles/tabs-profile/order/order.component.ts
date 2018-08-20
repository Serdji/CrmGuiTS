import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.styl']
})
export class OrderComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public orders = [ '123', '456', '789' ];

  private isActive: boolean = true;

  constructor( private orderService: OrderService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
