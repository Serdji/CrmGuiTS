import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-sms',
  templateUrl: './list-sms.component.html',
  styleUrls: ['./list-sms.component.styl']
})
export class ListSmsComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
