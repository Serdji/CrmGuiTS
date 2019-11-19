import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { takeWhile } from 'rxjs/operators';
import { IMessages } from '../../../../interface/imessages';
import * as _ from 'lodash';
import { timer } from 'rxjs';
import * as R from 'ramda';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component( {
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: [ './messages.component.styl' ]
} )
export class MessagesComponent implements OnInit, OnDestroy {

  @Input() id: number;
  @Input() data: { distributionId: number };

  public messages: IMessages[];
  public progress: boolean;
  public distributionId: number;


  private isSortFilterReverse: boolean;

  constructor( private messagesService: MessagesService ) { }

  ngOnInit(): void {

    this.progress = true;
    this.isSortFilterReverse = false;
    this.intiMessages();
  }

  private intiMessages() {
    this.messagesService.getMessages( this.id )
      .pipe( untilDestroyed(this) )
      .subscribe( ( messages: IMessages[] ) => {

        const setUpperFirst = ( obj, path ) => _.set( obj, path, _.upperFirst( _.get( obj, path ) ) );
        this.messages = _.map( messages, message => setUpperFirst( message, 'parsedSubject' ) );

        this.progress = false;
      } );
    this.distributionId = this.data ? this.data.distributionId : 0;
  }

  sortFilter( title: string ): void {
    const isSortFilterReverse = _ => this.isSortFilterReverse = !this.isSortFilterReverse;
    const isSortFilterReverseFunc = R.ifElse( isSortFilterReverse, R.identity, R.reverse );
    const sortByTitle = R.compose( R.sortBy, R.path, R.split( '.' ) );
    const funcSortByTitle = R.compose(
      isSortFilterReverseFunc,
      sortByTitle( title )
    );
    this.messages = funcSortByTitle( this.messages );
  }

  onOpenPanel( id: number ): void {
    timer( 0 )
      .pipe(
        untilDestroyed(this),
        takeWhile( _ => !!this.data ),
        takeWhile( _ => this.data.distributionId !== 0 ),
      )
      .subscribe( _ => {
        const panel: HTMLElement = document.getElementById( R.toString( id ) );
        panel.scrollIntoView();
        this.data.distributionId = 0;
      } );
  }

  ngOnDestroy(): void {}

}
