import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { AddSegmentationService } from './add-segmentation.service';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';
import * as _ from 'lodash';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, forkJoin, Observable, timer } from 'rxjs';
import { IpagPage } from '../../../interface/ipag-page';
import * as moment from 'moment';
import { IAirport } from '../../../interface/iairport';
import { ProfileSearchService } from '../../profiles/profile-search/profile-search.service';
import { TableAsyncService } from '../../../services/table-async.service';
import * as R from 'ramda';
import { SaveUrlServiceService } from '../../../services/save-url-service.service';
import { IAirlineLCode } from '../../../interface/iairline-lcode';


import { untilDestroyed } from 'ngx-take-until-destroy';
import { ISellType } from '../../../interface/isell-type';

@Component( {
  selector: 'app-add-segmentation',
  templateUrl: './add-segmentation.component.html',
  styleUrls: [ './add-segmentation.component.styl' ]
} )
export class AddSegmentationComponent implements OnInit, OnDestroy {

  public isFormSegmentation: boolean;
  public formSegmentation: FormGroup;
  public formSegmentationStepper: FormGroup;
  public segmentationProfiles: ISegmentationProfile;
  public buttonSave: boolean;
  public buttonCreate: boolean;
  public buttonDelete: boolean;
  public buttonSearch: boolean;
  public isLoader: boolean;
  public isTable: boolean;
  public resetRadioButtonFood: boolean;
  public resetRadioButtonCurrentRange: boolean;
  public airlineLCodeOptionsT: Observable<IAirlineLCode[]>;
  public airlineLCodeOptionsE: Observable<IAirlineLCode[]>;
  public airportsFromOptionsT: Observable<IAirport[]>;
  public airportsToOptionsT: Observable<IAirport[]>;
  public airportsFromOptionsE: Observable<IAirport[]>;
  public airportsToOptionsE: Observable<IAirport[]>;
  public sellTypeOptionsE: Observable<ISellType[]>;
  public selectedTimeT: string;
  public selectedTimeE: string;
  public isIconsClockT: boolean;
  public isIconsClockE: boolean;

  private controlsConfig: any;

  private segmentationId: number;
  private saveSegmentationParams: any = {};
  private createSegmentationParams: any = {};
  private autDelay: number = 500;
  private arrFormGroup: string[];

