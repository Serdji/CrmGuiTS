import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { delay, map, skipWhile, takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';
import { CurrencyDefaultService } from '../../../../services/currency-default.service';
import { ISettings } from '../../../../interface/isettings';
import * as R from 'ramda';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { optionGroups, IOptionGroups, IOptionValue } from './optionGroups';


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
  public formSearch: FormGroup;
  public arrRecloc: string[];
  public reclocOptions: Observable<string[]>;
  public recLocCDS: string;
  public optionGroups: IOptionGroups[];
  public isData: boolean;

  private isActive: boolean;
  private isSortFilterReverse: boolean;
  private filterControlConfig: any;
  private searchControlConfig: any;
  private selectOption: IOptionValue;
  private saveSearchOrdersParams: IOptionValue = JSON.parse( localStorage.getItem( 'saveSearchOrdersParams' ) );

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
    this.optionGroups = optionGroups;
    this.isData = false;
    this.initBooking();
    this.initCurrencyDefault();
    this.initControlConfig();
    this.initForm();
    this.initAutocomplete();
    this.initFilterOrders();
    this.initSwitchSearch();
    this.initMultiSearchOrders();
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
      this.loadSearchOrdersParams();
    };
    const error = _ => this.progress = false;

    this.orderService.getBooking( this.id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success, error );
  }

  private initControlConfig() {
    this.filterControlConfig = {
      'recloc': '',
      'BookingStatus': '',
      'createDate': '',
    };
    this.searchControlConfig = {
      'switchSearch': '',
      'textSearch': '',
      'dateSearch': '',
    };
  }

  private initForm() {
    this.formFilter = this.fb.group( this.filterControlConfig );
    this.formSearch = this.fb.group( this.searchControlConfig );
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
    generationFilterConfig( this.filterControlConfig );
  }

  private searchOrders = text => {
    text = moment.isMoment( text ) || moment.isDate( text ) ? moment( text ).format( 'YYYYMMDD' ) : text;
    text = text || '';
    const filterOrders = R.filter( ( order: any ) => {
      const controlGroupsName = order[ this.selectOption.controlGroupName ];
      let isBreak;
      const someControlGroupName = () => _.some( controlGroupsName, controlGroupName => {
        const controlName = R.path( this.selectOption.controlName, controlGroupName );
        const controlNameParams = controlName || '';
        // @ts-ignore
        const includes = R.includes( R.__, controlNameParams );
        const isBreakFn = R.compose( includes, R.toUpper );
        isBreak = isBreakFn( text );
        return isBreak;
      } );
      if ( !R.isNil( controlGroupsName ) ) someControlGroupName();
      return isBreak;
    } );
    this.orders = R.isEmpty( text ) ? this.originalOrders : filterOrders( this.originalOrders );
  };
  private sendSearchControlName = _ => [ 'dateSearch', 'textSearch' ];
  private clearFields = controlName => this.formSearch.get( controlName ).patchValue( '' );
  private disableFields = controlName => this.formSearch.get( controlName ).disable();
  private enableFields = controlName => this.formSearch.get( controlName ).enable();
  // @ts-ignore
  private eventField = fn => R.forEach( fn, this.sendSearchControlName() );

  private saveSearchOrdersParamsFn = ( optionsGroups: IOptionGroups[], optionValue: IOptionValue, parentCount: number = 0, childCount: number = 0 ): number[] => {
    let isBreak;
    _.some( optionsGroups, optionGroup => {
      parentCount++;
      childCount = 0;
      _.some( optionGroup.option, option => {
        childCount++;
        isBreak = _.eq( option.value, optionValue );
        return isBreak;
      } );
      return isBreak;
    } );
    return [ parentCount - 1, childCount - 1 ];
  };

  private initSwitchSearch() {
    let countOpen = 0;
    const enabledFn = option => {
      localStorage.setItem( 'saveSearchOrdersParams', JSON.stringify( this.saveSearchOrdersParamsFn( this.optionGroups, option ) ) );
      countOpen++;
      this.selectOption = option;
      this.isData = option.isDate || false;
      const whichFormControl = this.isData ? 'dateSearch' : 'textSearch';
      const clearFormControl = whichFormControl === 'dateSearch' ? 'textSearch' : 'dateSearch';
      this.formSearch.get( clearFormControl ).patchValue( '' );
      const formControlValue = this.formSearch.get( whichFormControl ).value;
      if ( !R.isNil( formControlValue ) ) this.searchOrders( formControlValue );
      if ( countOpen === 1 ) this.eventField( this.enableFields );
    };
    const disabledFn = _ => {
      countOpen = 0;
      localStorage.removeItem( 'saveSearchOrdersParams' );
      this.eventField( this.disableFields );
      this.eventField( this.clearFields );
    };
    const switchField = R.ifElse( R.isNil, disabledFn, enabledFn );
    const success = ( option: IOptionValue ) => switchField( option );
    this.eventField( this.disableFields );

    this.formSearch.get( 'switchSearch' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success );
  }

  private initMultiSearchOrders() {
    const sendSearchControlName = [ 'dateSearch', 'textSearch' ];
    _.each( sendSearchControlName, formControlName => {
      this.formSearch.get( formControlName ).valueChanges
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( this.searchOrders );
    } );
  }

  private loadSearchOrdersParams() {
    if ( this.saveSearchOrdersParams ) {
      const parentParams = this.saveSearchOrdersParams[ 0 ];
      const childParams = this.saveSearchOrdersParams[ 1 ];
      this.formSearch.get( 'switchSearch' ).patchValue( this.optionGroups[ parentParams ].option[ childParams ].value );
    }
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
