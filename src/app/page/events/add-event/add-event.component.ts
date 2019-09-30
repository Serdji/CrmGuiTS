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
import { AddEventService } from './add-event.service';
import { ITask } from '../../../interface/itask';
import { Router } from '@angular/router';

@Component( {
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: [ './add-event.component.styl' ]
} )
export class AddEventComponent implements OnInit, OnDestroy {

  public formEvent: FormGroup;
  public segmentation: ISegmentation[];
  public segmentationOptions: Observable<ISegmentation[]>;
  public taskType: string;
  public maxSize: number;
  public task: ITask;

  private isActive: boolean;
  private segmentationId: number;
  private totalCount: number;

  constructor(
    private fb: FormBuilder,
    private listSegmentationService: ListSegmentationService,
    private addSegmentationService: AddSegmentationService,
    private addEventService: AddEventService,
    private router: Router,
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
      title: [ '', [ Validators.required ] ],
      taskType: '',
      multiplicity: '',
      segmentation: [ '', [ Validators.required ] ]
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
    this.formEvent.get( 'taskType' ).valueChanges
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( event => this.taskType = event );
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


  public getFormatTimeFn( value: number | null, key: string = 'formatTime' ): string {
    const returnFormatTime = ( formatTime: string ): string => {
      return R.path( [ formatTime, key ], timePeriods );
    };
    switch ( value ) {
      case timePeriods[ '5min' ].index: return  returnFormatTime( '5min' ); break;
      case timePeriods[ '10min' ].index: return returnFormatTime( '10min' ); break;
      case timePeriods[ '15min' ].index: return returnFormatTime( '15min' ); break;
      case timePeriods[ '30min' ].index: return returnFormatTime( '30min' ); break;
      case timePeriods[ '60min' ].index: return returnFormatTime( '60min' ); break;
      case timePeriods[ '3hours' ].index: return returnFormatTime( '3hours' ); break;
      case timePeriods[ '6hours' ].index: return returnFormatTime( '6hours' ); break;
      case timePeriods[ '8hours' ].index: return returnFormatTime( '8hours' ); break;
      case timePeriods[ '12hours' ].index: return returnFormatTime( '12hours' ); break;
      case timePeriods[ '24hours' ].index: return returnFormatTime( '24hours' ); break;
    }
  }

  public displayFn( segmentation?: ISegmentation ): string | undefined {
    return segmentation ? segmentation.title : undefined;
  }

  addEvent( event ): void {
    const omit = R.omit( ['dateFrom', 'dateTo', 'text', 'templateId'] );
    const mergeParams = R.merge( {
      title: this.formEvent.get( 'title' ).value,
      taskType: this.taskType,
      frequencySec: this.getFormatTimeFn( this.formEvent.get('multiplicity').value, 'seconds' ),
      DistributionTemplate: event.text,
      footer: ''
    } );
    // @ts-ignore
    const paramsCompose = R.compose(  mergeParams, omit );
    const params = paramsCompose( event );
    if ( !this.formEvent.invalid ) {
      console.log( params );
      this.addEventService.createTask( params )
        .pipe( takeWhile( _ => this.isActive ) )
        .subscribe( ( task: ITask ) => {
          this.router.navigate( [ `/crm/event/${task.taskId}` ] );
        } );
    }
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}















