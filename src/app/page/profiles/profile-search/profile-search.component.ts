import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileSearchService } from './profile-search.service';
import { map, debounceTime, switchMap, pluck } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { Iprofiles } from '../../../interface/Iprofiles';
import { IpagPage } from '../../../interface/ipag-page';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { IprofileSearch } from '../../../interface/iprofile-search';
import { IAirport } from '../../../interface/iairport';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { ISegmentation } from '../../../interface/isegmentation';
import * as _ from 'lodash';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { saveAs } from 'file-saver';
import { ProfileGroupService } from '../../special-groups/profile-group/profile-group.service';
import { IcustomerGroup } from '../../../interface/icustomer-group';
import { ISettings } from '../../../interface/isettings';
import { CurrencyDefaultService } from '../../../services/currency-default.service';
import { TableAsyncService } from '../../../services/table-async.service';
import * as R from 'ramda';
import { DialogMergeProfileService } from '../../../components/merge-profile/dialog-merge-profile/dialog-merge-profile.service';
import { IAirlineLCode } from '../../../interface/iairline-lcode';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ISellType } from '../../../interface/isell-type';
import { ICountries } from '../../../interface/icountries';
import { ICraftSource } from '../../../interface/icraft-source';
import { IAgeGroups } from '../../../interface/iage-group';
import { AgeIntervalService } from '../../settings/age-interval/age-interval.service';

@Component( {
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: [ './profile-search.component.styl' ]
} )
export class ProfileSearchComponent implements OnInit, OnDestroy {

  public airportsFromOptions: Observable<IAirport[]>;
  public airportsToOptions: Observable<IAirport[]>;
  public airlineLCodeOptions: Observable<IAirlineLCode[]>;
  public sellCountryOptions: Observable<ICountries[]>;
  public segmentationOptions: Observable<ISegmentation[]>;
  public customerGroupOptions: Observable<IcustomerGroup[]>;
  public ageGroupOptions: Observable<IAgeGroups[]>;
  public sellTypeOptions: Observable<ISellType[]>;
  public craftSources: Observable<ICraftSource[]>;
  public profiles: Iprofiles;
  public isTableCard = false;
  public isLoader = false;
  public segmentation: ISegmentation[];
  public customerGroup: IcustomerGroup[];
  public ageGroup: IAgeGroups[];
  public currencyDefault: string;
  public buttonSearch: boolean;
  public buttonCsvDisabled: boolean;
  public csvLoader: boolean;

  readonly separatorKeysCodes: number[] = [ ENTER, COMMA ];
  public segmentationSelectable = true;
  public segmentationRemovable = true;
  public addSegmentationOnBlur = false;
  public segmentationChips: string[] = [];

  public customerGroupSelectable = true;
  public customerGroupRemovable = true;
  public addCustomerGroupOnBlur = false;
  public customerGroupChips: string[] = [];

  public formProfileSearch: FormGroup;

  private delay: number;

  private sendProfileParams: IprofileSearch;
  private isQueryParams: boolean;
  private airlineId: number;
  private IdSellCountry: number;
  private sellTypeId: number;