  @ViewChild( 'stepper', { static: false } ) stepper;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private addSegmentationService: AddSegmentationService,
    private dialog: MatDialog,
    private tableAsyncService: TableAsyncService,
    private profileSearchService: ProfileSearchService,
    private saveUrlServiceService: SaveUrlServiceService,
  ) { }

  ngOnInit(): void {

    this.buttonSave = false;
    this.buttonCreate = true;
    this.buttonDelete = true;
    this.buttonSearch = true;
    this.isLoader = true;
    this.resetRadioButtonFood = false;
    this.resetRadioButtonCurrentRange = false;
    this.isFormSegmentation = false;
    this.arrFormGroup = [ 'formSegmentation', 'formSegmentationStepper' ];
    this.isIconsClockT = false;
    this.isIconsClockE = false;

    this.initFormControl();
    this.initFormSegmentation();
    this.initQueryParams();
    this.formInputDisable();
    this.initTableProfilePagination();
    this.initAutocomplete( 'formSegmentationStepper' );
    this.initAutocomplete( 'formSegmentation' );
    this.initFieldClock();
    this.addSegmentationService.subjectDeleteSegmentation
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => this.clearForm() );
    this.saveUrlServiceService.subjectEvent401
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => {
        this.router.navigate( [ '/crm/edit-segmentation' ], { queryParams: { saveFormParams: JSON.stringify( this.segmentationParameters() ) } } );
      } );
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( untilDestroyed( this ) )
      .subscribe( params => {
        const hasSaveFormParams = R.has( 'saveFormParams' );
        const hasSegmentationId = R.has( 'segmentationId' );
        if ( hasSegmentationId( params ) ) {
          this.buttonSave = true;
          this.buttonCreate = false;
          this.buttonDelete = false;
          this.buttonSearch = false;
          this.isFormSegmentation = true;
          this.segmentationId = +params.segmentationId;
          this.formFilling( this.segmentationId );
          this.initAutocomplete( 'formSegmentation' );
          this.formSegmentation.get( 'segmentationGranularity' ).disable();
        } else if ( hasSaveFormParams( params ) ) {
          this.saveForm( params );
        }
      } );
  }


  public displayFn( option ): string | undefined {
    return R.is( Object, option ) ? option.title : option;
  }

  public displaySellTypeCodeFn( option ): string | undefined {
    return R.is( Object, option ) ? option.sellTypeCode : option;
  }

  public initAutocomplete( formGroup ) {
    this.airportsFromOptionsT = this.autocomplete( formGroup, 'departureLocationCodeT' );
    this.airportsToOptionsT = this.autocomplete( formGroup, 'arrivalLocationCodeT' );
    this.airportsFromOptionsE = this.autocomplete( formGroup, 'departureLocationCodeE' );
    this.airportsToOptionsE = this.autocomplete( formGroup, 'arrivalLocationCodeE' );
    this.airlineLCodeOptionsT = this.autocomplete( formGroup, 'airlineLCodeIdT' );
    this.airlineLCodeOptionsE = this.autocomplete( formGroup, 'airlineLCodeIdE' );
    this.sellTypeOptionsE = this[ formGroup ].get( 'emdSellTypeE' ).valueChanges
      .pipe(
        debounceTime( this.autDelay ),
        switchMap( ( text: string ) => {
          if ( _.size( text ) ) {
            return this.profileSearchService.getSellType( encodeURI( text ) );
          }
          return EMPTY;
        } ),
      ) as Observable<ISellType[]>;
  }

  private invertDate( minutes: number ): string {
    const day = _.padStart( Math.floor( minutes / 60 / 24 ) + '', 2, '0' );
    const hour = _.padStart( Math.floor( minutes / 60 % 24 ) + '', 2, '0' );
    const min = _.padStart( Math.floor( minutes % 60 ) + '', 2, '0' );
    const date = `${day} ${hour}:${min}`;
    return R.isNil( minutes ) ? '' : date;
  }

  private invertMinutes( date: string ): number | string {
    const day = +_.chain( date ).split( ' ' ).head().value();
    const time = _.chain( date ).split( ' ' ).last().value();
    const hour = +_.chain( time ).split( ':' ).head().value();
    const min = +_.chain( time ).split( ':' ).last().value();
    const asMinutes = ( day * 24 * 60 ) + ( hour * 60 ) + min;
    return date === '' ? '' : asMinutes;
  }

  private autocomplete( formGroup: string, formControlName: string ): Observable<any> {
    if ( formControlName === 'airlineLCodeIdT' || formControlName === 'airlineLCodeIdE' ) {
      return this[ formGroup ].get( formControlName ).valueChanges
        .pipe(
          debounceTime( this.autDelay ),
          switchMap( ( text: string ) => {
            if ( _.size( text ) > 0 ) {
              return this.profileSearchService.getAirlineCodes( encodeURI( text ) );
            }
            return EMPTY;
          } ),
        ) as Observable<IAirlineLCode[]>;
    }
    return this[ formGroup ].get( formControlName ).valueChanges
      .pipe(
        debounceTime( this.autDelay ),
        switchMap( ( text: string ) => {
          if ( _.size( text ) > 0 ) {
            return this.profileSearchService.getAirports( encodeURI( text ) );
          }
          return EMPTY;
        } ),
      ) as Observable<IAirport[]>;

  }


  private formFilling( id ) {
    const getSegmentationParams$ = this.addSegmentationService.getSegmentationParams( id ).pipe( untilDestroyed( this ) );
    getSegmentationParams$.pipe(
      map( segmentationParams => {
        const segmentsCountToExclude = _.parseInt( this.formSegmentation.get( 'segmentsCountToExclude' ).value ) - 1;
        this.formSegmentation.get( 'segmentationTitle' ).patchValue( segmentationParams.segmentationTitle || '' );
        this.formSegmentation.get( 'segmentationGranularity' ).patchValue( segmentationParams.segmentationGranularity + '' || '' );
        _( segmentationParams ).each( ( value, key ) => {
          if ( !_.isNull( value ) && !_.isNaN( value ) ) {
            if ( ( key === 'payment' && !!value ) || ( key === 'segment' && !!value ) ) this.formSegmentation.get( 'subjectAnalysis' ).patchValue( key );
            if ( ( key === 'ticket' && !!value ) || ( key === 'emd' && !!value ) ) value = _.omit( value, [ 'airlineLCodeIdT', 'airlineLCodeIdE' ] );
            this.formSegmentation.patchValue( value );
          }
        } );
        if ( !_.isNull( segmentsCountToExclude ) && !_.isNaN( segmentsCountToExclude ) ) this.formSegmentation.get( 'segmentsCountToExclude' ).patchValue( segmentsCountToExclude );
        return segmentationParams;
      } ),
      switchMap( segmentationParams => {
        if ( segmentationParams.ticket ) {
          const text = segmentationParams.ticket.airlineLCodeIdT;
          this.formSegmentation.get( 'timeBeforeDepartureT' ).patchValue( this.invertDate( segmentationParams.ticket.timeBeforeDepartureT ) );
          if ( _.size( text ) > 0 ) {
            return this.profileSearchService.getAirlineCodes( encodeURI( text ) );
          }
          return EMPTY;
        }
        if ( segmentationParams.emd ) {
          const text = segmentationParams.emd.airlineLCodeIdE;
          this.formSegmentation.get( 'timeBeforeDepartureE' ).patchValue( this.invertDate( segmentationParams.emd.timeBeforeDepartureE ) );
          if ( _.size( text ) > 0 ) {
            return this.profileSearchService.getAirlineCodes( encodeURI( text ) );
          }
          return EMPTY;
        }
      } )
    ).subscribe();
  }

  private initFormControl() {
    this.controlsConfig = {
      segmentationTitle: [ '', Validators.required ],
      segmentationGranularity: [ '', Validators.required ],
      dispatchTime: '',
      dobFromInclude: '',
      dobToExclude: '',
      withChild: '',
      gender: '',
      subjectAnalysis: '',
      bookingCreateDateFromInclude: '',
      bookingCreateDateToExclude: '',
      moneyAmountFromInclude: [ '', Validators.required ],
      moneyAmountToExclude: [ '', Validators.required ],
      currency: '',
      eDocTypeP: [ '', Validators.required ],
      segmentsCountFromInclude: [ '', Validators.required ],
      segmentsCountToExclude: [ '', Validators.required ],
      eDocTypeS: [ '', Validators.required ],
      currentRange: '',
      timeBeforeDepartureT: '',
      airlineLCodeIdT: '',
      flightNoT: '',
      arrivalDFromIncludeT: '',
      arrivalDToExcludeT: '',
      departureLocationCodeT: '',
      arrivalLocationCodeT: '',
      cabinT: '',
      rbdT: '',
      fareCodeT: '',
      posGdsT: '',
      posIdT: '',
      posAgencyT: '',
      timeBeforeDepartureE: '',
      airlineLCodeIdE: '',
      flightNoE: '',
      arrivalDFromIncludeE: '',
      arrivalDToExcludeE: '',
      departureLocationCodeE: '',
      arrivalLocationCodeE: '',
      serviceCodeE: '',
      notServiceCodeE: '',
      posGdsE: '',
      posIdE: '',
      posAgencyE: '',
      emdSellTypeE: '',
      craftE: '',
      dateOfServiceFromIncludeE: '',
      dateOfServiceToExcludeE: '',
      dateTransFromIncludeE: '',
      dateTransToExcludeE: ''
    };
  }

  private initFormSegmentation() {
    const mapForm = R.curry( ( controlsConfig: any, formGroup: string ) => {
      this[ formGroup ] = this.fb.group( controlsConfig );
    } );
    const initFbGroup = R.map( mapForm( this.controlsConfig ) );

    initFbGroup( this.arrFormGroup );
    this.formInputDisable();
  }

  private formInputDisable() {
    _( this.arrFormGroup ).each( formGroupName => {
      _( [
        'moneyAmountFromInclude', 'moneyAmountToExclude', 'eDocTypeP', 'currency',
        'segmentsCountFromInclude', 'segmentsCountToExclude', 'eDocTypeS'
      ] )
        .each( values => this[ formGroupName ].get( values ).disable() );

      this[ formGroupName ].get( 'subjectAnalysis' ).valueChanges
        .pipe( untilDestroyed( this ) )
        .subscribe( params => {
          _( this[ formGroupName ].getRawValue() ).each( () => {
            _( [ 'moneyAmountFromInclude', 'moneyAmountToExclude', 'currency', 'eDocTypeP' ] )
              .each( value => {
                this[ formGroupName ].get( value )[ params !== 'payment' ? 'disable' : 'enable' ]();
                this[ formGroupName ].get( value ).patchValue( '' );
              } );
            _( [ 'segmentsCountFromInclude', 'segmentsCountToExclude', 'eDocTypeS' ] )
              .each( value => {
                this[ formGroupName ].get( value )[ params !== 'segment' ? 'disable' : 'enable' ]();
                this[ formGroupName ].get( value ).patchValue( '' );
              } );
          } );
          this.resetRadioButtonFood = !!params;
        } );

      _( this[ formGroupName ].getRawValue() ).each( ( values, key ) => {
        if ( key === 'eDocTypeS' ) {
          this[ formGroupName ].get( key ).valueChanges
            .pipe( untilDestroyed( this ) )
            .subscribe( params => {
              _( [
                'airlineLCodeIdT', 'flightNoT', 'arrivalDFromIncludeT',
                'arrivalDToExcludeT', 'departureLocationCodeT', 'arrivalLocationCodeT', 'cabinT',
                'rbdT', 'fareCodeT', 'posGdsT', 'posIdT', 'posAgencyT', 'timeBeforeDepartureT'
              ] )
                .each( formControlName => {
                  this.isIconsClockT = params === 'T';
                  this[ formGroupName ].get( formControlName )[ params !== 'T' ? 'disable' : 'enable' ]();
                  this[ formGroupName ].get( formControlName ).patchValue( '' );
                } );
              _( [
                'airlineLCodeIdE', 'flightNoE', 'arrivalDFromIncludeE',
                'arrivalDToExcludeE', 'departureLocationCodeE', 'arrivalLocationCodeE',
                'serviceCodeE', 'notServiceCodeE', 'posGdsE', 'posIdE', 'posAgencyE', 'timeBeforeDepartureE',
                'emdSellTypeE', 'dateOfServiceFromIncludeE', 'dateOfServiceToExcludeE', 'dateTransFromIncludeE', 'dateTransToExcludeE',
                'craftE'
              ] )
                .each( formControlName => {
                  this.isIconsClockE = params === 'E';
                  this[ formGroupName ].get( formControlName )[ params !== 'E' ? 'disable' : 'enable' ]();
                  this[ formGroupName ].get( formControlName ).patchValue( '' );
                } );
            } );
        } else if ( key === 'eDocTypeP' ) {
          this[ formGroupName ].get( key ).valueChanges
            .pipe( untilDestroyed( this ) )
            .subscribe( params => {
              _( [
                'airlineLCodeIdT', 'flightNoT', 'arrivalDFromIncludeT',
                'arrivalDToExcludeT', 'departureLocationCodeT', 'arrivalLocationCodeT', 'cabinT',
                'rbdT', 'fareCodeT', 'posGdsT', 'posIdT', 'posAgencyT', 'timeBeforeDepartureT'
              ] )
                .each( formControlName => {
                  this[ formGroupName ].get( formControlName )[ params !== 'T' ? 'disable' : 'disable' ]();
                  this[ formGroupName ].get( formControlName ).patchValue( '' );
                } );
              _( [
                'airlineLCodeIdE', 'flightNoE', 'arrivalDFromIncludeE',
                'arrivalDToExcludeE', 'departureLocationCodeE', 'arrivalLocationCodeE',
                'serviceCodeE', 'notServiceCodeE', 'posGdsE', 'posIdE', 'posAgencyE', 'timeBeforeDepartureE',
                'emdSellTypeE', 'dateOfServiceFromIncludeE', 'dateOfServiceToExcludeE', 'dateTransFromIncludeE', 'dateTransToExcludeE',
                'craftE'
              ] )
                .each( formControlName => {
                  this.isIconsClockE = params === 'E';
                  this[ formGroupName ].get( formControlName )[ params !== 'E' ? 'disable' : 'enable' ]();
                  this[ formGroupName ].get( formControlName ).patchValue( '' );
                } );
            } );
        }
      } );
    } );
  }


  private initFieldClock() {
    _.each( this.arrFormGroup, formGroup => {
      this[ formGroup ].get( 'timeBeforeDepartureT' ).valueChanges
        .pipe( untilDestroyed( this ) )
        .subscribe( value => this.selectedTimeT = value );

      this[ formGroup ].get( 'timeBeforeDepartureE' ).valueChanges
        .pipe( untilDestroyed( this ) )
        .subscribe( value => this.selectedTimeE = value );
    } );
  }

  private resetForm() {
    const formGroups = R.curry( ( method, formGroup, value, key ) => formGroup.get( key )[ method ]( null ) );
    const mapFormGroup = R.curry( ( method: string, formGroup: any ) => {
      const keysFormGroup = formGroups( method, this[ formGroup ] );
      const formGroupValue = R.forEachObjIndexed( keysFormGroup );
      formGroupValue( this[ formGroup ].value );
    } );
    const formPatchValue = R.map( mapFormGroup( 'patchValue' ) );
    const formSetErrors = R.map( mapFormGroup( 'setErrors' ) );
    const resetForm = R.juxt( [ formPatchValue, formSetErrors ] );
    resetForm( this.arrFormGroup );
    this.buttonSave = false;
    this.buttonCreate = true;
    this.buttonSearch = true;
    this.buttonDelete = true;
    this.saveSegmentationParams = {};
  }

  private initTableProfilePagination() {
    this.tableAsyncService.subjectPage
      .pipe( untilDestroyed( this ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          'segmentationId': this.segmentationId,
          from: pageIndex,
          count: value.pageSize
        };
        this.addSegmentationService.getProfiles( paramsAndCount )
          .pipe( untilDestroyed( this ) )
          .subscribe( ( segmentationProfiles: ISegmentationProfile ) => this.tableAsyncService.setTableDataSource( segmentationProfiles.customers ) );
      } );
  }

  private initTableProfile( id: number ) {
    const params = {
      segmentationId: id,
      from: 0,
      count: 10
    };
    this.addSegmentationService.getProfiles( params )
      .pipe( untilDestroyed( this ) )
      .subscribe( ( segmentationProfiles: ISegmentationProfile ) => {
        this.tableAsyncService.countPage = segmentationProfiles.totalCount;
        this.segmentationProfiles = segmentationProfiles;
        this.isLoader = false;
      } );
  }


  private windowDialog( messDialog: string, params: string, card: string = '', disableTimer: boolean = false ) {
    this.dialog.open( DialogComponent, {
      data: {
        message: messDialog,
        status: params,
        params: this.segmentationId,
        card,
      },
    } );
    if ( !disableTimer ) {
      timer( 1500 )
        .pipe( untilDestroyed( this ) )
        .subscribe( _ => {
          this.dialog.closeAll();
        } );
    }
  }

  private segmentationParameters() {
    const segmentationParameters = {
      segmentationTitle: this.formSegmentation.get( 'segmentationTitle' ).value,
      segmentationGranularity: this.formSegmentation.get( 'segmentationGranularity' ).value,
      customer: {
        dobFromInclude: this.formSegmentation.get( 'dobFromInclude' ).value ?
          moment( this.formSegmentation.get( 'dobFromInclude' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        dobToExclude: this.formSegmentation.get( 'dobToExclude' ).value ?
          moment( this.formSegmentation.get( 'dobToExclude' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        withChild: this.formSegmentation.get( 'withChild' ).value,
        gender: this.formSegmentation.get( 'gender' ).value,
      },
      booking: {
        bookingCreateDateFromInclude: this.formSegmentation.get( 'bookingCreateDateFromInclude' ).value ?
          moment( this.formSegmentation.get( 'bookingCreateDateFromInclude' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        bookingCreateDateToExclude: this.formSegmentation.get( 'bookingCreateDateToExclude' ).value ?
          moment( this.formSegmentation.get( 'bookingCreateDateToExclude' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : ''
      },
      payment: {
        moneyAmountFromInclude: _.parseInt( this.formSegmentation.get( 'moneyAmountFromInclude' ).value ),
        moneyAmountToExclude: _.parseInt( this.formSegmentation.get( 'moneyAmountToExclude' ).value ),
        currency: this.formSegmentation.get( 'currency' ).value,
        eDocTypeP: this.formSegmentation.get( 'eDocTypeP' ).value
      },
      segment: {
        segmentsCountFromInclude: _.parseInt( this.formSegmentation.get( 'segmentsCountFromInclude' ).value ),
        segmentsCountToExclude: _.parseInt( this.formSegmentation.get( 'segmentsCountToExclude' ).value ) + 1,
        eDocTypeS: this.formSegmentation.get( 'eDocTypeS' ).value
      },
      ticket: {
        timeBeforeDepartureT: this.invertMinutes( this.formSegmentation.get( 'timeBeforeDepartureT' ).value ),
        arrivalDFromIncludeT: this.formSegmentation.get( 'arrivalDFromIncludeT' ).value ?
          moment( this.formSegmentation.get( 'arrivalDFromIncludeT' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        arrivalDToExcludeT: this.formSegmentation.get( 'arrivalDToExcludeT' ).value ?
          moment( this.formSegmentation.get( 'arrivalDToExcludeT' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        airlineLCodeIdT: _.has( this.formSegmentation.get( 'airlineLCodeIdT' ).value, 'idAirline' ) ?
          this.formSegmentation.get( 'airlineLCodeIdT' ).value.idAirline :
          this.formSegmentation.get( 'airlineLCodeIdT' ).value,
        flightNoT: this.formSegmentation.get( 'flightNoT' ).value,
        departureLocationCodeT: this.formSegmentation.get( 'departureLocationCodeT' ).value,
        arrivalLocationCodeT: this.formSegmentation.get( 'arrivalLocationCodeT' ).value,
        cabinT: this.formSegmentation.get( 'cabinT' ).value,
        rbdT: this.formSegmentation.get( 'rbdT' ).value,
        fareCodeT: this.formSegmentation.get( 'fareCodeT' ).value,
        posGdsT: this.formSegmentation.get( 'posGdsT' ).value,
        posIdT: this.formSegmentation.get( 'posIdT' ).value,
        posAgencyT: this.formSegmentation.get( 'posAgencyT' ).value,
      },
      emd: {
        timeBeforeDepartureE: this.invertMinutes( this.formSegmentation.get( 'timeBeforeDepartureE' ).value ),
        arrivalDFromIncludeE: this.formSegmentation.get( 'arrivalDFromIncludeE' ).value ?
          moment( this.formSegmentation.get( 'arrivalDFromIncludeE' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        arrivalDToExcludeE: this.formSegmentation.get( 'arrivalDToExcludeE' ).value ?
          moment( this.formSegmentation.get( 'arrivalDToExcludeE' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        airlineLCodeIdE: _.has( this.formSegmentation.get( 'airlineLCodeIdE' ).value, 'idAirline' ) ?
          this.formSegmentation.get( 'airlineLCodeIdE' ).value.idAirline :
          this.formSegmentation.get( 'airlineLCodeIdE' ).value,
        flightNoE: this.formSegmentation.get( 'flightNoE' ).value,
        departureLocationCodeE: this.formSegmentation.get( 'departureLocationCodeE' ).value,
        arrivalLocationCodeE: this.formSegmentation.get( 'arrivalLocationCodeE' ).value,
        serviceCodeE: this.formSegmentation.get( 'serviceCodeE' ).value,
        notServiceCodeE: this.formSegmentation.get( 'notServiceCodeE' ).value,
        posGdsE: this.formSegmentation.get( 'posGdsE' ).value,
        posIdE: this.formSegmentation.get( 'posIdE' ).value,
        posAgencyE: this.formSegmentation.get( 'posAgencyE' ).value,
        emdSellTypeE: _.has( this.formSegmentation.get( 'emdSellTypeE' ).value.idSellType, 'idAirline' ) ?
          this.formSegmentation.get( 'emdSellTypeE' ).value.idSellType :
          this.formSegmentation.get( 'emdSellTypeE' ).value,
        craftE: this.formSegmentation.get( 'craftE' ).value,
        dateOfServiceFromIncludeE: this.formSegmentation.get( 'dateOfServiceFromIncludeE' ).value ?
          moment( this.formSegmentation.get( 'dateOfServiceFromIncludeE' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        dateOfServiceToExcludeE: this.formSegmentation.get( 'dateOfServiceToExcludeE' ).value ?
          moment( this.formSegmentation.get( 'dateOfServiceToExcludeE' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        dateTransFromIncludeE: this.formSegmentation.get( 'dateTransFromIncludeE' ).value ?
          moment( this.formSegmentation.get( 'dateTransFromIncludeE' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        dateTransToExcludeE: this.formSegmentation.get( 'dateTransToExcludeE' ).value ?
          moment( this.formSegmentation.get( 'dateTransToExcludeE' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
      },
    };

    const filterSegmentationParameters = {};

    _( segmentationParameters ).each( ( parentValue, parentKey ) => {
      _( parentValue ).each( childrenValue => {
        if ( !!childrenValue ) {
          _.set( filterSegmentationParameters, parentKey, parentValue );
        }
      } );
    } );
    return filterSegmentationParameters;
  }

  resetRadioButton( formControlName: string ): void {
    this.formSegmentation.get( formControlName ).patchValue( '' );
  }

  changeForm(): void {
    this.isFormSegmentation = true;
    this.formSegmentation.patchValue( this.formSegmentationStepper.value );
    this.initAutocomplete( 'formSegmentation' );
  }

  saveForm( queryParams: any = '' ): void {
    const hasSaveFormParams = R.has( 'saveFormParams' );
    const isQueryParams = hasSaveFormParams( queryParams );
    const saveFormParams = isQueryParams ? JSON.parse( queryParams.saveFormParams ) : '';
    if ( !this.formSegmentation.invalid || isQueryParams ) {
      this.saveSegmentationParams = isQueryParams ? saveFormParams : this.segmentationParameters();
      if ( !R.isEmpty( this.saveSegmentationParams ) ) {
        this.addSegmentationService.saveSegmentation( this.saveSegmentationParams )
          .pipe( untilDestroyed( this ) )
          .subscribe( value => {
            this.windowDialog( `DIALOG.OK.SEGMENTATION_SAVE`, 'ok' );
            this.router.navigate( [ `/crm/edit-segmentation/` ], { queryParams: { segmentationId: value.segmentationId } } );
          } );
      }
    }
  }

  createForm(): void {
    if ( !this.formSegmentation.invalid ) {
      this.createSegmentationParams = this.segmentationParameters();
      _( this.createSegmentationParams ).set( 'segmentationId', this.segmentationId ).value();
      this.addSegmentationService.updateSegmentation( this.createSegmentationParams )
        .pipe( untilDestroyed( this ) )
        .subscribe( _ => {
          this.windowDialog( `DIALOG.OK.SEGMENTATION_CHANGED`, 'ok' );
          this.router.navigate( [ '/crm/edit-segmentation' ], { queryParams: { segmentationId: this.segmentationId } } );
        } );
    }
  }

  searchForm(): void {
    this.isTable = true;
    this.isLoader = true;
    this.initTableProfile( this.segmentationId );
  }

  deleteSegmentation(): void {
    this.windowDialog( `DIALOG.DELETE.SEGMENTATION`, 'delete', 'deleteSegmentation', true );
  }

  clearForm(): void {
    this.formSegmentation.get( 'segmentationGranularity' ).enabled;
    this.isFormSegmentation = false;
    this.initAutocomplete( 'formSegmentationStepper' );
    timer( 100 )
      .pipe( untilDestroyed( this ) )
      .subscribe( _ => {
        this.resetForm();
      } );
    this.router.navigate( [ '/crm/add-segmentation' ], { queryParams: {} } );
  }

  ngOnDestroy(): void {}

}
