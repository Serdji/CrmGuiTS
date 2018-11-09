import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.styl']
})
export class MessagesComponent implements OnInit, OnDestroy {

  @Input() id: number;

   private isActive: boolean;
   private progress: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
    this.progress = true;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