  @ViewChild( 'segmentationChipInput', { static: true } ) segmentationFruitInput: ElementRef<HTMLInputElement>;
  @ViewChild( 'customerGroupChipInput', { static: true } ) customerGroupFruitInput: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private profileSearchService: ProfileSearchService,
    private tableAsyncService: TableAsyncService,
    private listSegmentationService: ListSegmentationService,
    private profileGroupService: ProfileGroupService,
    private router: Router,
    private route: ActivatedRoute,
    private currencyDefaultService: CurrencyDefaultService,
    private dialogMergeProfileService: DialogMergeProfileService,
    private ageIntervalService: AgeIntervalService
  ) { }

  ngOnInit(): void {
    this.isQueryParams = true;
    this.buttonSearch = true;
    this.buttonCsvDisabled = true;
    this.csvLoader = false;
    this.delay = 500;
    this.initForm();
    this.initCraftSource();
    this.initAirports();
    this.initAutocomplete();
    this.initTableAsync();
    this.initSegmentation();
    this.initCustomerGroup();
    this.initAirlineLCodes();
    this.initCountries();
    this.initSellType();
    this.initCurrencyDefault();
    this.activeButton();
    this.initQueryParams();
    this.initAgeGroup();
    this.profileSearchService.subjectDeleteProfile
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => this.serverRequest( this.sendProfileParams ) );
    this.dialogMergeProfileService.subjectMergeCustomer
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => this.creatingObjectForm() );
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( untilDestroyed( this ) )
      .subscribe( params => this.formFilling( params ) );
  }

  private initCurrencyDefault() {
    this.currencyDefaultService.getCurrencyDefault()
      .pipe( untilDestroyed( this ) )
      .subscribe( ( settings: ISettings ) => this.currencyDefault = settings.currency );
  }

  private initTableAsync() {
    this.tableAsyncService.subjectPage
      .pipe( untilDestroyed( this ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = Object.assign( this.sendProfileParams, { sortvalue: 'last_name', from: pageIndex, count: value.pageSize } );
        this.profileSearchService.getProfileSearch( paramsAndCount )
          .pipe( untilDestroyed( this ) )
          .subscribe( ( profile: Iprofiles ) => this.tableAsyncService.setTableDataSource( profile.result ) );
      } );
  }

  private initCraftSource() {
    this.craftSources = this.profileSearchService.getCraftSource() as Observable<ICraftSource[]>;
  }

  private initAirports() {
    this.airportsFromOptions = this.formProfileSearch.get( 'deppoint' ).valueChanges
      .pipe(
        debounceTime( this.delay ),
        switchMap( text => this.profileSearchService.getAirports( encodeURI( text ) ) ),
      ) as Observable<IAirport[]>;
    this.airportsToOptions = this.formProfileSearch.get( 'arrpoint' ).valueChanges
      .pipe(
        debounceTime( this.delay ),
        switchMap( text => this.profileSearchService.getAirports( encodeURI( text ) ) )
      ) as Observable<IAirport[]>;

  }


  private initSegmentation() {
    this.listSegmentationService.getSegmentation()
      .pipe( untilDestroyed( this ) )
      .subscribe( ( segmentation: ISegmentation[] ) => this.segmentation = segmentation );
  }

  private initCustomerGroup() {
    this.profileGroupService.getProfileGroup()
      .pipe( untilDestroyed( this ) )
      .subscribe( ( customerGroup: IcustomerGroup[] ) => this.customerGroup = customerGroup );
  }

  private initAgeGroup() {
    this.ageIntervalService.getAgeGroups()
      .pipe(
        untilDestroyed( this ),
        pluck( 'ageGroups' )
      )
      .subscribe( ( ageGroup: IAgeGroups[] ) => this.ageGroup = ageGroup );
  }

  private initAirlineLCodes() {
    this.airlineLCodeOptions = this.formProfileSearch.get( 'airlineLCode' ).valueChanges
      .pipe(
        debounceTime( this.delay ),
        switchMap( text => this.profileSearchService.getAirlineCodes( encodeURI( text ) ) )
      ) as Observable<IAirlineLCode[]>;

  }

  private initCountries() {
    this.sellCountryOptions = this.formProfileSearch.get( 'sellCountry' ).valueChanges
      .pipe(
        debounceTime( this.delay ),
        switchMap( text => this.profileSearchService.getCountries( encodeURI( text ) ) )
      ) as Observable<ICountries[]>;
  }

  private initSellType() {
    this.sellTypeOptions = this.formProfileSearch.get( 'sellType' ).valueChanges
      .pipe(
        debounceTime( this.delay ),
        switchMap( text => this.profileSearchService.getSellType( encodeURI( text ) ) )
      ) as Observable<ISellType[]>;
  }

  private initAutocomplete() {
    this.segmentationOptions = this.autocomplete( 'segmentation', 'segmentation' );
    this.customerGroupOptions = this.autocomplete( 'customerGroup', 'customerGroup' );
    this.ageGroupOptions = this.autocomplete( 'ageGroup', 'ageGroup' );
  }

  public displayAirlineLCodeFn( option ): string | undefined {
    return R.is( Object, option ) ? option.title : option;
  }

  public displaySellCountryFn( option ): string | undefined {
    return R.is( Object, option ) ? option.title : option;
  }

  public displaySellTypeCodeFn( option ): string | undefined {
    return R.is( Object, option ) ? option.sellTypeCode : option;
  }

  private autocomplete( formControlName: string, options: string ): Observable<any> {
    return this.formProfileSearch.get( formControlName ).valueChanges
      .pipe(
        untilDestroyed( this ),
        debounceTime( 500 ),
        map( val => {
          switch ( options ) {
            case 'segmentation':
              return this.segmentation.filter( ( segmentation: ISegmentation ) => {
                  if ( !R.isNil( val ) ) {
                    return segmentation.title.toLowerCase().includes( val.toLowerCase() );
                  }
                }
              );
            case 'customerGroup':
              return this.customerGroup.filter( ( customerGroup: IcustomerGroup ) => {
                  if ( !R.isNil( val ) ) {
                    return customerGroup.customerGroupName.toLowerCase().includes( val.toLowerCase() );
                  }
                }
              );
            case 'ageGroup':
              return this.ageGroup.filter( ( ageGroup: IAgeGroups ) => {
                  if ( !R.isNil( val ) ) {
                    return ageGroup.title.toLowerCase().includes( val.toLowerCase() );
                  }
                }
              );
          }
        } )
      );
  }


  private initForm() {
    this.formProfileSearch = this.fb.group( {
      lastname: '',
      firstname: '',
      customerids: '',
      gender: '',
      segmentation: '',
      customerGroup: '',
      ageGroup: '',
      dobfrominclude: '',
      dobtoexclude: '',
      ticket: '',
      recloc: '',
      emd: '',
      dateOfServiceFromInclude: '',
      dateOfServiceToExclude: '',
      dateTransFromInclude: '',
      dateTransToExclude: '',
      originPosId: '',
      originPult: '',
      originAgency: '',
      airlineLCode: '',
      sellType: '',
      sellCountry: '',
      craft: '',
      idCraftSource: '',
      flight: '',
      flightdatefrom: '',
      flightdateto: '',
      deppoint: '',
      arrpoint: '',
      deptimefrominclude: '',
      deptimetoexclude: '',
      cab: '',
      rbd: '',
      farecode: '',
      servicecode: '',
      moneyamountfrominclude: '',
      moneyamounttoinclude: '',
      bookingcreatedatefrominclude: '',
      bookingcreatedatetoexclude: '',
      contactemail: '',
      contactphone: '',
      contactsexist: '',
      id: '',
    } );
    this.switchCheckbox();
    this.forkJoinObservable();
  }

  private switchCheckbox() {
    this.formProfileSearch.get( 'contactsexist' ).valueChanges
      .pipe( untilDestroyed( this ) )
      .subscribe( value => {
        this.formProfileSearch.get( 'contactemail' )[ value ? 'disable' : 'enable' ]();
        this.formProfileSearch.get( 'contactphone' )[ value ? 'disable' : 'enable' ]();
        if ( value ) {
          this.formProfileSearch.get( 'contactemail' ).patchValue( '' );
          this.formProfileSearch.get( 'contactphone' ).patchValue( '' );
        }
      } );
  }


  private forkJoinObservable() {
    const success = value => {
      this.segmentation = value[ 0 ];
      this.customerGroup = value[ 1 ];
      this.initQueryParams();
    };

    forkJoin( [
        this.listSegmentationService.getSegmentation(),
        this.profileGroupService.getProfileGroup()
      ]
    )
      .pipe( untilDestroyed( this ) )
      .subscribe( success );
  }

  private formFilling( params ) {

    if ( Object.keys( params ).length !== 0 ) {
      const newObjectForm = {};
      const segmentationTitles = [];
      const customerGroupTitles = [];

      if ( params.segmentationIds ) {
        const segmentationIds = !_.isArray( params.segmentationIds ) ? _.castArray( params.segmentationIds ) : params.segmentationIds;
        for ( const segmentationId of segmentationIds ) {
          if ( segmentationId ) {
            segmentationTitles.push( _.chain( this.segmentation ).find( { 'segmentationId': +segmentationId } ).result( 'title' ).value() );
          }
        }
      }

      if ( params.customerGroupIds ) {
        const customerGroupIds = !_.isArray( params.customerGroupIds ) ? _.castArray( params.customerGroupIds ) : params.customerGroupIds;
        for ( const customerGroupId of customerGroupIds ) {
          if ( customerGroupId ) {
            customerGroupTitles.push( _.chain( this.customerGroup ).find( { 'customerGroupId': +customerGroupId } ).result( 'customerGroupName' ).value() );
          }
        }
      }

      this.segmentationChips = segmentationTitles;
      this.customerGroupChips = customerGroupTitles;

      for ( const key of Object.keys( params ) ) {
        if ( this.isKeys( key, 'all' ) ) {
          newObjectForm[ key ] = params[ key ];
        }
        if ( this.isKeys( key, 'data' ) ) {
          newObjectForm[ key ] = params[ key ] ? new Date( params[ key ].split( '.' ).reverse().join( ',' ) ) : '';
        }
        if ( this.isKeys( key, 'checkbox' ) ) {
          newObjectForm[ key ] = params[ key ];
        }
        if ( this.isKeys( key, 'airlineLCode' ) ) {
          newObjectForm[ key ] = params[ key ];
        }
        if ( this.isKeys( key, 'sellCountry' ) ) {
          newObjectForm[ key ] = params[ key ];
        }
        if ( this.isKeys( key, 'sellType' ) ) {
          newObjectForm[ key ] = params[ key ];
        }
      }

      this.formProfileSearch.patchValue( newObjectForm );
      this.airlineId = params[ 'airlineId' ];
      this.IdSellCountry = params[ 'IdSellCountry' ];
      this.sellTypeId = params[ 'idSellType' ];
      if ( this.isQueryParams ) {
        this.creatingObjectForm();
      }
    }
  }

  private creatingObjectForm() {
    const params = {};
    const highlightObj = {};
    const formValue = Object.keys( this.formProfileSearch.value );
    const segmentation = [];
    const customerGroup = [];

    for ( const segmentationChip of this.segmentationChips ) {
      if ( segmentationChip ) {
        segmentation.push( _.chain( this.segmentation ).find( { 'title': segmentationChip } ).get( 'segmentationId' ).value() );
      }
    }

    for ( const customerGroupChip of this.customerGroupChips ) {
      if ( customerGroupChip ) {
        customerGroup.push( _.chain( this.customerGroup ).find( { 'customerGroupName': customerGroupChip } ).get( 'customerGroupId' ).value() );
      }
    }

    for ( const key of formValue ) {
      const valueForm = keys => this.formProfileSearch.get( keys ).value || '';
      if ( this.isKeys( key, 'all' ) ) {
        highlightObj[ key ] = valueForm( key ).trim();
      }
      if ( this.isKeys( key, 'data' ) ) {
        highlightObj[ key ] = moment( valueForm( key ) ).format( 'DD.MM.YYYY' );
      }
      if ( this.isKeys( key, 'checkbox' ) ) {
        if ( this.formProfileSearch.get( key ).value ) {
          highlightObj[ key ] = !valueForm( key );
        } else {
          delete highlightObj[ key ];
        }
      }
    }

    for ( const key of Object.keys( highlightObj ) ) {
      if ( highlightObj[ key ] !== '' && highlightObj[ key ] !== 'Invalid date' && highlightObj[ key ] !== undefined ) {
        params[ key ] = highlightObj[ key ];
      }
    }

    if ( _.size( segmentation ) > 0 ) {
      _.set( params, 'segmentationIds', segmentation );
    }

    if ( _.size( customerGroup ) > 0 ) {
      _.set( params, 'customerGroupIds', customerGroup );
    }

    this.serverRequest( params );
  }

  private serverRequest( params: IprofileSearch ) {
    this.isTableCard = true;
    this.isLoader = true;
    this.isQueryParams = false;

    const airlineLCodeValue: IAirlineLCode = this.formProfileSearch.get( 'airlineLCode' ).value;
    const airlineId = airlineLCodeValue.idAirline || this.airlineId || null;
    const airlineCode = airlineLCodeValue.title || airlineLCodeValue;

    const sellCountryValue: ICountries = this.formProfileSearch.get( 'sellCountry' ).value;
    const IdSellCountry = sellCountryValue.countryId || this.IdSellCountry || null;
    const sellCountry = sellCountryValue.title || sellCountryValue;

    const sellTypeValue: ISellType = this.formProfileSearch.get( 'sellType' ).value;
    const idSellType = sellTypeValue.idSellType || this.sellTypeId || null;
    const sellType = sellTypeValue.sellTypeCode || sellTypeValue;


    _.merge( params, { airlineLCode: airlineCode } );
    _.merge( params, { airlineId: +airlineId } );

    _.merge( params, { sellCountry: sellCountry } );
    _.merge( params, { IdSellCountry: +IdSellCountry } );

    _.merge( params, { sellType: sellType } );
    _.merge( params, { idSellType: +idSellType } );

    _.merge( params, { sortvalue: 'last_name', from: 0, count: 10 } );

    params = airlineCode ? params : _.omit( params, [ 'airlineLCode', 'airlineId' ] );
    params = sellCountry ? params : _.omit( params, [ 'sellCountry', 'IdSellCountry' ] );
    params = sellType ? params : _.omit( params, [ 'sellType', 'idSellType' ] );
    this.router.navigate( [ '/crm/profile-search' ], { queryParams: params } );
    this.sendProfileParams = params;
    this.profileSearchService.getProfileSearch( this.sendProfileParams )
      .pipe( untilDestroyed( this ) )
      .subscribe( profile => {
        this.tableAsyncService.countPage = profile.totalRows;
        this.profiles = profile.result;
        this.isLoader = false;
        this.buttonCsvDisabled = false;
      } );
  }

  private isKeys( key: string, exception: string ): boolean {
    switch ( exception ) {
      case 'all':
        return key !== 'locationidfrom'
          && key !== 'locationidto'
          && key !== 'flightdatefrom'
          && key !== 'flightdateto'
          && key !== 'segmentation'
          && key !== 'customerGroup'
          && key !== 'airlineLCode'
          && key !== 'sellCountry'
          && key !== 'sellType'
          && key !== 'deptimefrominclude'
          && key !== 'deptimetoexclude'
          && key !== 'dobfrominclude'
          && key !== 'dobtoexclude'
          && key !== 'dateOfServiceFromInclude'
          && key !== 'dateOfServiceToExclude'
          && key !== 'dateTransFromInclude'
          && key !== 'dateTransToExclude'
          && key !== 'bookingcreatedatefrominclude'
          && key !== 'bookingcreatedatetoexclude'
          && key !== 'contactsexist';
      case 'data':
        return key === 'flightdatefrom'
          || key === 'flightdateto'
          || key === 'deptimefrominclude'
          || key === 'deptimetoexclude'
          || key === 'dobfrominclude'
          || key === 'dobtoexclude'
          || key === 'dateOfServiceFromInclude'
          || key === 'dateOfServiceToExclude'
          || key === 'dateTransFromInclude'
          || key === 'dateTransToExclude'
          || key === 'bookingcreatedatefrominclude'
          || key === 'bookingcreatedatetoexclude';
      case 'checkbox':
        return key === 'contactsexist';
      case 'airlineLCode':
        return key === 'airlineLCode';
      case 'sellType':
        return key === 'sellType';
      case 'sellCountry':
        return key === 'sellCountry';
    }
  }


  add( event: MatChipInputEvent, formControlName: string, chips: string ): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ( ( value || '' ).trim() ) {
      this[ chips ].push( value.trim() );
    }

    // Reset the input value
    if ( input ) {
      input.value = '';
    }

    this.formProfileSearch.get( formControlName ).setValue( null );
  }

  remove( textChip: string, arrayChips: string[], chips ): void {
    const index = arrayChips.indexOf( textChip );

    if ( index >= 0 ) {
      this[ chips ].splice( index, 1 );
    }
  }

  selected( event: MatAutocompleteSelectedEvent, formControlName: string, chips: string, fruitInput: string ): void {
    this[ chips ].push( event.option.viewValue );
    this[ fruitInput ].nativeElement.value = '';
    this.formProfileSearch.get( formControlName ).setValue( null );
  }

  sendForm(): void {
    if ( !this.formProfileSearch.invalid ) {
      this.creatingObjectForm();
    }
  }

  clearForm(): void {
    this.resetForm();
    this.buttonCsvDisabled = true;
    this.router.navigate( [ '/crm/profile-search' ], { queryParams: {} } );
  }

  downloadCsv(): void {
    this.buttonCsvDisabled = true;
    this.csvLoader = true;
    this.profileSearchService.downloadCsv( this.sendProfileParams )
      .pipe( untilDestroyed( this ) )
      .subscribe( resp => {
        const filename = resp.headers.get( 'content-disposition' ).split( ';' )[ 1 ].split( '=' )[ 1 ];
        saveAs( resp.body, filename );
        this.buttonCsvDisabled = false;
        this.csvLoader = false;
      }, _ => {
        this.buttonCsvDisabled = false;
        this.csvLoader = false;
      } );
  }

  private resetForm() {
    this.segmentationChips = [];
    this.customerGroupChips = [];
    for ( const formControlName in this.formProfileSearch.value ) {
      this.formProfileSearch.get( `${formControlName}` ).patchValue( '' );
      this.formProfileSearch.get( `${formControlName}` ).setErrors( null );
    }
  }

  private activeButton() {
    const isChips = () => R.length( this.segmentationChips ) === 0 && R.length( this.customerGroupChips ) === 0;

    const isFormInvalid = R.curry( ( objForm: any, value ) => R.isNil( value ) || objForm.invalid );
    const isFormValOfInv = isFormInvalid( this.formProfileSearch );
    const funcMapKeys = R.curry( ( objForm, value, key ) => objForm.get( `${key}` ).value === '' || isFormValOfInv( objForm.get( `${key}` ).value ) );
    // @ts-ignore
    const mapKeyFormObj = R.curry( ( objForm: any, objFormValue ) => _.mapKeys( objFormValue, funcMapKeys( objForm ) ) );
    const getBooleanObj = mapKeyFormObj( this.formProfileSearch );
    const isSizeObj = objFormValue => _.size( objFormValue ) === 1;
    const isActiveButtonSearch = R.compose( isSizeObj, getBooleanObj );

    this.formProfileSearch.valueChanges
      .pipe(
        untilDestroyed( this ),
        map( () => isActiveButtonSearch( this.formProfileSearch.value ) )
      )
      .subscribe( isValue => this.buttonSearch = isValue && isChips() );
  }


  ngOnDestroy(): void {}

}
