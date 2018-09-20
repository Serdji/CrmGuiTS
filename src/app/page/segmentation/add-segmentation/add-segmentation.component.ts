import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { AddSegmentationService } from './add-segmentation.service';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';
import * as _ from 'lodash';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { timer } from 'rxjs';


@Component( {
  selector: 'app-add-segmentation',
  templateUrl: './add-segmentation.component.html',
  styleUrls: [ './add-segmentation.component.styl' ]
} )
export class AddSegmentationComponent implements OnInit, OnDestroy {

  public formSegmentationNameGroup: FormGroup;
  public formSegmentation: FormGroup;
  public segmentationProfiles: ISegmentationProfile;
  public buttonSave: boolean;
  public buttonCreate: boolean;
  public buttonDelete: boolean;
  public buttonSearch: boolean;
  public isLoader: boolean;
  public isTable: boolean;
  public resetRadioButtonFood: boolean;
  public resetRadioButtonCurrentRange: boolean;

  private isActive: boolean;
  private segmentationId: number;
  private segmentationParams: any;
  private saveSegmentationParams: any = {};
  private createSegmentationParams: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private addSegmentationService: AddSegmentationService,
    private dialog: MatDialog,
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

    this.initFormSegmentationNameGroup();
    this.initFormSegmentation();
    this.initQueryParams();
    this.formInputDisable();
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        if ( params.id ) {
          this.buttonSave = true;
          this.buttonCreate = false;
          this.buttonDelete = false;
          this.buttonSearch = false;
          this.segmentationId = +params.id;
          this.formFilling( this.segmentationId );
        }
      } );
  }

  private formFilling( id ) {
    this.addSegmentationService.getSegmentationParams( id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( segmentationParams => {
        console.log( segmentationParams );
        this.segmentationParams = segmentationParams;
        this.formSegmentationNameGroup.patchValue( segmentationParams );
        _( segmentationParams ).each( ( value, key ) => {
          if ( !_.isNull( value ) ) {
            if ( ( key === 'payment' && !!value ) || ( key === 'segment' && !!value ) ) this.formSegmentation.get( 'subjectAnalysis' ).patchValue( key );
            this.formSegmentation.patchValue( value );
          }
        } );
      } );
  }

  private initFormSegmentationNameGroup() {
    this.formSegmentationNameGroup = this.fb.group( {
      segmentationTitle: [ '', Validators.required ]
    }, {
      updateOn: 'submit',
    } );
  }

  private initFormSegmentation() {
    this.formSegmentation = this.fb.group( {
      subjectAnalysis: '',
      bookingCreateDateFromInclude: '',
      bookingCreateDateToExclude: '',
      moneyAmountFromInclude: '',
      moneyAmountToExclude: '',
      eDocTypeP: [ '', Validators.required ],
      segmentsCountFromInclude: '',
      segmentsCountToExclude: '',
      eDocTypeS: [ '', Validators.required ],
      currentRange: '',
      flightNoT: '',
      flightNoE: '',
    }, {
      updateOn: 'submit',
    } );
    this.formInputDisable();
  }

  private formInputDisable() {

    _( this.formSegmentation.getRawValue() ).each( ( values, key ) => {
      if ( key !== 'subjectAnalysis' && key !== 'currentRange' && key !== 'bookingCreateDateFromInclude' && key !== 'bookingCreateDateToExclude' ) {
        this.formSegmentation.get( key ).disable();
      }
    } );

    this.formSegmentation.get( 'subjectAnalysis' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        _( this.formSegmentation.getRawValue() ).each( ( values, key ) => {
          if ( key === 'moneyAmountFromInclude' || key === 'moneyAmountToExclude' || key === 'eDocTypeP' ) {
            this.formSegmentation.get( key )[ params !== 'payment' ? 'disable' : 'enable' ]();
            this.formSegmentation.get( key ).patchValue( '' );
          }
          if ( key === 'segmentsCountFromInclude' || key === 'segmentsCountToExclude' || key === 'eDocTypeS' ) {
            this.formSegmentation.get( key )[ params !== 'segment' ? 'disable' : 'enable' ]();
            this.formSegmentation.get( key ).patchValue( '' );
          }
        } );
        this.resetRadioButtonFood = !!params;
      } );

    _( this.formSegmentation.getRawValue() ).each( ( values, key ) => {
      if ( key === 'eDocTypeP' || key === 'eDocTypeS' ) {
        this.formSegmentation.get( key ).valueChanges
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( params => {
            this.formSegmentation.get( 'flightNoT' )[ params !== 'T' ? 'disable' : 'enable' ]();

            this.formSegmentation.get( 'flightNoE' )[ params !== 'E' ? 'disable' : 'enable' ]();
          } );
      }
    } );

  }

  private resetForm() {
    this.formSegmentationNameGroup.get( 'segmentationTitle' ).patchValue( '' );
    this.formSegmentationNameGroup.get( 'segmentationTitle' ).setErrors( null );
    _( this.formSegmentation.value ).each( ( value, key ) => {
      this.formSegmentation.get( key ).patchValue( '' );
      this.formSegmentation.get( key ).setErrors( null );
    } );
    this.buttonSave = false;
    this.buttonCreate = true;
    this.buttonSearch = true;
    this.buttonDelete = true;
  }

  private initTableProfile( id: number ) {
    this.addSegmentationService.getProfiles( id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( segmentationProfiles => {
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
      segmentationTitle: this.formSegmentationNameGroup.get( 'segmentationTitle' ).value,
      booking: {
        bookingCreateDateFromInclude: this.formSegmentation.get( 'bookingCreateDateFromInclude' ).value,
        bookingCreateDateToExclude: this.formSegmentation.get( 'bookingCreateDateToExclude' ).value
      },
      payment: {
        moneyAmountFromInclude: this.formSegmentation.get( 'moneyAmountFromInclude' ).value,
        moneyAmountToExclude: this.formSegmentation.get( 'moneyAmountToExclude' ).value,
        eDocTypeP: this.formSegmentation.get( 'eDocTypeP' ).value
      },
      segment: {
        segmentsCountFromInclude: this.formSegmentation.get( 'segmentsCountFromInclude' ).value,
        segmentsCountToExclude: this.formSegmentation.get( 'segmentsCountToExclude' ).value,
        eDocTypeS: this.formSegmentation.get( 'eDocTypeS' ).value
      },
      ticket: {
        flightNoT: this.formSegmentation.get( 'flightNoT' ).value
      },
      emd: {
        flightNoE: this.formSegmentation.get( 'flightNoE' ).value
      },
    };

    const filterSegmentationParameters = {};

    _.each( segmentationParameters, ( parentValue, parentKey ) => {
      _.each( parentValue, childrenValue => {
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

  saveForm(): void {
    if ( !this.formSegmentationNameGroup.invalid && !this.formSegmentation.invalid ) {
      _.assign( this.saveSegmentationParams, this.segmentationParameters() );
      console.log( this.saveSegmentationParams );
      this.addSegmentationService.saveSegmentation( this.saveSegmentationParams )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.windowDialog( `Сегментация успешно сохранена`, 'ok' );
          this.resetForm();
        } );
    }
  }

  createForm(): void {
    if ( !this.formSegmentationNameGroup.invalid && !this.formSegmentation.invalid ) {
      _( this.createSegmentationParams )
        .assign( this.segmentationParameters() )
        .set( 'segmentationId', this.segmentationId )
        .value();
      console.log( this.createSegmentationParams );
      this.addSegmentationService.updateSegmentation( this.createSegmentationParams )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( _ => {
          this.windowDialog( `Сегментация успешно изменена`, 'ok' );
        } );
    }
  }

  searchForm(): void {
    this.isTable = true;
    this.initTableProfile( this.segmentationId );
  }

  deleteSegmentation(): void {
    this.windowDialog( `Вы действительно хотите удалить сегментацию  "${ this.segmentationParams.segmentationTitle }" ?`, 'delete', 'segmentation', true );
  }

  clearForm(): void {
    this.resetForm();
    this.router.navigate( [ '/crm/addsegmentation' ], { queryParams: {} } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
