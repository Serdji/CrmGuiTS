import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { delay, map, takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { CurrencyDefaultService } from '../../../../services/currency-default.service';
import { ISettings } from '../../../../interface/isettings';
import * as R from 'ramda';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ISegmentation } from '../../../../interface/isegmentation';


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
  public formFilter: FormGroup;
  public arrRecloc: string[];
  public reclocOptions: Observable<string[]>;

  private isActive: boolean;
  private isSortFilterReverse: boolean;
  private filterConfig: any;
  private controlConfig: any;

  constructor(
    private orderService: OrderService,
    private currencyDefaultService: CurrencyDefaultService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.progress = true;
    this.isSortFilterReverse = false;
    this.initBooking();
    this.initCurrencyDefault();
    this.initControlConfig();
    this.initFormFilter();
    this.initAutocomplete();
    this.initFilter();
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
          const getRecloc = R.pluck( 'recloc' );
          this.orders = _.initial( orders );
          this.arrRecloc = getRecloc( this.orders );
          this.progress = false;
        },
        error => this.progress = false
      );
  }

  private initControlConfig() {
    this.controlConfig = {
      'recloc': '',
      'bookingStatus': '',
      'createDate': ''
    };
  }

  private initFormFilter() {
    this.formFilter = this.fb.group( this.controlConfig );
  }

  private initAutocomplete() {
    this.reclocOptions = this.autocomplete( 'recloc' );
  }

  private autocomplete( formControlName: string ): Observable<any> {
    return this.formFilter.get( formControlName ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        map( val => this.arrRecloc.filter( recloc => recloc.toLowerCase().includes( val.toLowerCase() ) ) )
      );
  }

  private initFilter() {
    this.filterConfig = R.clone( this.controlConfig );
    const valueForm = ( val , formControl) => {
      this.formFilter.get( formControl ).valueChanges
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( value => {
          this.filterConfig[ formControl ] = value;
          console.log(this.filterConfig);
        } );
    };
    const generationFilterConfig = R.forEachObjIndexed( valueForm );
    generationFilterConfig( this.controlConfig );
  }

  sortFilter( title: string ): void {
    this.isSortFilterReverse = !this.isSortFilterReverse;

    const sortByTitle = _.curry( ( titleEvn, arr ) => _.sortBy( arr, titleEvn ) );
    const sortFilterRevers = _.curry( ( isSortFilterReverse, arr ) => isSortFilterReverse ? arr : _.reverse( arr ) );
    const composeSortByTitle = _.flow( [ sortByTitle( title ), sortFilterRevers( this.isSortFilterReverse ) ] );

    this.orders = composeSortByTitle( this.orders );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
