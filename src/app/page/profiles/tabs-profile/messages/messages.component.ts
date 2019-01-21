import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { takeWhile } from 'rxjs/operators';
import { IMessages } from '../../../../interface/imessages';
import * as _ from 'lodash';

@Component( {
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: [ './messages.component.styl' ]
} )
export class MessagesComponent implements OnInit, OnDestroy {

  @Input() id: number;

  public messages: IMessages[];
  public progress: boolean;

  private isActive: boolean;
  private isSortFilterReverse: boolean;

  constructor( private messagesService: MessagesService ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.progress = true;
    this.isSortFilterReverse = false;
    this.intiMessages();
  }

  private intiMessages() {
    this.messagesService.getMessages( this.id )
      .pipe( takeWhile( _ => this.isActive ) )
      .subscribe( ( messages: IMessages[] ) => {

        const setUpperFirst = ( obj, path ) => _.set( obj , path, _.upperFirst( _.get( obj, path ) ) );
        this.messages = _.map( messages, message => setUpperFirst( message, 'parsedSubject' ) );

        this.progress = false;
      } );
  }

  sortFilter( title: string ): void {
    this.isSortFilterReverse = !this.isSortFilterReverse;

    const sortByTitle = _.curry( ( titleEvn, arr ) => _.sortBy( arr, titleEvn ) );
    const sortFilterRevers = _.curry( ( isSortFilterReverse, arr ) => isSortFilterReverse ? arr : _.reverse( arr ) );
    const composeSortByTitle = _.flow( [ sortByTitle( title ), sortFilterRevers( this.isSortFilterReverse ) ] );

    this.messages = composeSortByTitle( this.messages );
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
