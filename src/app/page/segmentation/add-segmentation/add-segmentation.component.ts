import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { AddSegmentationService } from './add-segmentation.service';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { timer } from '../../../../../node_modules/rxjs/observable/timer';
import { MatDialog } from '@angular/material';


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
        this.formSegmentationNameGroup.patchValue( segmentationParams );
        _( segmentationParams ).each( value => {
          this.formSegmentation.patchValue( value );
        } );
      } );
  }

  private initFormSegmentationNameGroup() {
    this.formSegmentationNameGroup = this.fb.group( {
      segmentationTitle: ''
    } );
  }

  private initFormSegmentation() {
    this.formSegmentation = this.fb.group( {
      bookingCreateDateFromInclude: '',
      bookingCreateDateToExclude: '',
      moneyAmountFromInclude: '',
      moneyAmountToExclude: '',
      food: '',
      currentRange: ''
    } );
    this.formInputDisable();
  }

  private formInputDisable() {
    this.formSegmentation.get( 'food' ).valueChanges.subscribe( value => {
      this.formSegmentation.get( 'moneyAmountFromInclude' )[ value === '2' ? 'disable' : 'enable' ]();
      this.formSegmentation.get( 'moneyAmountToExclude' )[ value === '2' ? 'disable' : 'enable' ]();
      this.resetRadioButtonFood = !!value;
    } );

    this.formSegmentation.get( 'currentRange' ).valueChanges.subscribe( value => {
      this.formSegmentation.get( 'bookingCreateDateFromInclude' )[ value ? 'disable' : 'enable' ]();
      this.formSegmentation.get( 'bookingCreateDateToExclude' )[ value ? 'disable' : 'enable' ]();
      this.resetRadioButtonCurrentRange = !!value;
      if ( value ) {
        this.formSegmentation.get( 'bookingCreateDateFromInclude' ).patchValue( '' );
        this.formSegmentation.get( 'bookingCreateDateToExclude' ).patchValue( '' );
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
  }

  private initTableProfile( id: number ) {
    this.addSegmentationService.getProfiles( id ).subscribe( segmentationProfiles => {
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

  resetRadioButton( formControlName: string ): void {
    this.formSegmentation.get( formControlName ).patchValue( '' );
  }

  saveForm(): void {
    const segmentationParameters = {
      segmentationTitle: this.formSegmentationNameGroup.get( 'segmentationTitle' ).value,
      booking: {
        bookingCreateDateFromInclude: this.formSegmentation.get( 'bookingCreateDateFromInclude' ).value,
        bookingCreateDateToExclude: this.formSegmentation.get( 'bookingCreateDateToExclude' ).value
      },
      payment: {
        moneyAmountFromInclude: this.formSegmentation.get( 'moneyAmountFromInclude' ).value,
        moneyAmountToExclude: this.formSegmentation.get( 'moneyAmountToExclude' ).value
      }
    };
    console.log( segmentationParameters );
    this.addSegmentationService.saveSegmentation( segmentationParameters )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe();
  }

  searchForm(): void {
    this.isTable = true;
    this.initTableProfile( this.segmentationId );
  }

  deleteSegmentation(): void {
    this.windowDialog( `Вы действительно хотите удалить эту сегментацию ?`, 'delete', 'segmentation', true );
  }

  clearForm(): void {
    this.resetForm();
    this.router.navigate( [ '/crm/addsegmentation' ], { queryParams: {} } );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
