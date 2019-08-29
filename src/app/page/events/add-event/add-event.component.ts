import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { map, takeWhile } from 'rxjs/operators';
import { ISegmentation } from '../../../interface/isegmentation';
import { Observable } from 'rxjs';
import * as R from 'ramda';
import { AddSegmentationService } from '../../segmentation/add-segmentation/add-segmentation.service';
import * as _ from 'lodash';
import { ISegmentationProfile } from '../../../interface/isegmentation-profile';

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
    this.initFormEvent();
    this.initSegmentation();
    this.initAutocomplete();
    this.initTotalCount();
    this.initSwitchTypeEvent();
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

  public formatLabel( value: number | null ) {
    let time;
    const secMin = 60;
    const secHour = secMin * 60;
    console.log( this.multiplicityTime );
    switch ( value ) {
      case 1:
        time = 5;
        this.multiplicityTime = time * secMin;
        return time + 'м';
        break;
      case 2:
        time = 10;
        this.multiplicityTime = time * secMin;
        return time + 'м';
        break;
      case 3:
        time = 15;
        this.multiplicityTime = time * secMin;
        return time + 'м';
        break;
      case 4:
        time = 30;
        this.multiplicityTime = time * secMin;
        return time + 'м';
        break;
      case 5:
        time = 60;
        this.multiplicityTime = time * secMin;
        return time + 'м';
        break;
      case 6:
        time = 3;
        this.multiplicityTime = time * secHour;
        return time + 'ч';
        break;
      case 7:
        time = 6;
        this.multiplicityTime = time * secHour;
        return time + 'ч';
        break;
      case 8:
        time = 8;
        this.multiplicityTime = time * secHour;
        return time + 'ч';
        break;
      case 9:
        time = 12;
        this.multiplicityTime = time * secHour;
        return time + 'ч';
        break;
      case 10:
        time = 24;
        this.multiplicityTime = time * secHour;
        return time + 'ч';
        break;
    }
  }

  public displayFn( segmentation?: ISegmentation ): string | undefined {
    return segmentation ? segmentation.title : undefined;
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


  addEvent( event ): void {
    console.log( event );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
