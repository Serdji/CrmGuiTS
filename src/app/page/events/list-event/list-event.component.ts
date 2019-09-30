import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListEventService } from './list-event.service';
import { takeWhile } from 'rxjs/operators';
import { ITask } from '../../../interface/itask';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { ISegmentation } from '../../../interface/isegmentation';
import * as R from 'ramda';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';

@Component( {
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: [ './list-event.component.styl' ]
} )
export class ListEventComponent implements OnInit, OnDestroy {

  public isTableTask: boolean;
  public isProgress: boolean;
  public tasks: ITask[];

  private isActive: boolean;

  constructor(
    private listEventService: ListEventService,
    private listSegmentationService: ListSegmentationService,
  ) { }

  ngOnInit(): void {
    this.isTableTask = true;
    this.isProgress = true;
    this.isActive = true;
    this.initTableTasks();
  }

  initTableTasks() {
    const success = ( value ) => {
      const tasks: ITask[] = value[ 0 ];
      const segmentations: ISegmentation[] = value[ 1 ];
      const mapSegmentationName = R.map( ( task: ITask ) => {
        const frequencySecLens = R.lensProp( 'frequencySec' );
        const segmentation = R.find( R.propEq( 'segmentationId', task.segmentationId ), segmentations );
        task = R.set( frequencySecLens, moment.duration( { 'second': task.frequencySec } ).locale( 'ru' ).humanize(), task );
        return R.merge( task, { segmentation: segmentation.title } );
      } );
      this.tasks = mapSegmentationName( tasks );
      this.isProgress = false;
      if ( tasks.length === 0 ) this.isTableTask = false;
    };
    const error = _ => {
      this.isTableTask = false;
      this.isProgress = false;
    };

    const listEvent = this.listEventService.getAllTasks();
    const listSegmentation = this.listSegmentationService.getSegmentation();
    const servicesForkJoin = forkJoin( [ listEvent, listSegmentation ] );

    servicesForkJoin
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success, error );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }
}
