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
        this.messages = messages;
        this.progress = false;
      } );
  }

  sortFilter( title: string ): void {
    this.messages = _.chain( this.messages )
      .sortBy( title )
      .thru( val => {
        this.isSortFilterReverse = !this.isSortFilterReverse;
        if ( this.isSortFilterReverse ) return val;
        else return _.reverse( val );
      } )
      .value();
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
