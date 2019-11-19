import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListEventService } from './list-event.service';
import { takeWhile } from 'rxjs/operators';
import { ITask } from '../../../interface/itask';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { ISegmentation } from '../../../interface/isegmentation';
import * as R from 'ramda';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { IpagPage } from '../../../interface/ipag-page';
import { ITaskLog } from '../../../interface/itask-log';
import { TableAsyncService } from '../../../services/table-async.service';
import { EventService } from '../event/event.service';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: [ './list-event.component.styl' ]
} )
export class ListEventComponent implements OnInit, OnDestroy {

  public isTableTask: boolean;
  public isProgress: boolean;
  public tasks: ITask[];
  public taskLog: ITaskLog;
  public isTableTaskLog: boolean;
  public isLoaderTaskLog: boolean;


  private taskId: number;

  constructor(
    private listEventService: ListEventService,
    private listSegmentationService: ListSegmentationService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private tableAsyncService: TableAsyncService,
    private eventService: EventService,
  ) { }

  ngOnInit(): void {
    this.isTableTask = true;
    this.isProgress = true;

    this.isTableTaskLog = false;
    this.isLoaderTaskLog = true;
    this.initQueryParams();
    this.initTableFilter();
    this.initTableTasks();
    this.initTableTasksLog();
  }

  private initQueryParams() {
    this.route.queryParams
      .pipe( untilDestroyed(this) )
      .subscribe( ( res: { promotionName: number[], from: number, count: number } ) => {
        const isRes = !R.isEmpty( res );
        if ( isRes ) this.initTableTasksLogPaginator( res );
      } );
  }
  private initTableFilter() {
    this.tableAsyncService.subjectFilter
      .pipe( untilDestroyed(this) )
      .subscribe( paramsFilter => {
        let params = {
          taskId: this.taskId,
          from: 0,
          count: 10
        };
        params = R.merge( params, paramsFilter );
        this.eventService.getSearchTackLogs( params )
          .pipe( untilDestroyed(this) )
          .subscribe( ( taskLog: ITaskLog ) => this.tableAsyncService.setTableDataSource( taskLog.result ) );
      } );
  }

  private initTableTasksLogPaginator( searchParams ) {
    this.taskId = +searchParams.taskId;
    this.isTableTaskLog = true;
    this.isLoaderTaskLog = true;
    this.eventService.getSearchTackLogs( searchParams )
      .pipe( untilDestroyed(this) )
      .subscribe( ( taskLog: ITaskLog ) => {
        this.tableAsyncService.countPage = taskLog.totalRows;
        this.taskLog = taskLog;
        this.isLoaderTaskLog = false;
      } );
  }


  private initTableTasksLog() {
    this.tableAsyncService.subjectPage
      .pipe( untilDestroyed(this) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const paramsAndCount = {
          taskId: this.taskId,
          from: pageIndex,
          count: value.pageSize
        };
        this.eventService.getSearchTackLogs( paramsAndCount )
          .pipe( untilDestroyed(this) )
          .subscribe( ( taskLog: ITaskLog ) => this.tableAsyncService.setTableDataSource( taskLog.result ) );
      } );
  }

  initTableTasks() {
    const success = ( value ) => {
      const tasks: ITask[] = value[ 0 ];
      const segmentations: ISegmentation[] = value[ 1 ];
      const mapSegmentationName = R.map( ( task: ITask ) => {
        const frequencySecLens = R.lensProp( 'frequencySec' );
        const segmentation = R.find( R.propEq( 'segmentationId', task.segmentationId ), segmentations );
        task = R.set( frequencySecLens, moment.duration( { 'second': task.frequencySec } ).locale( this.translate.store.currentLang ).humanize(), task );
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
    const translate = this.translate.get( 'MENU' );
    const servicesForkJoin = forkJoin( [ listEvent, listSegmentation, translate ] );

    servicesForkJoin
      .pipe( untilDestroyed(this) )
      .subscribe( success, error );
  }

  ngOnDestroy(): void {}
}
