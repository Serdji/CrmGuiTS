import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { CurrencyDefaultService } from '../../../../services/currency-default.service';
import { ISettings } from '../../../../interface/isettings';


@Component( {
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: [ './order.component.styl' ]
} )
export class OrderComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public orders;
  public progress: boolean;
  public currencyDefault: string;

  private isActive: boolean;
  private isSortFilterReverse: boolean;

  constructor(
    private orderService: OrderService,
    private currencyDefaultService: CurrencyDefaultService
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.progress = true;
    this.isSortFilterReverse = false;
    this.initBooking();
    this.initCurrencyDefault();
  }

  private initCurrencyDefault() {
    this.currencyDefaultService.getCurrencyDefault()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( settings: ISettings ) => this.currencyDefault = settings.currency );
  }

  private initBooking() {
    // YESSEN SYPATAYEV 21428
    this.orderService.getBooking( this.id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe(
        orders => {
          this.orders = _.initial( orders );
          this.progress = false;
        },
        error => this.progress = false
      );
  }

  sortFilter( title: string ): void {
    this.isSortFilterReverse = !this.isSortFilterReverse;
    if ( this.isSortFilterReverse ) this.orders = _.chain( this.orders ).sortBy( title ).value();
    else this.orders = _.chain( this.orders ).sortBy( title ).reverse().value();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
