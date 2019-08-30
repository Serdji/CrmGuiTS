import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { map, takeWhile } from 'rxjs/operators';
import { ISegmentation } from '../../../interface/isegmentation';
import { Observable, timer } from 'rxjs';
import * as R from 'ramda';
import { AddSegmentationService } from '../../segmentation/add-segmentation/add-segmentation.service';
import * as _ from 'lodash';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';
import { timePeriods } from './timePeriods';

@Component( {
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: [ './add-event.component.styl' ]
} )
export class AddEventComponent implements OnInit, OnDestroy {

  public formEvent: FormGroup;
  public segmentation: ISegmentation[];
  public segmentationOptions: Observable<ISegmentation[]>;
  public typeEvent: string;
  public maxSize: number;

  private isActive: boolean;
  private segmentationId: number;
  private totalCount: number;
  private multiplicityTime: number;

  constructor(
    private fb: FormBuilder,
    private listSegmentationService: ListSegmentationService,
    private addSegmentationService: AddSegmentationService,
  ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.maxSize = _.size( timePeriods );
    this.initFormEvent();
    this.initSegmentation();
    this.initAutocomplete();
    this.initTotalCount();
    this.initSwitchTypeEvent();
    timer( 0 ).subscribe( _ => this.setTimeMultiplicity( timePeriods[ '60min' ].seconds ) );
  }

  private initSegmentation() {
    this.listSegmentationService.getSegmentation()
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( segmentation => this.segmentation = segmentation );
  }

  private initFormEvent() {
    this.formEvent = this.fb.group( {
      titleEvent: [ '', [ Validators.required ] ],
      typeEvent: '',
      multiplicity: '',
      segmentation: ''
    } );
  }


  private initAutocomplete() {
    this.segmentationOptions = this.formEvent.get( 'segmentation' ).valueChanges
      .pipe(
        takeWhile( _ => this.isActive ),
        map( value => typeof value === 'string' ? value : value.title ),
        map( title => this.segmentation.filter( segmentation => segmentation.title.toLowerCase().includes( title.toLowerCase() ) ) )
      );
  }

  private initTotalCount() {
    this.formEvent.get( 'segmentation' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( segmentation => {
        console.log( segmentation );
        if ( _.isObject( segmentation ) ) {
          this.segmentationId = segmentation.segmentationId;
          const paramsAndCount = {
            'segmentationId': this.segmentationId,
            from: 0,
            count: 1
          };
          this.addSegmentationService.getProfiles( paramsAndCount )
            .pipe( takeWhile( _ => this.isActive ) )
            .subscribe( ( segmentationProfiles: ISegmentationProfile ) => this.totalCount = segmentationProfiles.totalCount );
        }
      } );
  }

  private initSwitchTypeEvent() {
    this.formEvent.get( 'typeEvent' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( event => this.typeEvent = event );
  }

  private setTimeMultiplicity( time: number ) {
    switch ( time ) {
      case timePeriods[ '5min' ].seconds: this.formEvent.get( 'multiplicity' ).patchValue( timePeriods[ '5min' ].index ); break;
      case timePeriods[ '10min' ].seconds: this.formEvent.get( 'multiplicity' ).patchValue( timePeriods[ '10min' ].index ); break;
      case timePeriods[ '15min' ].seconds: this.formEvent.get( 'multiplicity' ).patchValue( timePeriods[ '15min' ].index ); break;
      case timePeriods[ '30min' ].seconds: this.formEvent.get( 'multiplicity' ).patchValue( timePeriods[ '30min' ].index ); break;
      case timePeriods[ '60min' ].seconds: this.formEvent.get( 'multiplicity' ).patchValue( timePeriods[ '60min' ].index ); break;
      case timePeriods[ '3hours' ].seconds: this.formEvent.get( 'multiplicity' ).patchValue( timePeriods[ '3hours' ].index ); break;
      case timePeriods[ '6hours' ].seconds: this.formEvent.get( 'multiplicity' ).patchValue( timePeriods[ '6hours' ].index ); break;
      case timePeriods[ '8hours' ].seconds: this.formEvent.get( 'multiplicity' ).patchValue( timePeriods[ '8hours' ].index ); break;
      case timePeriods[ '12hours' ].seconds: this.formEvent.get( 'multiplicity' ).patchValue( timePeriods[ '12hours' ].index ); break;
      case timePeriods[ '24hours' ].seconds: this.formEvent.get( 'multiplicity' ).patchValue( timePeriods[ '24hours' ].index ); break;
    }
  }


  addEvent( event ): void {
    console.log( event );
  }

  public formatTime( value: number | null ): string {
    console.log( this.multiplicityTime );
    switch ( value ) {
      case timePeriods[ '5min' ].index:
        this.multiplicityTime = timePeriods[ '5min' ].seconds;
        return timePeriods[ '5min' ].formatTime;
        break;
      case timePeriods[ '10min' ].index:
        this.multiplicityTime = timePeriods[ '10min' ].seconds;
        return timePeriods[ '10min' ].formatTime;
        break;
      case timePeriods[ '15min' ].index:
        this.multiplicityTime = timePeriods[ '15min' ].seconds;
        return timePeriods[ '15min' ].formatTime;
        break;
      case timePeriods[ '30min' ].index:
        this.multiplicityTime = timePeriods[ '30min' ].seconds;
        return timePeriods[ '30min' ].formatTime;
        break;
      case timePeriods[ '60min' ].index:
        this.multiplicityTime = timePeriods[ '60min' ].seconds;
        return timePeriods[ '60min' ].formatTime;
        break;
      case timePeriods[ '3hours' ].index:
        this.multiplicityTime = timePeriods[ '3hours' ].seconds;
        return timePeriods[ '3hours' ].formatTime;
        break;
      case timePeriods[ '6hours' ].index:
        this.multiplicityTime = timePeriods[ '6hours' ].seconds;
        return timePeriods[ '6hours' ].formatTime;
        break;
      case timePeriods[ '8hours' ].index:
        this.multiplicityTime = timePeriods[ '8hours' ].seconds;
        return timePeriods[ '8hours' ].formatTime;
        break;
      case timePeriods[ '12hours' ].index:
        this.multiplicityTime = timePeriods[ '12hours' ].seconds;
        return timePeriods[ '12hours' ].formatTime;
        break;
      case timePeriods[ '24hours' ].index:
        this.multiplicityTime = timePeriods[ '24hours' ].seconds;
        return timePeriods[ '24hours' ].formatTime;
        break;
    }
  }

  public displayFn( segmentation?: ISegmentation ): string | undefined {
    console.log( this.multiplicityTime );
    return segmentation ? segmentation.title : undefined;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
