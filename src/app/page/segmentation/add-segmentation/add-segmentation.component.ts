import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, map, takeWhile } from 'rxjs/operators';
import { AddSegmentationService } from './add-segmentation.service';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';
import * as _ from 'lodash';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { Observable, timer } from 'rxjs';
import { IpagPage } from '../../../interface/ipag-page';
import * as moment from 'moment';
import { IAirport } from '../../../interface/iairport';
import { ProfileSearchService } from '../../profiles/profile-search/profile-search.service';
import { TableAsyncService } from '../../../services/table-async.service';
import * as R from 'ramda';
import { SaveUrlServiceService } from '../../../services/save-url-service.service';


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
  public airports: IAirport[];
  public airportsFromOptionsT: Observable<IAirport[]>;
  public airportsToOptionsT: Observable<IAirport[]>;
  public airportsFromOptionsE: Observable<IAirport[]>;
  public airportsToOptionsE: Observable<IAirport[]>;

  private controlsConfig: any;
  private isActive: boolean;
  private segmentationId: number;
  private segmentationParams: any;
  private saveSegmentationParams: any = {};
  private createSegmentationParams: any = {};
  private autDelay: number = 500;
  private arrFormGroup: string[];

  @ViewChild('stepper', { static: false }) stepper;

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
    this.isActive = true;
    this.buttonSave = false;
    this.buttonCreate = true;
    this.buttonDelete = true;
    this.buttonSearch = true;
    this.isLoader = true;
    this.resetRadioButtonFood = false;
    this.resetRadioButtonCurrentRange = false;
    this.isFormSegmentation = false;
    this.arrFormGroup = [ 'formSegmentation', 'formSegmentationStepper' ];

    this.initFormControl();
    this.initFormSegmentation();
    this.initQueryParams();
    this.formInputDisable();
    this.initTableProfilePagination();
    this.initAirports();
    this.initAutocomplete( 'formSegmentationStepper' );
    this.initAutocomplete( 'formSegmentation' );
    this.addSegmentationService.subjectDeleteSegmentation
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.clearForm() );
    this.saveUrlServiceService.subjectEvent401
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.router.navigate( [ '/crm/addsegmentation' ], { queryParams: { saveFormParams: JSON.stringify( this.segmentationParameters() ) } } );
      } );
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( takeWhile( _ => this.isActive ) )
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
        } else if ( hasSaveFormParams( params ) ) {
          this.saveForm( params );
        }
      } );
  }

  private initAirports() {
    this.profileSearchService.getAirports()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IAirport[] ) => {
        this.airports = value;
      } );
  }

  private initAutocomplete( formGroup ) {
    this.airportsFromOptionsT = this.autocomplete( formGroup, 'departureLocationCodeT' );
    this.airportsToOptionsT = this.autocomplete( formGroup, 'arrivalLocationCodeT' );
    this.airportsFromOptionsE = this.autocomplete( formGroup, 'departureLocationCodeE' );
    this.airportsToOptionsE = this.autocomplete( formGroup, 'arrivalLocationCodeE' );
  }

  private autocomplete( formGroup: string, formControlName: string ): Observable<any> {
    const mapFilter = val => {
      if ( val ) {
        return this.airports.filter( location => location.locationCode.toLowerCase().includes( val.toLowerCase() ) );
      }
    };
    const whichForm = whichFormGroup => {
      return this[ whichFormGroup ].get( formControlName ).valueChanges
        .pipe(
          takeWhile( _ => this.isActive ),
          delay( this.autDelay ),
          map( mapFilter )
        );
    };
    return whichForm( formGroup );
  }


  private formFilling( id ) {
    this.addSegmentationService.getSegmentationParams( id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( segmentationParams => {
        this.segmentationParams = segmentationParams;
        this.formSegmentation.get( 'segmentationTitle' ).patchValue( segmentationParams.segmentationTitle || '' );
        _( segmentationParams ).each( ( value, key ) => {
          if ( !_.isNull( value ) && !_.isNaN( value ) ) {
            if ( ( key === 'payment' && !!value ) || ( key === 'segment' && !!value ) ) this.formSegmentation.get( 'subjectAnalysis' ).patchValue( key );
            this.formSegmentation.patchValue( value );
          }
        } );
        const segmentsCountToExclude = _.parseInt( this.formSegmentation.get( 'segmentsCountToExclude' ).value ) - 1;
        if ( !_.isNull( segmentsCountToExclude ) && !_.isNaN( segmentsCountToExclude ) ) {
          this.formSegmentation.get( 'segmentsCountToExclude' ).patchValue( segmentsCountToExclude );
        }
      } );
  }

  private initFormControl() {
    this.controlsConfig = {
      segmentationTitle: [ '', Validators.required ],
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
      flightNoE: '',
      arrivalDFromIncludeE: '',
      arrivalDToExcludeE: '',
      departureLocationCodeE: '',
      arrivalLocationCodeE: '',
      serviceCodeE: '',
      posGdsE: '',
      posIdE: '',
      posAgencyE: ''
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
        .pipe( takeWhile( _ => this.isActive ) )
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
            .pipe( takeWhile( _ => this.isActive ) )
            .subscribe( params => {
              _( [
                'flightNoT', 'arrivalDFromIncludeT', 'arrivalDToExcludeT',
                'departureLocationCodeT', 'arrivalLocationCodeT', 'cabinT',
                'rbdT', 'fareCodeT', 'posGdsT', 'posIdT', 'posAgencyT'
              ] )
                .each( formControlName => {
                  this[ formGroupName ].get( formControlName )[ params !== 'T' ? 'disable' : 'enable' ]();
                  this[ formGroupName ].get( formControlName ).patchValue( '' );
                } );
              _( [
                'flightNoE', 'arrivalDFromIncludeE', 'arrivalDToExcludeE',
                'departureLocationCodeE', 'arrivalLocationCodeE',
                'serviceCodeE', 'posGdsE', 'posIdE', 'posAgencyE'
              ] )
                .each( formControlName => {
                  this[ formGroupName ].get( formControlName )[ params !== 'E' ? 'disable' : 'enable' ]();
                  this[ formGroupName ].get( formControlName ).patchValue( '' );
                } );
            } );
        } else if( key === 'eDocTypeP'  ) {
          this[ formGroupName ].get( key ).valueChanges
            .pipe( takeWhile( _ => this.isActive ) )
            .subscribe( params => {
              _( [
                'flightNoT', 'arrivalDFromIncludeT', 'arrivalDToExcludeT',
                'departureLocationCodeT', 'arrivalLocationCodeT', 'cabinT',
                'rbdT', 'fareCodeT', 'posGdsT', 'posIdT', 'posAgencyT'
              ] )
                .each( formControlName => {
                  this[ formGroupName ].get( formControlName )[ params !== 'T' ? 'disable' : 'disable' ]();
                  this[ formGroupName ].get( formControlName ).patchValue( '' );
                } );
              _( [
                'flightNoE', 'arrivalDFromIncludeE', 'arrivalDToExcludeE',
                'departureLocationCodeE', 'arrivalLocationCodeE',
                'serviceCodeE', 'posGdsE', 'posIdE', 'posAgencyE'
              ] )
                .each( formControlName => {
                  this[ formGroupName ].get( formControlName )[ params !== 'E' ? 'disable' : 'enable' ]();
                  this[ formGroupName ].get( formControlName ).patchValue( '' );
                } );
            } );
        }
      } );
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
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          'segmentationId': this.segmentationId,
          from: pageIndex,
          count: value.pageSize
        };
        this.addSegmentationService.getProfiles( paramsAndCount )
          .pipe( takeWhile( _ => this.isActive ) )
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
      .pipe( takeWhile( _ => this.isActive ) )
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
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.dialog.closeAll();
        } );
    }
  }

  private segmentationParameters() {

    const segmentationParameters = {
      segmentationTitle: this.formSegmentation.get( 'segmentationTitle' ).value,
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
        arrivalDFromIncludeT: this.formSegmentation.get( 'arrivalDFromIncludeT' ).value ?
          moment( this.formSegmentation.get( 'arrivalDFromIncludeT' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        arrivalDToExcludeT: this.formSegmentation.get( 'arrivalDToExcludeT' ).value ?
          moment( this.formSegmentation.get( 'arrivalDToExcludeT' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
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
        arrivalDFromIncludeE: this.formSegmentation.get( 'arrivalDFromIncludeE' ).value ?
          moment( this.formSegmentation.get( 'arrivalDFromIncludeE' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        arrivalDToExcludeE: this.formSegmentation.get( 'arrivalDToExcludeE' ).value ?
          moment( this.formSegmentation.get( 'arrivalDToExcludeE' ).value ).format( 'YYYY-MM-DD' ) + 'T00:00:00' : '',
        flightNoE: this.formSegmentation.get( 'flightNoE' ).value,
        departureLocationCodeE: this.formSegmentation.get( 'departureLocationCodeE' ).value,
        arrivalLocationCodeE: this.formSegmentation.get( 'arrivalLocationCodeE' ).value,
        serviceCodeE: this.formSegmentation.get( 'serviceCodeE' ).value,
        posGdsE: this.formSegmentation.get( 'posGdsE' ).value,
        posIdE: this.formSegmentation.get( 'posIdE' ).value,
        posAgencyE: this.formSegmentation.get( 'posAgencyE' ).value
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
      _( this.saveSegmentationParams ).assign( isQueryParams ? saveFormParams : this.segmentationParameters() ).value();
      if ( !R.isEmpty( this.saveSegmentationParams ) ) {
        this.addSegmentationService.saveSegmentation( this.saveSegmentationParams )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( value => {
            this.windowDialog( `Сегментация успешно сохранена`, 'ok' );
            this.router.navigate( [ `/crm/addsegmentation/` ], { queryParams: { segmentationId: value.segmentationId } } );
          } );
      }
    }
  }

  createForm(): void {
    if ( !this.formSegmentation.invalid ) {
      _( this.createSegmentationParams )
        .assign( this.segmentationParameters() )
        .set( 'segmentationId', this.segmentationId )
        .value();
      this.addSegmentationService.updateSegmentation( this.createSegmentationParams )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.windowDialog( `Сегментация успешно изменена`, 'ok' );
          this.router.navigate( [ '/crm/addsegmentation' ], { queryParams: { segmentationId: this.segmentationId } } );
        } );
    }
  }

  searchForm(): void {
    this.isTable = true;
    this.isLoader = true;
    this.initTableProfile( this.segmentationId );
  }

  deleteSegmentation(): void {
    this.windowDialog( `Вы действительно хотите удалить группу сегментации  "${this.segmentationParams.segmentationTitle}" ?`, 'delete', 'deleteSegmentation', true );
  }

  clearForm(): void {
    this.isFormSegmentation = false;
    this.initAutocomplete( 'formSegmentationStepper' );
    timer( 100 )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => {
        this.resetForm();
      } );
    this.router.navigate( [ '/crm/addsegmentation' ], { queryParams: {} } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
