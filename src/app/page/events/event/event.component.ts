import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { EventService } from './event.service';
import { ITask } from '../../../interface/itask';
import { ListEventService } from '../list-event/list-event.service';
import * as R from 'ramda';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ListSegmentationService } from '../../segmentation/list-segmentation/list-segmentation.service';
import { ISegmentation } from '../../../interface/isegmentation';
import { IpagPage } from '../../../interface/ipag-page';
import { IPromotions } from '../../../interface/ipromotions';
import { TableAsyncService } from '../../../services/table-async.service';
import { ITaskLog } from '../../../interface/itask-log';

@Component( {
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: [ './event.component.styl' ]
} )
export class EventComponent implements OnInit, OnDestroy {

  public task: ITask;
  public isProgress: boolean;
  public startButtonDisabled: boolean;
  public stopButtonDisabled: boolean;
  public taskLog: ITaskLog;
  public isLoader: boolean;

  private taskId: number;
  private isActive: boolean;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private eventService: EventService,
    private listSegmentationService: ListSegmentationService,
    private tableAsyncService: TableAsyncService
  ) { }

  ngOnInit() {
    this.isActive = true;
    this.isProgress = true;
    this.startButtonDisabled = false;
    this.stopButtonDisabled = false;
    this.isLoader = true;
    this.initParamsRouter();
    this.initTable();
    this.initTablePagination();
    this.initTableFilter();
  }

  private initParamsRouter() {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        this.taskId = +params.id;
        this.initTask( this.taskId );
      } );
  }

  private initTableFilter() {
    this.tableAsyncService.subjectFilter
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( paramsFilter => {
        let params = {
          taskId: this.taskId,
          from: 0,
          count: 10
        };
        params = R.merge( params, paramsFilter );
        this.eventService.getSearchTackLogs( params )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( ( taskLog: ITaskLog ) => this.tableAsyncService.setTableDataSource( taskLog.result ) );
      } );
  }

  private initTablePagination() {
    this.tableAsyncService.subjectPage
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( value: IpagPage ) => {
        const pageIndex = value.pageIndex * value.pageSize;
        const params = {
          taskId: this.taskId,
          from: pageIndex,
          count: value.pageSize
        };
        this.eventService.getSearchTackLogs( params )
          .pipe( takeWhile( _ => this.isActive ) )
          .subscribe( ( taskLog: ITaskLog ) => this.tableAsyncService.setTableDataSource( taskLog.result ) );
      } );
  }

  private initTable() {
    const params = {
      taskId: this.taskId,
      from: 0,
      count: 10
    };
    this.eventService.getSearchTackLogs( params )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( taskLog: ITaskLog ) => {
        this.tableAsyncService.countPage = taskLog.totalRows;
        this.taskLog = taskLog;
        this.isLoader = false;
      } );
  }

  private initTask( id: number ) {
    const success = ( value ) => {
      const task: ITask = value[ 0 ];
      const segmentations: ISegmentation[] = value[ 1 ];
      const frequencySecLens = R.lensProp( 'frequencySec' );
      const segmentation = R.find( R.propEq( 'segmentationId', task.segmentationId ), segmentations );
      this.task = R.set( frequencySecLens, moment.duration( { 'second': task.frequencySec } ).locale( this.translate.store.currentLang ).humanize(), task );
      this.task = R.merge( this.task, { segmentation: segmentation.title } );
      this.isProgress = false;
      this.startButtonDisabled = this.task.isActive;
      this.stopButtonDisabled = !this.task.isActive;
    };

    const eventService = this.eventService.getTask( id );
    const listSegmentation = this.listSegmentationService.getSegmentation();
    const translate = this.translate.get( 'MENU' );
    const servicesForkJoin = forkJoin( [ eventService, listSegmentation, translate ] );

    servicesForkJoin
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success );
  }


  start(): void {
    this.startButtonDisabled = true;
    const send = {
      TaskId: this.taskId,
      IsActive: true
    };
    this.eventService.tackActivate( send )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.initTask( this.taskId ) );
  }

  stop(): void {
    this.stopButtonDisabled = true;
    const send = {
      TaskId: this.taskId,
      IsActive: false
    };
    this.eventService.tackActivate( send )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( _ => this.initTask( this.taskId ) );
  }


  ngOnDestroy(): void {
    this.isActive = false;
  }

}
