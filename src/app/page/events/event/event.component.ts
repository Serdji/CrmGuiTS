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

@Component( {
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: [ './event.component.styl' ]
} )
export class EventComponent implements OnInit, OnDestroy {

  public task: ITask;
  public isProgress: boolean;

  private taskId: number;
  private isActive: boolean;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private eventService: EventService,
    private listEventService: ListEventService
  ) { }

  ngOnInit() {
    this.isActive = true;
    this.isProgress = true;
    this.initQueryRouter();
  }

  private initQueryRouter() {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        this.taskId = +params.id;
        this.initTask( this.taskId );
      } );
  }

  private initTask( id: number ) {
    const success = ( value ) => {
      const tasks: ITask[] = value[ 0 ];
      const frequencySecLens = R.lensProp( 'frequencySec' );
      this.task = R.find( R.propEq( 'taskId', id ), tasks );
      this.task = R.set( frequencySecLens, moment.duration( { 'second': this.task.frequencySec } ).locale( this.translate.store.currentLang ).humanize(), this.task );
      this.isProgress = false;
      console.log( this.task );
    };

    const listEventService = this.listEventService.getAllTasks();
    const translate = this.translate.get( 'MENU' );
    const servicesForkJoin = forkJoin( [ listEventService, translate ] );

    servicesForkJoin
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( success );
  }

  trigger(): void {
    const send = {
      TaskId: this.taskId,
      IsActive: true
    };
    console.log( send );
    // this.eventService.tackActivate( send )
    //   .pipe( takeWhile( _ => this.isActive ) )
    //   .subscribe();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
