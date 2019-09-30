import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { EventService } from './event.service';

@Component( {
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: [ './event.component.styl' ]
} )
export class EventComponent implements OnInit, OnDestroy {

  private taskId: number;
  private isActive: boolean;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.isActive = true;
    this.initQueryRouter();
  }

  private initQueryRouter() {
    this.route.params
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( params => {
        this.taskId = params.id;
      } );
  }

  // trigger(): void {
  //   const send = {
  //     TaskId: this.task.taskId,
  //     IsActive: true
  //   };
  //   this.eventService.tackActivate( send )
  //     .pipe( takeWhile( _ => this.isActive ) )
  //     .subscribe();
  // }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
