import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { map, takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { CurrencyDefaultService } from '../../../../services/currency-default.service';
import { ISettings } from '../../../../interface/isettings';
import * as R from 'ramda';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';


@Component( {
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: [ './order.component.styl' ]
} )
export class OrderComponent implements OnInit, OnDestroy {

  @Input() id: number;
  @Input() data: { recLocGDS: string };

  public orders;
  public originalOrders;
  public progress: boolean;
  public currencyDefault: string;
  public formFilter: FormGroup;
  public arrRecloc: string[];
  public reclocOptions: Observable<string[]>;
  public recLocCDS: string;

  private isActive: boolean;
  private isSortFilterReverse: boolean;
  private controlConfig: any;

  constructor(
    private orderService: OrderService,
    private currencyDefaultService: CurrencyDefaultService,
    private fb: FormBuilder,
    @Inject( DOCUMENT ) document,
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
    this.initFilterOrders();
    this.initSearch();
  }


  private initCurrencyDefault() {
    this.currencyDefaultService.getCurrencyDefault()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( settings: ISettings ) => this.currencyDefault = settings.currency );
  }

  private initBooking() {
    // YESSEN SYPATAYEV 21428 26ML5C
    const success = orders => {
      const getRecloc = R.pluck( 'recloc' );
      this.originalOrders = R.init( orders );
      this.orders = R.clone( this.originalOrders );
      this.arrRecloc = getRecloc( this.orders );
      this.progress = false;
      this.recLocCDS = this.data ? this.data.recLocGDS : '';
    };
    const error = _ => this.progress = false;

    this.orderService.getBooking( this.id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success, error );
  }

  private initControlConfig() {
    this.controlConfig = {
      'recloc': '',
      'BookingStatus': '',
      'createDate': '',
      'switchSearch': '',
      'textSearch': ''
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

  private initFilterOrders() {
    let filterConfig = {};
    const filterOrders = config => _.filter( this.originalOrders, config );
    const startFilterOrders = config => !R.isEmpty( filterOrders( config ) ) ? this.orders = filterOrders( config ) : null;
    const success = R.curry( ( formControl: any, value: string ) => {
      const eachObj = ( val, key ) => val === '' || R.isNil( val ) ? filterConfig = R.omit( [ key ], filterConfig ) : null;
      const omitKey = R.forEachObjIndexed( eachObj );
      filterConfig[ formControl ] = moment.isMoment( value ) ? moment( value ).format( 'YYYY-MM-DD' ) : value;
      omitKey( filterConfig );
      startFilterOrders( filterConfig );
    } );

    const valueForm = ( val, formControl ) => {
      this.formFilter.get( formControl ).valueChanges
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( success( formControl ) );
    };

    const generationFilterConfig = R.forEachObjIndexed( valueForm );
    generationFilterConfig( this.controlConfig );
  }

  private initSearch() {

    // console.log(
    //   _.filter( this.orders, ( value: any ) => {
    //     let isBreak: boolean;
    //     _.some( value.segments, segment => {
    //       isBreak = segment.arrPoint === 'PWQ';
    //       console.log( isBreak );
    //       return isBreak;
    //     } );
    //     return isBreak;
    //   } )
    // );
  }

  sortFilter( title: string ): void {
    const isSortFilterReverse = _ => this.isSortFilterReverse = !this.isSortFilterReverse;
    const isSortFilterReverseFunc = R.ifElse( isSortFilterReverse, R.identity, R.reverse );
    const sortByTitle = R.compose( R.sortBy, R.path, R.split( '.' ) );
    const funcSortByTitle = R.compose(
      isSortFilterReverseFunc,
      sortByTitle( title )
    );

    this.orders = funcSortByTitle( this.orders );
  }

  onOpenPanel( id: string ): void {
    timer( 0 )
      .pipe(
        takeWhile( _ => this.isActive ),
        takeWhile( _ => !!this.data ),
        takeWhile( _ => this.data.recLocGDS !== '' ),
      )
      .subscribe( _ => {
        const panel: HTMLElement = document.getElementById( id );
        panel.scrollIntoView();
        this.data.recLocGDS = '';
      } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
