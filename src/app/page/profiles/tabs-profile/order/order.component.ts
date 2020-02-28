import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from './order.service';
import { delay, map, skipWhile, takeWhile, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { CurrencyDefaultService } from '../../../../services/currency-default.service';
import { ISettings } from '../../../../interface/isettings';
import * as R from 'ramda';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { optionGroups, IOptionGroups, IOptionValue } from './optionGroups';


import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: [ './order.component.styl' ]
} )
export class OrderComponent implements OnInit, OnDestroy {

  @Input() id: number;
  @Input() data: { recLocGDS: string };

  public orders$: Observable<any>;
  public originalOrders;
  public currencyDefault: string;
  public formFilter: FormGroup;
  public formSearch: FormGroup;
  public arrRecloc: string[];
  public reclocOptions: Observable<string[]>;
  public recLocCDS: string;
  public optionGroups: IOptionGroups[];
  public isData: boolean;


  private orders: any;
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
    this.isSortFilterReverse = false;
    this.optionGroups = optionGroups;
    this.isData = false;
    this.initCurrencyDefault();
    this.initControlConfig();
    this.initForm();
    this.initAutocomplete();
    this.initFilterOrders();
    this.initSwitchSearch();
    this.initMultiSearchOrders();
    this.initBooking();
  }


  private initCurrencyDefault() {
    this.currencyDefaultService.getCurrencyDefault()
      .pipe( untilDestroyed( this ) )
      .subscribe( ( settings: ISettings ) => this.currencyDefault = settings.currency );
  }

  private initBooking() {
    // YESSEN SYPATAYEV 21428 26ML5C
    this.orders$ = this.orderService.subjectOrders
      .pipe(
        map( ( orders: any ) => {
          const getRecloc = R.pluck( 'recloc' );
          this.originalOrders = R.init( orders );
          this.orders = R.clone( this.originalOrders );
          this.arrRecloc = getRecloc( this.orders );
          this.recLocCDS = this.data ? this.data.recLocGDS : '';
          this.loadSearchOrdersParams();
          return this.orders;
        } ),
      );
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
        untilDestroyed( this ),
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
        .pipe( untilDestroyed( this ) )
        .subscribe( success( formControl ) );
    };

    const generationFilterConfig = R.forEachObjIndexed( valueForm );
    generationFilterConfig( this.filterControlConfig );
  }


  private isBreakFnRec( orders: any, text: string ): boolean {
    let isBreak;
    const isString = R.is( String );
    const isNumber = R.is( Number );
    const isObject = R.is( Object );

    if ( isObject( orders ) ) {
      _.some( orders, value => {
        if ( isString( value ) || isNumber( value ) ) {
          value = value + '';
          const includes = R.includes( R.__, value );
          // @ts-ignore
          const isBreakFn = R.compose( includes, R.toUpper );
          isBreak = isBreakFn( text );
          return isBreak;
        } else if ( !R.isEmpty( value ) ) {
          _.some( value, v => {
            isBreak = isBreak ? isBreak : this.isBreakFnRec( v, text );
            return isBreak;
          } );
        }
      } );
    }
    return isBreak;
  }

  private isBreakFn( controlGroupsName: IOptionValue, text: string ): boolean {
    let isBreak;
    _.some( controlGroupsName, controlGroupName => {
      const controlName = R.path( this.selectOption.controlName, controlGroupName );
      const controlNameParams = controlName || '';
      // @ts-ignore
      const includes = R.includes( R.__, controlNameParams );
      const isBreakCompose = R.compose( includes, R.toUpper );
      isBreak = isBreakCompose( text );
      return isBreak;
    } );
    return isBreak;
  }

  private searchOrders = text => {
    let isBreak;
    text = moment.isMoment( text ) || moment.isDate( text ) ? moment( text ).format( 'YYYYMMDD' ) : text;
    text = text || '';
    const filterOrders = R.filter( ( order: any ) => {
      const isAll = this.selectOption.controlGroupName === 'all';
      const controlGroupsName = order[ this.selectOption.controlGroupName ];
      if ( isAll ) {
        isBreak = this.isBreakFnRec( order, text );
      } else if ( !R.isNil( controlGroupsName ) ) {
        isBreak = this.isBreakFn( controlGroupsName, text );
      }
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
      .pipe( untilDestroyed( this ) )
      .subscribe( success );
  }

  private initMultiSearchOrders() {
    const sendSearchControlName = [ 'dateSearch', 'textSearch' ];
    _.each( sendSearchControlName, formControlName => {
      this.formSearch.get( formControlName ).valueChanges
        .pipe( untilDestroyed( this ) )
        .subscribe( this.searchOrders );
    } );
  }

  private loadSearchOrdersParams() {
    if ( this.saveSearchOrdersParams ) {
      const [ parentParams, childParams ]: any = this.saveSearchOrdersParams;
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
        untilDestroyed( this ),
        takeWhile( _ => !!this.data ),
        takeWhile( _ => this.data.recLocGDS !== '' ),
      )
      .subscribe( _ => {
        const panel: HTMLElement = document.getElementById( id );
        panel.scrollIntoView();
        this.data.recLocGDS = '';
      } );
  }

  ngOnDestroy(): void {}

}
