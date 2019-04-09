import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-privileges',
  templateUrl: './privileges.component.html',
  styleUrls: ['./privileges.component.styl']
})
export class PrivilegesComponent implements OnInit, OnDestroy {

  private isActive: boolean;

  @Input() id: number;

  constructor() { }

  ngOnInit(): void {
    this.isActive = true;
  }

  ngOnDestroy(): void {
    this.isActive = false;
  }

}
