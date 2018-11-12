import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { takeWhile } from 'rxjs/operators';
import { IMessages } from '../../../../interface/imessages';

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

  constructor( private messagesService: MessagesService ) { }

  ngOnInit(): void {
    this.isActive = true;
    this.progress = true;
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

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
